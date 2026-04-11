import mongoose from 'mongoose';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters'],
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITIES,
        message: `Priority must be one of: ${PRIORITIES.join(', ')}`,
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: `Status must be one of: ${STATUSES.join(', ')}`,
      },
      default: 'Pending',
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          return arr.every((t) => typeof t === 'string' && t.length <= 64);
        },
        message: 'Tags must be strings (max 64 chars each)',
      },
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
export { PRIORITIES, STATUSES };
