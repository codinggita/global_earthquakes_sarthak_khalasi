# 🌍 Global Earthquakes Backend System (Full-Stack 2026)

An enterprise-grade, highly scalable, and production-ready **Node.js, Express & MongoDB (Mongoose)** backend for analyzing global seismic events. Architected around the industry-standard **MVC (Model-View-Controller)** pattern, it integrates real-time USGS scientific feeds, multi-stage statistics aggregation pipelines, robust JWT-based credentials security, and fine-grained Role-Based Access Control (RBAC).

---

## 🚀 Key Features

### Core Operations
*   **Complete CRUD Capabilities**: Fully functional RESTful endpoints for managing global earthquake events and crowd-sourced user felt reports.
*   **Advanced Filtering & Query System**: Fully dynamic filter builder resolving queries for magnitude ranges (`$gte`, `$lte`), chronological bounds (`startDate`, `endDate`), warning tags (`tsunami`), and review status.
*   **Regex Location Searches**: Case-insensitive substring matching on locations (e.g., `?search=California`).
*   **Geospatial Geofencing Queries**: Native MongoDB `$geoWithin` spherical coordinates calculations around an arbitrary `[longitude, latitude]` with custom search radius limits (Requires `2dsphere` spatial indexes).
*   **JWT Credentials Security**: Dual support for HTTP-only Secure Cookies and Bearer Authorization headers, managing secure logins, registration, profile retrieval, and session logouts.
*   **Role-Based Access Control (RBAC)**: Custom middlewares locking administrative mutations (`POST`, `PUT`, `DELETE`) to verified `admin` credentials while allowing standard operational rights for regular `user` credentials.
*   **Crowd-Sourced Felt Reports**: Cross-referenced relationship modeling allowing users to submit seismic felt reports for specific earthquakes, dynamically maintaining document-level counters utilizing Mongoose atomic `$inc` updates.
*   **Complex Statistical Aggregations**: Centralized pipeline compile (`GET /api/v1/earthquakes/stats`) processing multi-stage aggregate facets parallelizing magnitude bucket frequencies, tsunami danger ratios, regional averages, monthly trends, and maximum significance listings.

### Premium "Good to Have" Implementations
1.  **API Response Standardization**: Wrapper class `ApiResponse` providing unified structures for success, data, paging, and error states.
2.  **Request Logging Middleware**: Unified output formats detailing request verb, endpoint, network latency, and status.
3.  **Centralized Async Error Handler**: Custom `asyncHandler` wrapper replacing redundant try-catch patterns across route controllers.
4.  **Database Seeding Script**: Automates importing a massive initial dataset directly from live USGS feeds or local backups.
5.  **Password Hashing (bcrypt)**: Implementing automatic secure encryption on save operations and verifying credentials on login.
6.  **Timestamp Tracking System**: Enforcing auto-generated audit fields (`createdAt`, `updatedAt`) via Mongoose configuration.
7.  **Basic Rate Limiting**: Security middleware restricting endpoint abuse.
8.  **Health Check API**: Providing pingable server health indicators (database state, server uptime, CPU load).

---

## 📂 Project Architecture

The repository enforces a clean, modular MVC structure separating database concerns, business logic, routing channels, and middlewares:

```
global_earthquakes/
├── config/
│   └── db.js                 # MongoDB connection & config
├── controllers/
│   ├── authController.js     # User registration, login, logout, profile
│   ├── earthquakeController.js # CRUD, searching, pagination, stats aggregation
│   └── userReportController.js # CRUD for felt reports & user relationships
├── services/
│   ├── authService.js        # Auth logic, JWT handling
│   ├── earthquakeService.js  # Querying & aggregation pipelines
│   └── userReportService.js  # Business logic for user felt reports
├── models/
│   ├── User.js               # User authentication model
│   ├── Earthquake.js         # Earthquake event model
│   └── UserReport.js         # Felt reports (referential relationship)
├── routes/
│   ├── authRoutes.js         # /api/v1/auth/*
│   ├── earthquakeRoutes.js   # /api/v1/earthquakes/*
│   └── userReportRoutes.js   # /api/v1/reports/*
├── middlewares/
│   ├── authMiddleware.js     # JWT verification & RBAC check
│   ├── errorMiddleware.js    # Global centralized error handler
│   ├── loggerMiddleware.js   # Custom logging middleware
│   └── rateLimiter.js        # Basic rate limiting
├── utils/
│   ├── apiResponse.js        # Standardized API response format
│   ├── asyncHandler.js       # Centralized async try-catch wrapper
│   └── seeder.js             # Database seeding script (USGS Live data)
├── .env                      # Local environmental configuration
├── package.json              # NPM dependencies
└── server.js                 # Entrypoint
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.0.0+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

### 2. Install Dependencies
Clone the repository and install the required Node modules:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (you can copy `.env.example` as a starting point):
```env
# Server Settings
PORT=5000
NODE_ENV=development

