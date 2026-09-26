import { model, Schema } from "mongoose";

const locationTypeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
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

export const LocationType = model(
  "LocationType",
  locationTypeSchema,
  "location_types",
);
