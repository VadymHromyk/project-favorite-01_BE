import { Schema, model } from "mongoose";

const locationSchema = new Schema(
  {
    image: {
      type: String,
      required: false,
      default: "https://picsum.photos/id/866/600/500",
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
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
      },
      lon: {
        type: Number,
      },
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedbacksId: {
      type: [{ type: Schema.Types.ObjectId }],
      ref: "Feedback",
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Location = model("Location", locationSchema);
