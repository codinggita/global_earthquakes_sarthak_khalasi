# Global Earthquakes

**A full‑stack web platform that merges official earthquake data with crowdsourced felt‑report submissions.**

## 🌍 Project Overview
- **Official data**: pulls seismic event details (magnitude, time, location) from public feeds.
- **User reports**: registered users can submit how strongly they felt an event, add comments, and optionally embed GPS coordinates.
- **Soft‑delete**: both `Earthquake` and `UserReport` models include an `isDeleted` flag so records are never permanently lost.
- **Backup utility**: CLI script exports the entire MongoDB database to a JSON file stored **outside** the repository, keeping the repo clean.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express (ESM), MongoDB (Mongoose)
- **Auth**: JWT + Bcrypt
- **Validation**: Centralised request‑body validation middleware
- **Version control**: GitHub with PR‑by‑feature workflow
- *(Future)* Front‑end: React + Vite with glass‑morphism UI, interactive maps

## ⚡ Key Features
- CRUD API for earthquakes and user reports
- JWT‑protected endpoints with role‑based access (`user`, `admin`)
- Request validation for all mutating routes
- Soft‑delete (logical deletion) with indexed queries
- Aggregation endpoints that exclude soft‑deleted records
- Nightly DB backup script (outside repo)

## 🚀 Getting Started
```bash
# Clone the repo
git clone https://github.com/Sarthak-Khalasi-dev/global_earthquakes.git
cd global_earthquakes

# Install dependencies
npm install

# Set environment variables (create a .env file)
#   MONGODB_URI=your_mongodb_connection_string
#   JWT_SECRET=your_jwt_secret

# Start the server (development mode)
npm run dev
```
The API will be available at `http://localhost:3000/api`.

## 📚 API Endpoints (summary)
- `POST /api/auth/register` – create a user account
- `POST /api/auth/login` – obtain a JWT
- `GET /api/earthquakes` – list active earthquakes (soft‑deleted filtered out)
- `GET /api/earthquakes/:id` – get details of a single quake
- `DELETE /api/earthquakes/:id` – **soft‑delete** an earthquake (admin only)
- `POST /api/reports` – submit a felt report (authenticated users)
- `GET /api/reports` – list reports (own reports for normal users, all for admins)
- `DELETE /api/reports/:id` – **soft‑delete** a report
- `GET /api/earthquakes/:id/stats` – aggregated felt‑report statistics (excludes soft‑deleted)

## 🗄️ Soft‑Delete Details
Both models have an `isDeleted: Boolean` field (default `false`). All read operations automatically add `{ isDeleted: false }` to their queries, and delete endpoints simply flip the flag to `true`. This preserves audit trails and enables potential recovery.

## 📦 Backup Utility
Run the CLI script to export the entire database:
```bash
node utils/backup.js
```
The JSON file is written to `../global_earthquakes_backups/` (outside the repo) and is ignored via `.gitignore`.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your‑feature`)
3. Commit with clear messages following the Conventional Commits style
4. Open a Pull Request for review

## 📄 License
This project is licensed under the MIT License.
