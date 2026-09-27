import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
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

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, "Missing refresh token");
  }

  if (!isValidObjectId(sessionId)) {
    throw createHttpError(401, "Session not found");
  }

  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.deleteOne({ _id: session._id });
    clearSessionCookies(res);
    throw createHttpError(401, "Session token expired");
  }

  await Session.deleteOne({ _id: session._id });

  const newSession = await createSession(session.userId);

  setSessionCookies(res, newSession);

  res.status(200).json({ message: "Session refreshed" });
};
