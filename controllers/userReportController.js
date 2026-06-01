import UserReportService from '../services/userReportService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Controller class for User Felt Reports route handlers.
 */
class UserReportController {
  /**
   * Submits a new crowd-sourced felt intensity report.
   * Route: POST /api/v1/reports
   */
  static submit = asyncHandler(async (req, res) => {
    const { earthquakeId, feltIntensity, comments } = req.body;
    const userId = req.user.id; // Extracted from auth protect middleware

    const report = await UserReportService.submitReport(
      userId,
      earthquakeId,
      parseInt(feltIntensity, 10),
      comments
    );

    res.status(201).json(
      ApiResponse.success(201, report, 'Felt report submitted successfully')
    );
  });

  /**
   * Retrieves all reports associated with an earthquake.
   * Route: GET /api/v1/reports/earthquake/:eventId
   */
  static getByEarthquake = asyncHandler(async (req, res) => {
    const reports = await UserReportService.getReportsForEarthquake(req.params.eventId);

    res.status(200).json(
      ApiResponse.success(200, reports, 'Felt reports retrieved successfully')
    );
  });

  /**
   * Deletes a felt report.
   * Route: DELETE /api/v1/reports/:id
   */
  static delete = asyncHandler(async (req, res) => {
    const reportId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    await UserReportService.deleteReport(reportId, userId, userRole);

    res.status(200).json(
      ApiResponse.success(200, null, 'Felt report deleted successfully')
    );
  });
}

export default UserReportController;
