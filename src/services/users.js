import { User } from '../models/user.js';

export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId).select('name avatarUrl');
  return user;
};