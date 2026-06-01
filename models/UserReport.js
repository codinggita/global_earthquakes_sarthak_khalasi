import mongoose from 'mongoose';

const userReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    earthquake: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Earthquake',
      required: [true, 'Earthquake reference is required'],
    },
    feltIntensity: {
      type: Number,
      required: [true, 'Felt intensity level is required'],
      min: [1, 'Intensity must be at least 1 (Not felt)'],
      max: [10, 'Intensity cannot exceed 10 (Extreme destruction)'],
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [500, 'Comments cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true, // Audit timestamps
  }
);

// Prevent a user from submitting multiple reports for the same earthquake event
userReportSchema.index({ user: 1, earthquake: 1 }, { unique: true });

const UserReport = mongoose.model('UserReport', userReportSchema);

export default UserReport;
