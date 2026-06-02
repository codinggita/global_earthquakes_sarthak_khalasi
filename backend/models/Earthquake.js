import mongoose from 'mongoose';

const earthquakeSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: [true, 'Event ID is required'],
      unique: true,
      index: true,
      trim: true,
    },
    mag: {
      type: Number,
      required: [true, 'Magnitude is required'],
      min: [-2.0, 'Magnitude cannot be less than -2.0'],
      max: [12.0, 'Magnitude cannot exceed 12.0'],
    },
    place: {
      type: String,
      required: [true, 'Place is required'],
      trim: true,
    },
    time: {
      type: Date,
      required: [true, 'Time is required'],
      index: true,
    },
    updated: {
      type: Date,
    },
    tz: {
      type: Number,
      default: null,
    },
    url: {
      type: String,
      trim: true,
    },
    detail: {
      type: String,
      trim: true,
    },
    felt: {
      type: Number,
      default: 0,
    },
    cdi: {
      type: Number,
      default: null,
    },
    mmi: {
      type: Number,
      default: null,
    },
    alert: {
      type: String,
      enum: ['green', 'yellow', 'orange', 'red', null, ''],
      default: null,
    },
    status: {
      type: String,
      enum: ['automatic', 'reviewed'],
      default: 'automatic',
    },
    tsunami: {
      type: Boolean,
      default: false,
    },
    sig: {
      type: Number,
      default: null,
    },
    net: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    ids: {
      type: String,
      trim: true,
    },
    sources: {
      type: String,
      trim: true,
    },
    types: {
      type: String,
      trim: true,
    },
    nst: {
      type: Number,
      default: null,
    },
    dmin: {
      type: Number,
      default: null,
    },
    rms: {
      type: Number,
      default: null,
    },
    gap: {
      type: Number,
      default: null,
    },
    magType: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      default: 'earthquake',
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude, depth]
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function (arr) {
            return arr && arr.length === 3;
          },
          message: 'Coordinates must be exactly three numbers: [longitude, latitude, depth]',
        },
      },
    },
  },
  {
    timestamps: true, // Audit timestamps
  }
);

// Apply a 2dsphere index for spatial geolocation queries
earthquakeSchema.index({ geometry: '2dsphere' });

// Compound indexes for frequent searches
earthquakeSchema.index({ mag: -1, time: -1 });

const Earthquake = mongoose.model('Earthquake', earthquakeSchema);

export default Earthquake;
