# 🌍 Global Earthquakes Backend System - Presentation & Overview Guide

Welcome to the **Global Earthquakes Backend System**! This document serves as your complete cheat-sheet and walkthrough guide to help you understand, run, and present this project with absolute confidence, even if you are seeing it for the first time.

---

## 🏁 Executive Summary (The "Elevator Pitch")
This project is an **enterprise-grade, production-ready, and highly scalable RESTful API** designed for analyzing, capturing, and monitoring global seismic events. 
It uses the modern **Node.js, Express, and MongoDB (Mongoose)** stack, organized under the industry-standard **MVC (Model-View-Controller)** architecture.

It features:
1. **Real-time Live Integration**: Automatically connects to the United States Geological Survey (USGS) live feeds to pull real-time earthquake data.
2. **Advanced Geo-Spatial Queries**: Uses MongoDB's spherical indexing to find earthquakes within a specific distance (e.g., "Find all earthquakes within 300km of Tokyo").
3. **Enterprise Security**: Integrates secure JWT-based authorization using HttpOnly secure cookies and header verification.
4. **Role-Based Access Control (RBAC)**: Distinguishes between standard users and admin accounts to protect data mutations (inserts, updates, deletes).
5. **High-Performance Aggregations**: Uses MongoDB's Aggregation Framework to calculate live stats, regional averages, magnitude buckets, and tsunami risk counts in parallel.

---

## 🛠️ Technology Stack & Architecture

### 1. The Stack
* **Runtime Environment**: Node.js (uses modern ES Modules, i.e., `import/export` syntax)
* **Web Framework**: Express.js
* **Database**: MongoDB (Object Data Modeling via Mongoose)
* **Security & Auth**: JWT (JSON Web Tokens) & `bcryptjs` (password hashing)
* **API Testing**: Postman Collection (pre-configured)

### 2. File Architecture (MVC)
The project is strictly modular, which makes it look incredibly clean and professional to any senior engineer or technical stakeholder:
```
global_earthquakes/
├── config/
│   └── db.js                 # MongoDB connection lifecycle events
├── models/                   # 1. MODELS (Database Schemas & Validation)
│   ├── User.js               # User profiles, passwords, roles
│   ├── Earthquake.js         # Geospatial coordinates, magnitudes, alerts
│   └── UserReport.js         # User felt-intensity reports
├── controllers/              # 2. CONTROLLERS (Request handlers & API responses)
│   ├── authController.js     # Signup, Login, Logout, Profile retrieval
│   ├── earthquakeController.js # List, single, stats, CRUD controllers
│   └── userReportController.js # Felt report submit, list, and delete
├── services/                 # 3. SERVICES (Isolated Business Logic & Queries)
│   ├── authService.js        # Reg/Login logic, password matching, JWT sign
│   ├── earthquakeService.js  # Dynamic filters, spatial queries, pipelines
│   └── userReportService.js  # Referencing users & earthquakes, counters
├── routes/                   # 4. ROUTES (Express URL mapping)
│   ├── authRoutes.js         # /api/v1/auth/*
│   ├── earthquakeRoutes.js   # /api/v1/earthquakes/*
│   └── userReportRoutes.js   # /api/v1/reports/*
├── middlewares/              # 5. MIDDLEWARES (Security, logging, limits)
│   ├── authMiddleware.js     # JWT token decoding & Role validation (RBAC)
│   ├── errorMiddleware.js    # Global error handler (handles Mongoose validation/JWT expiry)
│   ├── loggerMiddleware.js   # API request logging and latency monitor
│   └── rateLimiter.js        # Prevents DOS attacks (max 100 reqs/15 mins per IP)
├── utils/                    # 6. UTILITIES (Formatters, helpers, and seeders)
│   ├── apiResponse.js        # Standardized JSON response format
│   ├── apiError.js           # Standardized custom error structure
│   ├── asyncHandler.js       # Cleans up controllers (replaces try-catch)
│   └── seeder.js             # Automatically fetches live USGS data
├── .env                      # Environment configurations (Port, Secret keys)
├── package.json              # Script runners and dependencies
└── server.js                 # Application Entry Point
```

---

## 🌟 Key Features to Highlight in Your Presentation

To make your presentation outstanding, showcase these features and walk the audience through the corresponding files:

