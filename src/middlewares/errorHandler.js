import { HttpError } from "http-errors";
import { MongooseError } from "mongoose";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof HttpError) {
    const { status = 500 } = err;

    return res.status(status).json({
      message: err.message || err.name,
    });
  }

  const isMongooseError =
    err instanceof MongooseError.ValidationError ||
    err instanceof MongooseError.CastError;

  if (isMongooseError) {
    return res.status(400).json({ message: err.message });
  }

  const isProd = process.env.NODE_ENV === "production";
  const message = isProd
    ? "Something went wrong. Please try again later."
    : err.message;
  res.status(500).json({
    message,
  });
};
