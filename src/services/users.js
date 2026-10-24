import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Location } from "../models/location.js";
import { uploadImageToCloudinary } from "../utils/saveFileToCloudinary.js";
import { isValidObjectId } from "mongoose";

export const getUserByIdService = async (userId) => {
  if (!isValidObjectId(userId)) throw createHttpError(404, "User not found");

  const [user, articlesAmount] = await Promise.all([
    User.findById(userId).select("name avatarUrl"),
    Location.countDocuments({ ownerId: userId }),
  ]);

  if (!user) throw createHttpError(404, "User not found");

  return { ...user.toJSON(), articlesAmount };
};

export const withArticlesAmount = async (user) => {
  const articlesAmount = await Location.countDocuments({ ownerId: user._id });

  return { ...user.toJSON(), articlesAmount };
};

export const updateUserProfileService = async (
  userId,
  updateData,
  avatarFile,
) => {
  let avatarUrl;

  if (avatarFile) {
    const cloudinaryResult = await uploadImageToCloudinary(avatarFile.buffer);
    avatarUrl = cloudinaryResult.secure_url;
  }

  const payload = {
    ...updateData,
    ...(avatarUrl && { avatarUrl }),
  };

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .lean();

  if (!updatedUser) throw createHttpError(404, "User not found");

  return updatedUser;
};
