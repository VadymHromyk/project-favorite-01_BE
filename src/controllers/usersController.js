import { User } from "../models/user.js";
import { Location } from "../models/location.js";

export const getPublicUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("username");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    data: user,
  });
};

export const getUserLocations = async (req, res) => {
  const { userId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

  const skip = (page - 1) * limit;

  const filter = {
    owner: userId,
  };

  const [locations, totalItems] = await Promise.all([
    Location.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Location.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    data: locations,
    page,
    limit,
    totalItems,
    totalPages,
  });
};
