import UserReportService from '../services/userReportService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

class UserReportController {
  /**
   * Submit an earthquake felt report.
   * Route: POST /api/v1/reports
   */
  static create = asyncHandler(async (req, res) => {
    const report = await UserReportService.createReport(req.user.id, req.body);

    res.status(201).json(
      ApiResponse.success(201, report, 'Felt report submitted successfully')
    );
  });

  /**
   * Retrieves all reports (users see their own, admins see all).
   * Route: GET /api/v1/reports
   */
  static list = asyncHandler(async (req, res) => {
    const { results, pagination } = await UserReportService.listReports(req.query, req.user.id, req.user.role);

    res.status(200).json(
      ApiResponse.success(200, results, 'Felt reports retrieved successfully', pagination)
    );
  });

  /**
   * Retrieves detailed statistics on reports for a specific earthquake.
   * Route: GET /api/v1/reports/earthquake/:earthquakeId/stats
   */
  static getStats = asyncHandler(async (req, res) => {
    const stats = await UserReportService.getEarthquakeReportStats(req.params.earthquakeId);

    res.status(200).json(
      ApiResponse.success(200, stats, 'Felt reports statistical summary compiled successfully')
    );
  });

  /**
   * Retrieves a single report.
   * Route: GET /api/v1/reports/:id
   */
  static getOne = asyncHandler(async (req, res) => {
    const report = await UserReportService.getReportById(req.params.id, req.user.id, req.user.role);

    res.status(200).json(
      ApiResponse.success(200, report, 'Felt report retrieved successfully')
    );
  });

  /**
   * Updates an existing report (owner only).
   * Route: PUT /api/v1/reports/:id
   */
  static update = asyncHandler(async (req, res) => {
    const report = await UserReportService.updateReport(req.params.id, req.user.id, req.body);

    res.status(200).json(
      ApiResponse.success(200, report, 'Felt report updated successfully')
    );
  });

  /**
   * Deletes a report (owner or admin only).
   * Route: DELETE /api/v1/reports/:id
   */
  static delete = asyncHandler(async (req, res) => {
    const report = await UserReportService.deleteReport(req.params.id, req.user.id, req.user.role);

    res.status(200).json(
      ApiResponse.success(200, { deletedId: report._id }, 'Felt report deleted successfully')
    );
  });

  /**
   * Patches an existing report (owner only).
   * Route: PATCH /api/v1/reports/:id
   */
  static patch = asyncHandler(async (req, res) => {
    const report = await UserReportService.patchReport(req.params.id, req.user.id, req.body);

    res.status(200).json(
      ApiResponse.success(200, report, 'Felt report patched successfully')
    );
  });
}

export default UserReportController;
