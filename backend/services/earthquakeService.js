import Earthquake from '../models/Earthquake.js';
import ApiError from '../utils/apiError.js';

/**
 * Service class for Earthquake business logic and database queries.
 */
class EarthquakeService {
  /**
   * Create a new earthquake record (Admin only).
   */
  static async createEarthquake(data) {
    // Check both active and soft-deleted records to prevent duplicate eventIds
    const exists = await Earthquake.findOne({ eventId: data.eventId });
    if (exists) {
      throw new ApiError(400, `An earthquake with Event ID [${data.eventId}] already exists.`);
    }
    return await Earthquake.create(data);
  }

  /**
   * Retrieves a single earthquake by its eventId or MongoDB ObjectID.
   */
  static async getEarthquakeById(id) {
    let eq = null;

    // Check if id is a valid Mongoose ObjectId, otherwise look up by eventId
    // isDeleted: false ensures soft-deleted records are invisible
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      eq = await Earthquake.findOne({ _id: id, isDeleted: false });
    } else {
      eq = await Earthquake.findOne({ eventId: id, isDeleted: false });
    }

    if (!eq) {
      throw new ApiError(404, `Earthquake event with ID [${id}] not found.`);
    }
    return eq;
  }

  /**
   * Update an existing earthquake record (Admin only).
   */
  static async updateEarthquake(id, data) {
    let eq = await this.getEarthquakeById(id);

    // Update fields
    Object.keys(data).forEach((key) => {
      eq[key] = data[key];
    });

    return await eq.save();
  }

  /**
   * Safely deletes an earthquake record (Admin only).
   */
  /**
   * Soft-deletes an earthquake record by flipping isDeleted = true (Admin only).
   * The document is retained in the database for audit and recovery purposes.
   */
  static async deleteEarthquake(id) {
    const eq = await this.getEarthquakeById(id);
    eq.isDeleted = true;
    await eq.save();
    return eq;
  }

  /**
   * Lists, filters, searches, sorts and paginates earthquakes.
   * Fulfills Advanced Query requirements (Filter, Search, Pagination, Sort).
   */
  static async listEarthquakes(query) {
    // Always exclude soft-deleted records from public listings
    const filter = { isDeleted: false };

    // 1. DYNAMIC FILTER BUILDER (Good-to-have #12)
    
    // Magnitude filtering ($gt, $lt operators)
    if (query.minMag !== undefined || query.maxMag !== undefined) {
      filter.mag = {};
      if (query.minMag !== undefined) filter.mag.$gte = parseFloat(query.minMag);
      if (query.maxMag !== undefined) filter.mag.$lte = parseFloat(query.maxMag);
    }

    // Date range filtering
    if (query.startDate || query.endDate) {
      filter.time = {};
      if (query.startDate) filter.time.$gte = new Date(query.startDate);
      if (query.endDate) filter.time.$lte = new Date(query.endDate);
    }

    // Specific field matchers
    if (query.status) {
      filter.status = query.status;
    }

    if (query.alert) {
      filter.alert = query.alert;
    }

    if (query.tsunami !== undefined) {
      filter.tsunami = query.tsunami === 'true' || query.tsunami === true;
    }

    // Advanced Search using case-insensitive regex on place name
    if (query.search) {
      filter.place = { $regex: query.search, $options: 'i' };
    }

    // Geospatial Radius Proximity Filter (Requires 2dsphere index)
    if (query.latitude !== undefined && query.longitude !== undefined) {
      const lat = parseFloat(query.latitude);
      const lng = parseFloat(query.longitude);
      const maxDistKm = parseFloat(query.maxDistanceKm) || 500; // Default 500km radius

      // Earth radius ~6378.1 km
      const radiusInRadians = maxDistKm / 6378.1;

      filter.geometry = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians],
        },
      };
    }

    // 2. REUSABLE PAGINATION UTILITY (Good-to-have #11)
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // 3. SORT BUILDER
    let sortStr = '-time'; // Default newest first
    if (query.sort) {
      // Normalize fields e.g., 'mag' -> 'mag', '-mag' -> '-mag'
      sortStr = query.sort;
    }

    // 4. FIELD PROJECTION (Field selection)
    let projection = {};
    if (query.fields) {
      // Support comma-separated selection, e.g., 'mag,place,time' -> 'mag place time'
      const selectFields = query.fields.split(',').join(' ');
      projection = selectFields;
    }

    // Execute query
    const total = await Earthquake.countDocuments(filter);
    const results = await Earthquake.find(filter, projection)
      .sort(sortStr)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return {
      results,
      pagination: {
        totalRecords: total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * ADVANCED AGGREGATION FRAMEWORK PIPELINE (Requirement #16)
   * Provides multi-stage stats compiling: buckets, facets, region ranks, risk analysis
   */
  static async getEarthquakeStats() {
    const pipeline = [
      // Stage 1: Exclude soft-deleted records from all aggregation calculations
      { $match: { isDeleted: false } },

      // Stage 2: Facet-driven parallel pipelines
      {
        $facet: {
          // Facet A: Bucket events by magnitude classifications
          severityTiers: [
            {
              $bucket: {
                groupBy: '$mag',
                boundaries: [0, 4.0, 5.0, 6.0, 7.0, 10.0],
                default: 'Extreme',
                output: {
                  count: { $sum: 1 },
                  avgMag: { $avg: '$mag' },
                },
              },
            },
            {
              $project: {
                tier: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$_id', 0] }, then: 'Minor/Light (0 - 4.0)' },
                      { case: { $eq: ['$_id', 4.0] }, then: 'Moderate (4.0 - 5.0)' },
                      { case: { $eq: ['$_id', 5.0] }, then: 'Strong (5.0 - 6.0)' },
                      { case: { $eq: ['$_id', 6.0] }, then: 'Major (6.0 - 7.0)' },
                      { case: { $eq: ['$_id', 7.0] }, then: 'Great (7.0 - 10.0)' },
                    ],
                    default: 'Extreme/Other',
                  },
                },
                count: 1,
                avgMagnitude: { $round: ['$avgMag', 2] },
              },
            },
          ],

          // Facet B: Tsunami danger ratios
          tsunamiRisk: [
            {
              $group: {
                _id: '$tsunami',
                count: { $sum: 1 },
                avgMag: { $avg: '$mag' },
              },
            },
            {
              $project: {
                tsunamiTriggered: '$_id',
                count: 1,
                avgMagnitude: { $round: ['$avgMag', 2] },
              },
            },
          ],

          // Facet C: Regional seismic frequencies
          regionalFrequencies: [
            {
              $group: {
                _id: '$net', // Reporting network or source country code
                count: { $sum: 1 },
                maxMag: { $max: '$mag' },
                avgDepth: { $avg: { $arrayElemAt: ['$geometry.coordinates', 2] } },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
              $project: {
                reportingNetwork: '$_id',
                eventCount: '$count',
                maximumMagnitude: '$maxMag',
                averageDepthKm: { $round: ['$avgDepth', 1] },
              },
            },
          ],

          // Facet D: Time distribution metrics
          monthlyTrends: [
            {
              $group: {
                _id: {
                  year: { $year: '$time' },
                  month: { $month: '$time' },
                },
                count: { $sum: 1 },
                avgMag: { $avg: '$mag' },
              },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 },
            {
              $project: {
                year: '$_id.year',
                month: '$_id.month',
                eventCount: '$count',
                averageMagnitude: { $round: ['$avgMag', 2] },
              },
            },
          ],

          // Facet E: Top 5 most significant seismic events
          topSignificantEvents: [
            { $sort: { sig: -1 } },
            { $limit: 5 },
            {
              $project: {
                eventId: 1,
                title: 1,
                mag: 1,
                place: 1,
                sig: 1,
                time: 1,
              },
            },
          ],
        },
      },
    ];

    const stats = await Earthquake.aggregate(pipeline);
    return stats[0];
  }

  /**
   * Patches an existing earthquake record (Admin only).
   */
  static async patchEarthquake(id, data) {
    const disallowedFields = ['_id', 'id', 'eventId', 'isDeleted'];
    disallowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        throw new ApiError(400, `Field [${field}] cannot be modified via PATCH.`);
      }
    });

    return await this.updateEarthquake(id, data);
  }
}

export default EarthquakeService;
