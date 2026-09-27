import multer from "multer";
import createHttpError, { HttpError } from "http-errors";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  // must be strictly smaller than 1MB
  limits: { fileSize: MAX_FILE_SIZE - 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(createHttpError(400, "Image must be jpg or png"));
    }
    cb(null, true);
  },
});

export const uploadLocationImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(createHttpError(400, "Image must be smaller than 1MB"));
      }
      return next(createHttpError(400, err.message));
    }
    if (err instanceof HttpError) {
      return next(err);
    }
    // malformed multipart body from the parser, e.g. "Unexpected end of form"
    if (err) {
      return next(createHttpError(400, "Invalid multipart form data"));
    }
    if (req.file && req.file.size === 0) {
      return next(createHttpError(400, "Image must not be empty"));
    }
    next();
  });
};