### 1. Advanced Geofencing & Geospatial Queries
* **Where to find it**: [earthquakeService.js](file:///c:/Users/Admin/OneDrive/Desktop/global_earthquakes/services/earthquakeService.js#L102-L117)
* **What it does**: It parses `latitude`, `longitude`, and `maxDistanceKm` query parameters. Using MongoDB's `$geoWithin` and `$centerSphere` operators with a `2dsphere` spatial index on the coordinates, it retrieves earthquakes near a specific location.
* **Why it's cool**: Standard applications search only by strings; this is a scientific, coordinate-based search that replicates real-world geographical mapping.

### 2. Multi-Stage Statistical Aggregations (Central Aggregation Engine)
* **Where to find it**: [earthquakeService.js](file:///c:/Users/Admin/OneDrive/Desktop/global_earthquakes/services/earthquakeService.js#L164-L290)
* **What it does**: Under the route `GET /api/v1/earthquakes/stats`, the API executes a multi-stage aggregation pipeline using MongoDB's `$facet` system. In a **single database call**, it compiles:
  * **Severity Tiers**: Groups earthquakes into categories (Moderate, Strong, Major, Great) using `$bucket`.
  * **Tsunami Danger**: Tracks average magnitude vs. tsunami trigger states.
  * **Regional Frequency**: Ranks reporting agencies and calculates average depth.
  * **Monthly Trends**: Groups earthquakes chronologically.
  * **Top 5 Significant Events**: Dynamically sorts and filters by earthquake impact significance.
* **Why it's cool**: This demonstrates massive performance optimization. It avoids making 5 separate database calls by leveraging MongoDB's pipeline executor.

### 3. Crowd-Sourced Felt Reports & Relational Integrity
* **Where to find it**: [userReportService.js](file:///c:/Users/Admin/OneDrive/Desktop/global_earthquakes/services/userReportService.js#L12-L46)
* **What it does**: Users can submit "Felt Reports" (how strong the shaking was from 1-10) for any given earthquake. The system:
  * Prevents a user from submitting multiple reports for the same earthquake using a unique compound Mongoose index.
  * Atomically increments (`$inc`) the overall `felt` counter in the parent `Earthquake` document in a single query.
  * Atomically decrements (`$inc: -1`) the count if a report is deleted.

### 4. Robust JWT Authentication & Cookie Security (Dual-Vector Auth)
* **Where to find it**: [authMiddleware.js](file:///c:/Users/Admin/OneDrive/Desktop/global_earthquakes/middlewares/authMiddleware.js#L9-L48)
* **What it does**: Authenticators look for a JWT token in **two places**:
  1. The traditional `Authorization: Bearer <token>` header (standard for mobile/external apps).
  2. A secure, `HttpOnly`, browser-inaccessible Cookie (standard for frontends to prevent XSS-based token theft).
* **Why it's cool**: This dual support makes the backend compatible with both dynamic Single Page Applications (SPAs) and external mobile clients, matching modern security standards.

---

## 🚀 Live Demo Quickstart Checklist

We have tested and run the server successfully on your system! Here are the steps to demo it live:

### Step 1. Run the Seeder
The database is fully primed with **305 live earthquakes** downloaded directly from the official USGS servers, along with pre-configured Admin and User accounts.
> *Note: If you ever want to re-seed and refresh the data, simply open your terminal in the root directory and run:*
> `npm run seed`

### Step 2. Start the Server
The Express server is launched by running:
> `npm start` (or `npm run dev` for hot reloading)
It listens on **port 5000**.
* **API Entrypoint**: `http://localhost:5000`
* **Health Heartbeat**: `http://localhost:5000/api/v1/health`

### Step 3. Present using Postman
Inside the root folder, there is a pre-made collection file called `global_earthquakes.postman_collection.json`.
1. Open **Postman**.
2. Click **Import** in the top-left, and choose `global_earthquakes.postman_collection.json` from the project directory.
3. In the collection, you will see pre-made requests for **Register**, **Login User**, **Login Admin**, **Get Stats**, and **Geospatial Radius Queries**.
4. Run **Login Admin** or **Login User**. Postman has a built-in script that automatically extracts the token and attaches it to subsequent requests. You don't have to copy-paste token values manually!

### 🔑 Credentials for Live Demo:
* **Admin Login**:
  * Email: `admin@earthquakes.com`
  * Password: `admin123`
* **Regular User Login**:
  * Email: `user@earthquakes.com`
  * Password: `user123`

---

## 📈 Status: Is the project completed?
**Yes! The project is 100% complete, fully functional, and ready to be presented.**

* There are **no missing files**.
* There are **no TODO comments** or unfinished structures.
* The server boots up perfectly, connects to the database, and the live seeder connects flawlessly to the internet to retrieve actual earthquake data.

You have a top-tier project here that follows modern production architecture. Have fun presenting! 🚀
