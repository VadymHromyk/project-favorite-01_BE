import createHttpError from "http-errors";
import { User } from "../models/user.js";

export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId)
    .select("name avatarUrl articlesAmount")
    .lean();

  if (!user) throw createHttpError(404, "User not found");

  return user;
};
