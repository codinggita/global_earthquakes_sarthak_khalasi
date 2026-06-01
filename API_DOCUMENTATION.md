# 🛰️ Global Earthquakes API - Interactive Postman Documentation

This document provides a highly detailed, clean, and comprehensive reference guide for all endpoints exposed by the **Global Earthquakes API**. A fully pre-configured Postman Collection file is available in the root: `global_earthquakes.postman_collection.json`.

---

## ⚙️ Base Configurations

* **Local Environment Base URL**: `http://localhost:5000/api/v1`
* **Production Environment Base URL**: `https://<your-deployed-app>.onrender.com/api/v1`
* **Postman Collection Variables**:
  * `{{baseUrl}}`: Configured by default to your local API endpoint.
  * `{{userToken}}`: Set automatically upon a successful `Login User` request (used to authenticate protected routes).
  * `{{adminToken}}`: Set automatically upon a successful `Login Admin` request (used to authenticate admin-restricted routes).
  * `{{reportId}}`: Set automatically when you submit a new Felt Report.

---

## 📖 API Endpoint Directory

### 🔒 1. Authentication Services (`/auth`)

#### 🔹 Register User
* **Method**: `POST`
* **Endpoint**: `{{baseUrl}}/auth/register`
* **Access**: Public
* **Description**: Registers a new standard user account and automatically issues a JWT authentication token via headers and HttpOnly secure cookies.
* **Request Body (JSON)**:
  ```json
  {
    "username": "testuser",
    "email": "testuser@earthquakes.com",
    "password": "user123"
  }
  ```
* **Expected Response (201 Created)**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "665c84d6b...",
        "username": "testuser",
        "email": "testuser@earthquakes.com",
        "role": "user"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

---

#### 🔹 Register Admin
* **Method**: `POST`
* **Endpoint**: `{{baseUrl}}/auth/register`
* **Access**: Public
* **Description**: Registers an administrative user account with elevated permissions.
* **Request Body (JSON)**:
  ```json
  {
    "username": "testadmin",
    "email": "testadmin@earthquakes.com",
    "password": "admin123",
    "role": "admin"
  }
  ```

---

#### 🔹 Login User / Login Admin
* **Method**: `POST`
* **Endpoint**: `{{baseUrl}}/auth/login`
* **Access**: Public
* **Description**: Verifies credentials and sets `{{userToken}}` or `{{adminToken}}` collection variables in Postman via automated test scripts.
* **Request Body (JSON)**:
  ```json
  {
    "email": "testuser@earthquakes.com",
    "password": "user123"
  }
  ```

---

#### 🔹 Get User Profile
* **Method**: `GET`
* **Endpoint**: `{{baseUrl}}/auth/profile`
* **Access**: Protected (Requires `Bearer {{userToken}}` or `Bearer {{adminToken}}`)
* **Headers**:
  * `Authorization`: `Bearer {{userToken}}`
* **Description**: Returns profile details for the currently logged-in session.

---

#### 🔹 Logout User
* **Method**: `POST`
* **Endpoint**: `{{baseUrl}}/auth/logout`
* **Access**: Public
* **Description**: Clears session cookie status.

---

### 🌍 2. Earthquake Event Operations (`/earthquakes`)

#### 🔹 List Earthquakes (Paginated & Sorted)
* **Method**: `GET`
* **Endpoint**: `{{baseUrl}}/earthquakes`
* **Access**: Public
* **Query Parameters**:
  * `page` (optional): Default `1`
  * `limit` (optional): Default `20`
  * `sort` (optional): Field to sort by. Prefix with `-` for descending (e.g., `-time`, `-mag`).
