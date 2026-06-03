import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Earthquake from '../models/Earthquake.js';
import UserReport from '../models/UserReport.js';

// Setup __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config();

/**
 * Backup all database collections to a JSON file.
 */
const runBackup = async () => {
  try {
    // 1. Establish DB Connection
    await connectDB();

    console.log('[Backup] Initiating full database export...');

    // 2. Fetch all collections
    const users = await User.find({}, { password: 0 }); // Exclude sensitive password hashes
    const earthquakes = await Earthquake.find({});
    const userReports = await UserReport.find({});

    console.log(`[Backup] Retrieved records:`);
    console.log(`   - Users:        ${users.length} records`);
    console.log(`   - Earthquakes:  ${earthquakes.length} records`);
    console.log(`   - User Reports: ${userReports.length} records`);

    // 3. Assemble JSON payload
    const backupData = {
      timestamp: new Date().toISOString(),
      metadata: {
        totalCollections: 3,
        recordCounts: {
          users: users.length,
          earthquakes: earthquakes.length,
          userReports: userReports.length,
        }
      },
      data: {
        users,
        earthquakes,
        userReports
      }
    };

    // 4. Resolve backup path (external to the project repository)
    const backupDir = path.join(__dirname, '../../../../global_earthquakes_backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestampStr = new Date().toISOString().replace(/:/g, '-');
    const fileName = `backup_${timestampStr}.json`;
    const filePath = path.join(backupDir, fileName);

    // 5. Write to file
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf8');

    console.log(`[Backup] SUCCESS! Export file successfully written to:`);
    console.log(`   ${filePath}`);

    // 6. Gracefully close DB connection
    await mongoose.disconnect();
    console.log('[Backup] Database connection closed successfully.');
    process.exit(0);

  } catch (error) {
    console.error(`[Backup] CRITICAL: Export failed: ${error.message}`);
    process.exit(1);
  }
};

// Check if running from CLI directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runBackup();
}

export default runBackup;
