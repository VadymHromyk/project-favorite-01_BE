import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Location } from "../models/location.js";
import { uploadImageToCloudinary } from "../utils/saveFileToCloudinary.js";
import { isValidObjectId } from "mongoose";

export const getUserByIdService = async (userId) => {
  if (!isValidObjectId(userId)) throw createHttpError(404, "User not found");

  const user = await User.findById(userId).select("name avatarUrl").lean();

  if (!user) throw createHttpError(404, "User not found");

  const articlesAmount = await Location.countDocuments({ ownerId: userId });

  return { ...user, articlesAmount };
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
