import { Location } from "../models/location.js";

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
