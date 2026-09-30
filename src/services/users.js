import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { uploadImageToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId)
    .select("name avatarUrl articlesAmount")
    .lean();

  if (!user) throw createHttpError(404, "User not found");

  return user;
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
