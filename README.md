# Global Earthquakes – Full Stack Dashboard

An enterprise-grade full-stack seismic monitoring platform with a React frontend dashboard connected to a Node.js + Express + MongoDB backend.

---

## 🗂️ Project Structure

```
global_earthquakes/
├── backend/          # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic & MongoDB queries
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   ├── middlewares/     # Auth, validation, logging, rate-limiting
│   │   ├── utils/           # ApiResponse, ApiError, asyncHandler
│   │   ├── config/          # DB connection
│   │   ├── scripts/         # Seeder, backup scripts
│   │   ├── app.js           # Express app config
│   │   └── server.js        # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend/         # React + Vite dashboard
    ├── src/
    │   ├── components/
    │   │   ├── common/      # Button, DataTable, Modal, StatsCard, SkeletonLoader, EmptyState, ErrorBoundary
    │   │   ├── layout/      # DashboardLayout, Sidebar, Navbar
    │   │   └── charts/      # SeverityBarChart, MonthlyTrendChart, TsunamiPieChart, RegionalChart
    │   ├── features/
    │   │   ├── auth/        # authSlice.js (JWT login/register/logout)
    │   │   ├── earthquakes/ # earthquakeSlice.js (CRUD + stats)
    │   │   ├── reports/     # reportSlice.js (felt reports CRUD)
    │   │   └── ui/          # uiSlice.js (theme, sidebar)
    │   ├── hooks/           # useAuth, useDebounce
    │   ├── pages/
    │   │   ├── auth/        # LoginPage, RegisterPage
    │   │   ├── dashboard/   # DashboardHome
    │   │   ├── earthquakes/ # EarthquakeListPage, EarthquakeDetailPage, EarthquakeFormModal
    │   │   ├── reports/     # ReportsListPage, ReportFormModal
    │   │   ├── analytics/   # AnalyticsDashboard
    │   │   ├── profile/     # ProfilePage
    │   │   └── settings/    # SettingsPage
    │   ├── routes/          # AppRouter, ProtectedRoute, AdminRoute
    │   ├── services/        # api.js (Axios), authService, earthquakeService, reportService
    │   ├── store/           # Redux store
    │   └── utils/           # constants, formatters, storage
    ├── public/
    │   └── sitemap.xml
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| express-rate-limit | Rate limiting |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite 8 | UI framework + build tool |
| Tailwind CSS v3 | Utility-first styling |
| MUI v5 | UI component library |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side routing + route guards |
| Axios | HTTP client with JWT interceptors |
| Formik + Yup | Forms + validation |
| Recharts | Data visualization charts |
| React Hot Toast | Toast notifications |
| React Helmet Async | SEO meta management |
| Lucide React | Icon library |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET

npm install
npm run seed        # Seed earthquake dataset into MongoDB
npm run dev         # Start backend on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev         # Start frontend on http://localhost:3000
```

> **Note:** The frontend proxies `/api` to `http://localhost:5000` via Vite's dev server proxy. Both servers must be running simultaneously.

### 3. Create Admin User

Register via the UI, then update the user's role in MongoDB:
```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login → JWT token |
| POST | `/api/v1/auth/logout` | Public | Logout |
| GET | `/api/v1/auth/profile` | JWT | Get user profile |
| GET | `/api/v1/earthquakes` | Public | List with pagination/filters/sort/search |
| GET | `/api/v1/earthquakes/stats` | Public | MongoDB aggregation statistics |
| GET | `/api/v1/earthquakes/:id` | Public | Single earthquake |
| POST | `/api/v1/earthquakes` | Admin | Create earthquake |
| PUT | `/api/v1/earthquakes/:id` | Admin | Update earthquake |
| DELETE | `/api/v1/earthquakes/:id` | Admin | Soft-delete earthquake |
| GET | `/api/v1/reports` | JWT | List felt reports |
| POST | `/api/v1/reports` | JWT | Submit felt report |
| PUT | `/api/v1/reports/:id` | JWT (owner) | Update report |
| DELETE | `/api/v1/reports/:id` | JWT (owner/admin) | Delete report |
| GET | `/api/v1/health` | Public | Server health check |

---

## ✨ Features

### Dashboard
- **Role-adaptive**: Admin sees CRUD controls; User sees read/report access
- **Stats Cards**: Total earthquakes, top significance score, tsunami events, highest magnitude
- **Charts**: Monthly trends (area chart), severity distribution (bar), tsunami risk (donut), regional networks (bar)
- **Recent Earthquakes**: Live list with magnitude color coding
- **Top Significant Events**: Ranked by USGS significance score

### Earthquake Management
- Paginated data table with backend-driven pagination
- **Filters**: Magnitude range slider, date range, status, alert level, tsunami toggle
- **Search**: Debounced location search
- **Sorting**: Click column headers
- **Admin CRUD**: Create, Edit, Delete (soft-delete) via modal forms
- **Detail Page**: Full earthquake data, seismic properties, coordinates, external USGS link

### Felt Reports
- Users submit intensity reports (1-10 scale) with comments
- Admins see all reports; users see only their own
- Color-coded intensity indicators

### Analytics Dashboard
- All 5 aggregation facets visualized as charts
- Top significant events ranking table
- Regional network breakdown table

### Authentication
- JWT stored in localStorage
- Auto-login on page refresh (token + user session hydrated from localStorage)
- Protected routes (redirect to login if unauthenticated)
- Admin routes (redirect to dashboard if not admin)
- Logout clears all stored data

### Theme & UX
- Light/Dark mode toggle (persisted in localStorage)
- Glassmorphism card design
- Skeleton loaders for all API calls
- Empty state UI (no data)
- Error state UI with retry button
- Toast notifications for all CRUD operations
- Responsive layout (mobile sidebar overlay)

### SEO
- Dynamic page titles via React Helmet Async
- Meta descriptions on all pages
- Open Graph tags in index.html
- schema.org structured data (WebApplication)
- sitemap.xml for all routes

---

## 🏗️ Build for Production

```bash
cd frontend
npm run build       # Outputs to dist/
```

Build output is code-split into vendor, MUI, charts, and Redux chunks for optimal loading performance.
