import { model, Schema } from "mongoose";

const locationTypeSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    locationType: {
      type: String,
      required: true,
      trim: true,
    },

    region: {
      type: String,
      required: true,
      trim: true,
    },

    rate: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    feedbacksId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ],
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const LocationType = model("LocationType", locationTypeSchema);
