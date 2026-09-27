import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { createSession, setSessionCookies } from "../services/auth.js";

export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    username: name,
  });

  const newSession = await createSession(newUser._id);

  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Email or password invalid");
  }

  const isEqualPassword = await bcrypt.compare(password, user.password);
  if (!isEqualPassword) {
    throw createHttpError(401, "Email or password invalid");
  }

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json({
    status: 200,
    message: "User logged in successfully",
    data: user,
  });
};
