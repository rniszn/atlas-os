import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const trackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Track name is required'],
      trim: true,
    },
    skills: {
      type: [skillSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Track = mongoose.model('Track', trackSchema);