* **Example URL**: `{{baseUrl}}/earthquakes?page=1&limit=10&sort=-time`
* **Expected Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Earthquake events retrieved successfully",
    "data": [...],
    "meta": {
      "totalRecords": 305,
      "totalPages": 31,
      "currentPage": 1,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
  ```

---

#### 🔹 Filter by Magnitude Range & Status
* **Method**: `GET`
* **Endpoint**: `{{baseUrl}}/earthquakes`
* **Access**: Public
* **Query Parameters**:
  * `minMag`: Filter earthquakes greater than or equal to this magnitude.
  * `maxMag`: Filter earthquakes less than or equal to this magnitude.
  * `status`: Filter by review state (`reviewed` or `automatic`).
* **Example URL**: `{{baseUrl}}/earthquakes?minMag=4.5&maxMag=7.0&status=reviewed`

---

#### 🔹 Regex Search by Location Name
* **Method**: `GET`
* **Endpoint**: `{{baseUrl}}/earthquakes`
* **Access**: Public
* **Query Parameters**:
  * `search`: Case-insensitive Place substring match.
* **Example URL**: `{{baseUrl}}/earthquakes?search=California`

---

#### 🔹 Geospatial Spatial Radius Search
* **Method**: `GET`
* **Endpoint**: `{{baseUrl}}/earthquakes`
* **Access**: Public
* **Description**: Returns all seismic events within a specific distance using a 2D spherical center coordinates lookup.
* **Query Parameters**:
  * `latitude`: Search center latitude.
  * `longitude`: Search center longitude.
  * `maxDistanceKm` (optional): Distance radius. Default is `500`.
* **Example URL**: `{{baseUrl}}/earthquakes?latitude=34.05&longitude=-118.24&maxDistanceKm=500`

---

#### 🔹 Aggregate Seismic Statistics (Stats Engine)
* **Method**: `GET`
* **Endpoint**: `{{baseUrl}}/earthquakes/stats`
* **Access**: Public
* **Description**: Runs a multi-stage aggregate facet pipeline to dynamically calculate severity tiers, tsunami risk triggers, regional frequencies, monthly trends, and maximum significance listings.

---

#### 🔹 Get Single Earthquake
* **Method**: `GET`
* **Endpoint**: `{{baseUrl}}/earthquakes/:id`
* **Access**: Public
* **Description**: Retrieves a single earthquake by its Mongoose MongoDB Object `_id` or original USGS string `eventId` (e.g. `mock100001`).

---

#### 🔹 Create Earthquake (Admin-Only)
* **Method**: `POST`
* **Endpoint**: `{{baseUrl}}/earthquakes`
* **Access**: Protected (Requires **Admin** credentials)
* **Headers**:
  * `Authorization`: `Bearer {{adminToken}}`
* **Request Body (JSON)**:
  ```json
  {
    "eventId": "custom2026eq",
    "mag": 6.8,
    "place": "12km E of Sendai, Japan",
    "time": "2026-05-22T12:00:00Z",
    "type": "earthquake",
    "geometry": {
      "type": "Point",
      "coordinates": [141.01, 38.26, 24.5]
    }
  }
  ```

---

#### 🔹 Update Earthquake (Admin-Only)
* **Method**: `PUT`
* **Endpoint**: `{{baseUrl}}/earthquakes/:id`
* **Access**: Protected (Requires **Admin** credentials)
* **Headers**:
  * `Authorization`: `Bearer {{adminToken}}`
* **Request Body (JSON)**:
  ```json
  {
    "place": "12km E of Sendai, Japan (REVISED)",
    "alert": "yellow",
    "tsunami": true
  }
  ```

---

#### 🔹 Delete Earthquake (Admin-Only)
* **Method**: `DELETE`
* **Endpoint**: `{{baseUrl}}/earthquakes/:id`
* **Access**: Protected (Requires **Admin** credentials)
* **Headers**:
  * `Authorization`: `Bearer {{adminToken}}`

---

### 📊 3. Crowd-Sourced Felt Reports (`/reports`)

#### 🔹 Submit Felt Report
* **Method**: `POST`
* **Endpoint**: `{{baseUrl}}/reports`
* **Access**: Protected (Requires standard user JWT authentication)
* **Headers**:
  * `Authorization`: `Bearer {{userToken}}`
* **Description**: Submits a report on felt shaking intensity (scale 1-10) and automatically increments the earthquake event's crowd counter.
* **Request Body (JSON)**:
  ```json
  {
    "earthquakeId": "mock100005",
    "feltIntensity": 6,
    "comments": "The ground was shaking side-to-side and hanging lamps were swinging heavily."
  }
  ```

---

#### 🔹 Get Reports for Specific Earthquake
* **Method**: `GET`
* **Endpoint**: `{{baseUrl}}/reports/earthquake/:eventId`
* **Access**: Public
* **Description**: Returns all user felt-intensity reports with populated user credentials for a specific event.

---

#### 🔹 Delete Felt Report
* **Method**: `DELETE`
* **Endpoint**: `{{baseUrl}}/reports/:id`
* **Access**: Protected (Requires report ownership or Admin role)
* **Headers**:
  * `Authorization`: `Bearer {{userToken}}`

---

### 🏥 4. System Health Monitor

#### 🔹 Server Health Check
* **Method**: `GET`
* **Endpoint**: `{{baseUrl}}/health`
* **Access**: Public
* **Description**: Compiles system uptime, memory load percentages, active CPU states, and MongoDB database readiness states.

---

## 🎨 How to Publish Interactive Web Documentation in Postman

You can easily generate a beautiful, dynamic web documentation page with code snippets in several languages (JavaScript, Python, cURL, etc.) directly in Postman:

1. **Import the Collection**: Open Postman, click **Import**, and drag & drop the `global_earthquakes.postman_collection.json` file.
2. **Open Collection Options**: Hover over the imported collection name `Global Earthquakes API (Full-Stack 2026)` in the left sidebar, click the three dots (`...`), and select **View documentation**.
3. **Publish the Documentation**:
   * In the top-right corner of the documentation page, click **Publish**.
   * Customize your color theme, layout settings, and set the default environment.
   * Click **Publish Collection**.
4. **Copy Your Link**: Postman will generate a public URL (e.g. `https://documenter.getpostman.com/view/...`). You can include this link directly in your slides or project presentations to impress your evaluators! 🚀
