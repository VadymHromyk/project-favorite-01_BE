import createHttpError from "http-errors";
import { Location } from "../models/location.js";
import { uploadImageToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getLocations = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = "_id",
    sortOrder = "asc",
    region,
    type,
    rate,
    search,
  } = req.query;
  const skip = (page - 1) * perPage;
  const locationQuery = Location.find();

  //! QUERY BUILDER

  if (region) {
    locationQuery.where("region").equals(region);
  }
  if (type) {
    locationQuery.where("type").equals(type);
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
        // {
        //   region: {
        //     $regex: region,
        //     $options: "i",
        //   },
        // },
        // {
        //   type: {
        //     $regex: type,
        //     $options: "i",
        //   },
        // },
      ],
    });
  }

  const [locations, totalItems] = await Promise.all([
    locationQuery
      .clone()
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder === "desc" ? -1 : 1,
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
