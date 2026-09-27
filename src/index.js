import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logger.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errors } from "celebrate";
import cookieParser from "cookie-parser";
import locationsRouter from "./routes/locationsRouter.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3030;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", locationsRouter);

app.use(authRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

try {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
}
