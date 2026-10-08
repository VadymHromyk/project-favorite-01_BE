import createHttpError from "http-errors";
import { Location } from "../models/location.js";
import { Feedback } from "../models/feedbackModel.js";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/saveFileToCloudinary.js";

export const getLocations = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    limit,
    sortBy = "_id",
    sortOrder = "asc",
    region,
    locationType,
    rate,
    search,
  } = req.query;

  const numericPage = Number(page) || 1;
  const pageSize = Number(limit ?? perPage) || 10;
  const skip = (numericPage - 1) * pageSize;
  const locationFilter = {};

  if (region) {
    locationFilter.region = region;
  }
  if (locationType) {
    locationFilter.locationType = Array.isArray(locationType)
      ? { $in: locationType }
      : locationType;
  }

  if (rate) {
    locationFilter.rate = Number(rate);
  }

  if (search) {
    locationFilter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  let sortStage;
  const order = sortOrder === "asc" ? 1 : -1;

  if (sortBy === "popular") {
    sortStage = { popularity: -1, createdAt: -1 };
  } else if (sortBy === "rating" || sortBy === "rate") {
    sortStage = { rate: order, createdAt: -1 };
  } else if (sortBy === "newest") {
    sortStage = { createdAt: -1 };
  } else {
    sortStage = { [sortBy]: order };
  }

  const pipeline = [
    { $match: locationFilter },
    {
      $lookup: {
        from: Feedback.collection.name,
        let: { locationId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$locationId", "$$locationId"] },
            },
          },
        ],
        as: "feedbacksData",
      },
    },
    {
      $addFields: {
        popularity: { $size: "$feedbacksData" },
        rate: {
          $cond: {
            if: { $gt: [{ $size: "$feedbacksData" }, 0] },
            then: { $avg: "$feedbacksData.rate" },
            else: { $ifNull: ["$rate", 0] },
          },
        },
      },
    },
    { $sort: sortStage },
    { $skip: skip },
    { $limit: pageSize },
    { $project: { feedbacksData: 0, popularity: 0 } },
  ];

  const [locations, totalItems] = await Promise.all([
    Location.aggregate(pipeline).then((results) =>
      Location.populate(results, { path: "ownerId", select: "name" }),
    ),
    Location.countDocuments(locationFilter),
  ]);

  const totalPages = Math.ceil(totalItems / pageSize);

  res.json({
    locations,
    totalItems,
    totalPages,
    page: numericPage,
    perPage: pageSize,
  });
};

export const updateLocationId = async (req, res) => {
  const { id } = req.params;
  const { _id: ownerId } = req.user;
  const { file } = req;

  const updateData = {
    ...req.body,
  };

  if (file) {
    const result = await uploadImageToCloudinary(file.buffer, id);

    if (result?.secure_url) {
      updateData.image = result.secure_url;
    }
  }

  const updateLocation = await Location.findOneAndUpdate(
    { _id: id, ownerId },
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  if (!updateLocation) {
    throw createHttpError(404, `Location with id=${id} not found`);
  }

  res.json(updateLocation);
};

export const createLocation = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, "Image is required");
  }

  const { secure_url, public_id } = await uploadImageToCloudinary(
    req.file.buffer,
  );

  let newLocation;
  try {
    newLocation = await Location.create({
      ...req.body,
      image: secure_url,
      ownerId: req.user._id,
      feedbacksId: [],
    });
  } catch (error) {
    await deleteImageFromCloudinary(public_id).catch((cleanupError) =>
      console.error("Failed to delete orphaned image:", cleanupError),
    );
    throw error;
  }

  res.status(201).json(newLocation);
};

export const getLocationById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw createHttpError(400, "Invalid location id");
  }

  const location = await Location.findById(id).populate({
    path: "ownerId",
    select: "name",
    model: User,
  });

  if (!location) {
    throw createHttpError(404, "Location not found");
  }

  res.status(200).json(location);
};
