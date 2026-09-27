import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import {
  clearSessionCookies,
  createSession,
  setSessionCookies,
} from "../services/auth.js";

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

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId, userId: req.user._id });
  }

  clearSessionCookies(res);

  res.status(204).send();
};
