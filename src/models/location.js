import { Schema, model } from "mongoose";

const locationSchema = new Schema(
  {
    image: {
      type: String,
      // default: "https://ac.goit.global/fullstack/react/default-avatar.jpg",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      // ref: "Type",
    },
    region: {
      type: String,
      // ref: "Region",
      required: true,
    },
    rate: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
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
      // ref: "User",
      required: true,
    },
    feedbacksId: {
      type: Schema.Types.ObjectId,
      // ref: "Feedback",
      required: true,
    },
    // attach: {
    //   // required: false,
    //   type: String,
    // },
  },
  { versionKey: false, timestamps: false },
);

locationSchema.index({ type: 1 });

export const Location = model("Location", locationSchema);
