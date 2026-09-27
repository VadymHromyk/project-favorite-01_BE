import { User } from "../models/user.js";
import createHttpError from "http-errors";

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

    const user = await User.findById(userId).select("name avatarUrl");

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({
      status: 200,
      message: "Public user profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};