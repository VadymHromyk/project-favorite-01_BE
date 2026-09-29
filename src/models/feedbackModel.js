import { model, Schema, mongoose } from 'mongoose';

const feedbackSchema = new Schema(
  {
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location'
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32
    },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
  },
  { timestamps: true, versionKey: false },
);

export const Feedback = mongoose.models.Feedback || model('Feedback', feedbackSchema);
