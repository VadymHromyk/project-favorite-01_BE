import { model, Schema } from "mongoose";

const regionSchema = new Schema(
  {
    region: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["регіональне", "обласне", "локальне"],
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const Region = model("Region", regionSchema);
