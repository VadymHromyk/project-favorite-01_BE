import createHttpError from "http-errors";
import { Location } from "../models/location.js";
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
    sortBy = "_id",
    sortOrder = "asc",
    region,
    locationType,
    rate,
    search,
  } = req.query;
  const skip = (page - 1) * perPage;
  const locationQuery = Location.find();

  if (region) {
    locationQuery.where("region").equals(region);
  }
  if (locationType) {
    locationQuery.where("locationType").equals(locationType);
  }

  if (rate) {
    locationQuery.where("rate").equals(rate);
  }

  if (search) {
    locationQuery.where({
      $or: [
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
      ],
    });
  }

  const [locations, totalItems] = await Promise.all([
    locationQuery
      .clone()
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder === "asc" ? -1 : 1,
      })
      .populate("ownerId", "name"),
    locationQuery.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);
  res.json({
    locations,
    totalItems,
    totalPages,
    page,
    perPage,
  });
  console.log(req.query);
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

  // ownerId has no ref in the schema yet, so the model must be passed explicitly
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
