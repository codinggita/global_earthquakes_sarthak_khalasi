import UserReport from '../models/UserReport.js';
import Earthquake from '../models/Earthquake.js';
import ApiError from '../utils/apiError.js';

class UserReportService {
  /**
   * Submit a new earthquake felt report.
   */
  static async createReport(userId, data) {
    const { earthquakeId, feltIntensity, comments, coordinates } = data;

    if (!earthquakeId) {
      throw new ApiError(400, 'Earthquake ID is required to submit a report.');
    }

    // Verify earthquake exists and is not soft-deleted
    let eq = null;
    if (earthquakeId.match(/^[0-9a-fA-F]{24}$/)) {
      eq = await Earthquake.findOne({ _id: earthquakeId, isDeleted: false });
    } else {
      eq = await Earthquake.findOne({ eventId: earthquakeId, isDeleted: false });
    }

    if (!eq) {
      throw new ApiError(404, `Referenced earthquake event [${earthquakeId}] not found.`);
    }

    // Check if user already reported this earthquake (prevent spam, exclude soft-deleted reports)
    const existing = await UserReport.findOne({ user: userId, earthquake: eq._id, isDeleted: false });
    if (existing) {
      throw new ApiError(400, 'You have already submitted a felt report for this earthquake.');
    }

    const reportData = {
      user: userId,
      earthquake: eq._id,
      feltIntensity,
      comments,
    };

    if (coordinates) {
      reportData.location = {
        type: 'Point',
        coordinates, // [longitude, latitude]
      };
    }

    return await UserReport.create(reportData);
  }

  /**
   * Retrieves a single report (owner or admin only).
   */
  static async getReportById(id, userId, role) {
    // isDeleted: false ensures soft-deleted reports are invisible
    const report = await UserReport.findOne({ _id: id, isDeleted: false })
      .populate('user', 'username email')
      .populate('earthquake', 'eventId title mag time place');
    
    if (!report) {
      throw new ApiError(404, `User report with ID [${id}] not found.`);
    }

    // Access control: only owner or admin can retrieve specific full details
    if (report.user._id.toString() !== userId.toString() && role !== 'admin') {
      throw new ApiError(403, 'You are not authorized to view this report.');
    }

    return report;
  }

  /**
   * List reports with sorting, pagination, and filtering.
   */
  static async listReports(query, userId, role) {
    // Always exclude soft-deleted reports from public listings
    const filter = { isDeleted: false };

    // Standard users can only view their own reports, admins can view all or filter by user
    if (role !== 'admin') {
      filter.user = userId;
    } else if (query.userId) {
      filter.user = query.userId;
    }

    // Filter by earthquake
    if (query.earthquakeId) {
      let eq = null;
      if (query.earthquakeId.match(/^[0-9a-fA-F]{24}$/)) {
        eq = await Earthquake.findOne({ _id: query.earthquakeId, isDeleted: false });
      } else {
        eq = await Earthquake.findOne({ eventId: query.earthquakeId, isDeleted: false });
      }
      if (eq) {
        filter.earthquake = eq._id;
      } else {
        // If earthquake not found, return empty results
        return { results: [], pagination: { totalRecords: 0, totalPages: 0, currentPage: 1, limit: 20 } };
      }
    }

    // Filter by felt intensity (e.g. minIntensity)
    if (query.minIntensity !== undefined) {
      filter.feltIntensity = { $gte: parseInt(query.minIntensity, 10) };
    }

    // Pagination
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await UserReport.countDocuments(filter);
    const results = await UserReport.find(filter)
      .populate('user', 'username email')
      .populate('earthquake', 'eventId title mag time place')
      .sort({ createdAt: -1 })
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
   * Update report fields (owner only).
   */
  static async updateReport(id, userId, data) {
    // isDeleted: false so soft-deleted reports cannot be edited
    const report = await UserReport.findOne({ _id: id, isDeleted: false });

    if (!report) {
      throw new ApiError(404, `User report with ID [${id}] not found.`);
    }

    // Access control: only owner can edit their own report
    if (report.user.toString() !== userId.toString()) {
      throw new ApiError(403, 'You are not authorized to update this report.');
    }

    const allowedUpdates = ['feltIntensity', 'comments', 'coordinates'];
    allowedUpdates.forEach((field) => {
      if (data[field] !== undefined) {
        if (field === 'coordinates') {
          report.location = {
            type: 'Point',
            coordinates: data.coordinates,
          };
        } else {
          report[field] = data[field];
        }
      }
    });

    return await report.save();
  }

  /**
   * Delete report (owner or admin only).
   */
  /**
   * Soft-deletes a user report by flipping isDeleted = true.
   * Owner can soft-delete their own report; Admin can soft-delete any report.
   * The document is retained in the database for audit and recovery purposes.
   */
  static async deleteReport(id, userId, role) {
    const report = await UserReport.findOne({ _id: id, isDeleted: false });

    if (!report) {
      throw new ApiError(404, `User report with ID [${id}] not found.`);
    }

    // Access control
    if (report.user.toString() !== userId.toString() && role !== 'admin') {
      throw new ApiError(403, 'You are not authorized to delete this report.');
    }

    report.isDeleted = true;
    await report.save();
    return report;
  }

  /**
   * Aggregate felt report statistics for a specific earthquake (Advanced aggregation).
   */
  static async getEarthquakeReportStats(earthquakeId) {
    let eq = null;
    if (earthquakeId.match(/^[0-9a-fA-F]{24}$/)) {
      eq = await Earthquake.findById(earthquakeId);
    } else {
      eq = await Earthquake.findOne({ eventId: earthquakeId });
    }

    if (!eq) {
      throw new ApiError(404, `Earthquake event [${earthquakeId}] not found.`);
    }

    const stats = await UserReport.aggregate([
      // Exclude soft-deleted reports so stats only reflect active submissions
      { $match: { earthquake: eq._id, isDeleted: false } },
      {
        $group: {
          _id: '$earthquake',
          totalReports: { $sum: 1 },
          averageIntensity: { $avg: '$feltIntensity' },
          maxIntensity: { $max: '$feltIntensity' },
          minIntensity: { $min: '$feltIntensity' },
        },
      },
      {
        $project: {
          _id: 0,
          totalReports: 1,
          averageIntensity: { $round: ['$averageIntensity', 2] },
          maxIntensity: 1,
          minIntensity: 1,
        },
      },
    ]);

    return stats.length > 0 ? stats[0] : { totalReports: 0, averageIntensity: 0, maxIntensity: 0, minIntensity: 0 };
  }

  /**
   * Patches an existing user report (Owner only).
   */
  static async patchReport(id, userId, data) {
    const disallowedFields = ['_id', 'user', 'earthquake', 'isDeleted'];
    disallowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        throw new ApiError(400, `Field [${field}] cannot be modified via PATCH.`);
      }
    });

    return await this.updateReport(id, userId, data);
  }
}

export default UserReportService;
