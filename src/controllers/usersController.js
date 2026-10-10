import { Location } from "../models/location.js";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import {
  getUserByIdService,
  updateUserProfileService,
} from "../services/users.js";

export const getUserLocations = async (req, res) => {
  const { userId } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

  const skip = (page - 1) * limit;

  const filter = {
    ownerId: userId,
  };

  const [locations, totalItems] = await Promise.all([
    Location.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Location.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  res.status(200).json({
    data: locations,
    page,
    limit,
    totalItems,
    totalPages,
  });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, "Not authorized");
    }

    res.status(200).json({
      status: 200,
      message: "User profile retrieved successfully",
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await getUserByIdService(userId);
    res.status(200).json({
      status: 200,
      message: "Public user profile retrieved successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editProfileController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;
    const avatarFile = req.file;

    const updatedUser = await updateUserProfileService(
      userId,
      updateData,
      avatarFile,
    );

    res.status(200).json({
      status: 200,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