# Database Settings
MONGO_URI=mongodb://127.0.0.1:27017/global_earthquakes

# Security Settings
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Settings
CORS_ORIGIN=http://localhost:3000
```

### 4. Database Seeding
Populate your database with real-time, high-magnitude seismic events fetched directly from the live USGS GeoJSON feed, along with default test accounts:
```bash
npm run seed
```
*Note: If offline, the seeder automatically falls back to generating over 150+ realistic global earthquakes to ensure offline development remains uninterrupted.*

**Default Seeded Credentials:**
*   **Admin Profile**: `email: admin@earthquakes.com`, `password: admin123` (Admin privileges)
*   **User Profile**: `email: user@earthquakes.com`, `password: user123` (Standard privileges)

### 5. Running the Server
**For Production:**
```bash
npm start
```
**For Development (with Auto-Reloading):**
```bash
npm run dev
```

---

## 🛰️ API Endpoint Reference

All endpoints are versioned under `/api/v1`.

### 1. Authentication Services (`/api/v1/auth`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Public | Registers a new user. |
| **POST** | `/login` | Public | Verifies credentials, issues JWT token and cookie. |
| **POST** | `/logout` | Public | Clears session cookie states. |
| **GET** | `/profile` | User/Admin | Returns the currently authenticated user's profile details. |

### 2. Earthquake Event Channels (`/api/v1/earthquakes`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Public | Lists earthquakes. Supports pagination, sorting, filters, search, and geospatial radius lookups. |
| **GET** | `/stats` | Public | Returns aggregated statistical analytics and facets. |
| **GET** | `/:id` | Public | Retrieves a single seismic event by eventId or ObjectId. |
| **POST** | `/` | Admin Only | Logs a new manual seismic event. |
| **PUT** | `/:id` | Admin Only | Updates a seismic event. |
| **DELETE**| `/:id` | Admin Only | Safely deletes a seismic event from the database. |

#### List Query Parameter Examples:
*   **Pagination & Sorting**: `/api/v1/earthquakes?page=1&limit=10&sort=-time`
*   **Range Filters**: `/api/v1/earthquakes?minMag=5.0&maxMag=8.0&status=reviewed`
*   **Regex Search**: `/api/v1/earthquakes?search=Fiji` (case-insensitive place lookup)
*   **Geospatial Spherical Proximity**: `/api/v1/earthquakes?latitude=35.67&longitude=139.65&maxDistanceKm=300` (Lists events within 300km of Tokyo, Japan)

### 3. Crowd-Sourced Felt Reports (`/api/v1/reports`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | User/Admin | Submits a crowd-sourced felt report. Automatically increments event felt tracker. |
| **GET** | `/earthquake/:eventId` | Public | Lists all felt reports for a specific event with populated user credentials. |
| **DELETE**| `/:id` | Owner/Admin | Removes a felt report. Automatically decrements event felt tracker. |

### 4. Health heartbeat (`/api/v1/health`)
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Public | Compiles system metrics, memory loads, CPU states, and DB ready-states. |

---

## 🧪 Postman API Verification Suite

This project includes a fully pre-configured Postman Collection JSON file located in the root: `global_earthquakes.postman_collection.json`.

### How to use:
1.  Open **Postman**.
2.  Click **Import** in the top-left corner.
3.  Drag and drop the file `global_earthquakes.postman_collection.json` from the project directory.
4.  Run requests in sequence!
    *   *The `Login User` and `Login Admin` requests contain test scripts that automatically capture the returned JWT tokens and bind them to the collection-wide variables `{{userToken}}` and `{{adminToken}}` respectively. Subsequent requests use these variables automatically, providing a completely seamless testing flow!*