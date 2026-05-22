import UserReport from '../models/UserReport.js';
import Earthquake from '../models/Earthquake.js';
import ApiError from '../utils/apiError.js';

/**
 * Service class for User Felt Reports business logic.
 */
class UserReportService {
  /**
   * Submit a new felt report for an earthquake event.
   */
  static async submitReport(userId, earthquakeIdOrEventId, feltIntensity, comments) {
    // 1. Find the earthquake event
    let eq = null;
    if (earthquakeIdOrEventId.match(/^[0-9a-fA-F]{24}$/)) {
      eq = await Earthquake.findById(earthquakeIdOrEventId);
    } else {
      eq = await Earthquake.findOne({ eventId: earthquakeIdOrEventId });
    }

    if (!eq) {
      throw new ApiError(404, `Earthquake event with ID [${earthquakeIdOrEventId}] not found.`);
    }

    // 2. Prevent duplicate reports from the same user for this earthquake
    const duplicate = await UserReport.findOne({ user: userId, earthquake: eq._id });
    if (duplicate) {
      throw new ApiError(400, 'You have already submitted a felt report for this earthquake event.');
    }

    // 3. Create the report
    const report = await UserReport.create({
      user: userId,
      earthquake: eq._id,
      feltIntensity,
      comments,
    });

    // 4. Increment the crowd-sourced felt report count in the associated Earthquake document
    await Earthquake.findByIdAndUpdate(eq._id, { $inc: { felt: 1 } });

    // 5. Fetch report with populated user details (omitting sensitive fields)
    return await UserReport.findById(report._id)
      .populate('user', 'username email role')
      .populate('earthquake', 'eventId mag place time');
  }

  /**
   * Retrieves all felt reports for a specific earthquake.
   */
  static async getReportsForEarthquake(earthquakeIdOrEventId) {
    // Find the earthquake first
    let eq = null;
    if (earthquakeIdOrEventId.match(/^[0-9a-fA-F]{24}$/)) {
      eq = await Earthquake.findById(earthquakeIdOrEventId);
    } else {
      eq = await Earthquake.findOne({ eventId: earthquakeIdOrEventId });
    }

    if (!eq) {
      throw new ApiError(404, `Earthquake event with ID [${earthquakeIdOrEventId}] not found.`);
    }

    // Retrieve all reports and populate user info
    return await UserReport.find({ earthquake: eq._id })
      .populate('user', 'username email role')
      .sort('-createdAt');
  }

  /**
   * Delete a felt report (Requires ownership or Admin role).
   */
  static async deleteReport(reportId, userId, userRole) {
    const report = await UserReport.findById(reportId);
    if (!report) {
      throw new ApiError(404, `Felt report with ID [${reportId}] not found.`);
    }

    // Authorization: Must be the author of the report or an Admin
    if (report.user.toString() !== userId.toString() && userRole !== 'admin') {
      throw new ApiError(403, 'You are not authorized to delete this felt report.');
    }

    // Delete the report
    await UserReport.deleteOne({ _id: reportId });

    // Decrement the felt count in the Earthquake document
    await Earthquake.findByIdAndUpdate(report.earthquake, { $inc: { felt: -1 } });

    return report;
  }
}

export default UserReportService;
