import EarthquakeService from '../services/earthquakeService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Controller class for Earthquake endpoints.
 */
class EarthquakeController {
  /**
   * Lists earthquakes with filters, sorting, search, pagination.
   * Route: GET /api/v1/earthquakes
   */
  static list = asyncHandler(async (req, res) => {
    const { results, pagination } = await EarthquakeService.listEarthquakes(req.query);

    res.status(200).json(
      ApiResponse.success(
        200, 
        results, 
        'Earthquake events retrieved successfully', 
        pagination
      )
    );
  });

  /**
   * Retrieves statistical analysis of earthquakes using aggregation.
   * Route: GET /api/v1/earthquakes/stats
   */
  static getStats = asyncHandler(async (req, res) => {
    const stats = await EarthquakeService.getEarthquakeStats();

    res.status(200).json(
      ApiResponse.success(
        200,
        stats,
        'Seismic statistical analysis compiled successfully'
      )
    );
  });

  /**
   * Retrieves a single earthquake record.
   * Route: GET /api/v1/earthquakes/:id
   */
  static getOne = asyncHandler(async (req, res) => {
    const eq = await EarthquakeService.getEarthquakeById(req.params.id);

    res.status(200).json(
      ApiResponse.success(200, eq, 'Earthquake event retrieved successfully')
    );
  });

  /**
   * Creates a new earthquake event (Admin only).
   * Route: POST /api/v1/earthquakes
   */
  static create = asyncHandler(async (req, res) => {
    const eq = await EarthquakeService.createEarthquake(req.body);

    res.status(201).json(
      ApiResponse.success(201, eq, 'Earthquake event logged successfully')
    );
  });

  /**
   * Updates an existing earthquake event (Admin only).
   * Route: PUT /api/v1/earthquakes/:id
   */
  static update = asyncHandler(async (req, res) => {
    const eq = await EarthquakeService.updateEarthquake(req.params.id, req.body);

    res.status(200).json(
      ApiResponse.success(200, eq, 'Earthquake event updated successfully')
    );
  });

  /**
   * Safely deletes an earthquake event (Admin only).
   * Route: DELETE /api/v1/earthquakes/:id
   */
  static delete = asyncHandler(async (req, res) => {
    const eq = await EarthquakeService.deleteEarthquake(req.params.id);

    res.status(200).json(
      ApiResponse.success(200, { deletedId: eq.eventId }, 'Earthquake event deleted successfully')
    );
  });
}

export default EarthquakeController;
