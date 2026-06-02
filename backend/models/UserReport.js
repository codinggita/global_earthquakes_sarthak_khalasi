import mongoose from 'mongoose';

const userReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    earthquake: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Earthquake',
      required: [true, 'Earthquake reference is required'],
      index: true,
    },
    feltIntensity: {
      type: Number,
      required: [true, 'Felt intensity is required'],
      min: [1, 'Felt intensity must be at least 1 (Not felt)'],
      max: [10, 'Felt intensity cannot exceed 10 (Extreme)'],
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [500, 'Comments cannot exceed 500 characters'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        validate: {
          validator: function (arr) {
            return !arr || arr.length === 2;
          },
          message: 'Location coordinates must be [longitude, latitude]',
        },
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // Fast soft-delete filter queries
    },
  },
  {
    timestamps: true,
  }
);

// Geo-spatial index for user reports
userReportSchema.index({ location: '2dsphere' });

// Compound index for fast soft-delete + date queries
userReportSchema.index({ isDeleted: 1, createdAt: -1 });

const UserReport = mongoose.model('UserReport', userReportSchema);

export default UserReport;
