import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import Earthquake from '../models/Earthquake.js';
import User from '../models/User.js';
import UserReport from '../models/UserReport.js';

// Load env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates highly realistic mock earthquake data if live fetch fails.
 * @returns {Array} Mock earthquakes
 */
const generateMockEarthquakes = () => {
  const regions = [
    { name: 'Southern California', lat: 34.05, lng: -118.24 },
    { name: 'Honshu, Japan', lat: 35.67, lng: 139.65 },
    { name: 'Sumatra, Indonesia', lat: -0.58, lng: 101.34 },
    { name: 'Southern Alaska', lat: 61.21, lng: -149.90 },
    { name: 'Central Chile', lat: -33.44, lng: -70.66 },
    { name: 'Kermadec Islands, New Zealand', lat: -29.25, lng: -177.91 },
    { name: 'Hindukush Region, Afghanistan', lat: 36.07, lng: 70.90 },
    { name: 'Aegean Sea, Greece', lat: 38.32, lng: 25.10 },
    { name: 'Guanacaste, Costa Rica', lat: 10.62, lng: -85.43 },
    { name: 'Reykjanes Ridge, Iceland', lat: 63.98, lng: -22.56 }
  ];

  const types = ['earthquake', 'quarry blast', 'ice quake'];
  const magTypes = ['mw', 'ml', 'mb', 'md'];
  const alerts = ['green', 'yellow', 'orange', 'red', null];
  const list = [];

  for (let i = 0; i < 150; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const mag = parseFloat((2.0 + Math.random() * 6.5).toFixed(1)); // Mag 2.0 to 8.5
    
    // Add jitter to coordinates to scatter them
    const lat = parseFloat((region.lat + (Math.random() - 0.5) * 4).toFixed(4));
    const lng = parseFloat((region.lng + (Math.random() - 0.5) * 4).toFixed(4));
    const depth = parseFloat((5.0 + Math.random() * 250.0).toFixed(1)); // 5 to 250km deep
    
    const eventTime = new Date();
    eventTime.setDate(eventTime.getDate() - Math.floor(Math.random() * 30)); // scattered over last 30 days
    
    let alert = null;
    if (mag > 7.0) alert = alerts[Math.floor(Math.random() * 2) + 2]; // orange or red
    else if (mag > 5.5) alert = 'yellow';
    else if (mag > 4.0) alert = 'green';
    
    const eventId = `mock${1000000 + i}`;
    
    list.push({
      eventId,
      mag,
      place: `${parseFloat((Math.random() * 50).toFixed(0))}km ${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)]} of ${region.name}`,
      time: eventTime,
      updated: new Date(),
      tz: Math.floor(Math.random() * 24) - 12,
      url: `https://earthquake.usgs.gov/earthquakes/eventpage/${eventId}`,
      detail: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/${eventId}.geojson`,
      felt: mag > 4.5 ? Math.floor(Math.random() * 500) : 0,
      cdi: mag > 4.0 ? parseFloat((1.0 + Math.random() * 8.0).toFixed(1)) : null,
      mmi: mag > 5.0 ? parseFloat((2.0 + Math.random() * 7.5).toFixed(1)) : null,
      alert,
      status: Math.random() > 0.3 ? 'reviewed' : 'automatic',
      tsunami: mag > 6.5 && Math.random() > 0.5,
      sig: Math.floor(mag * 100),
      net: 'us',
      code: `${100000 + i}`,
      ids: `,${eventId},`,
      sources: ',us,',
      types: ',origin,phase-data,focal-mechanism,',
      nst: Math.floor(20 + Math.random() * 120),
      dmin: parseFloat((0.01 + Math.random() * 2.0).toFixed(3)),
      rms: parseFloat((0.1 + Math.random() * 0.9).toFixed(2)),
      gap: Math.floor(30 + Math.random() * 150),
      magType: magTypes[Math.floor(Math.random() * magTypes.length)],
      type: types[0],
      title: `M ${mag.toFixed(1)} - ${region.name}`,
      geometry: {
        type: 'Point',
        coordinates: [lng, lat, depth]
      }
    });
  }

  return list;
};

/**
 * Seed the database
 */
const seedData = async () => {
  try {
    // 1. Establish DB Connection
    await connectDB();

    console.log('[Seeder] Cleaning existing database records...');
    await Earthquake.deleteMany();
    await User.deleteMany();
    await UserReport.deleteMany();
    console.log('[Seeder] Database cleared.');

    // 2. Seed Default Users (Admin & standard user)
    console.log('[Seeder] Seeding default credentials...');
    
    // We will save these manually to invoke Mongoose pre-save password-hashing hooks
    const adminUser = new User({
      username: 'admin',
      email: 'admin@earthquakes.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    const standardUser = new User({
      username: 'user',
      email: 'user@earthquakes.com',
      password: 'user123',
      role: 'user'
    });
    await standardUser.save();

    console.log('[Seeder] Users seeded successfully!');
    console.log('   - Admin: username: "admin", password: "admin123"');
    console.log('   - User:  username: "user",  password: "user123"');

    // 3. Seed Earthquakes
    let earthquakes = [];
    const datasetPath = path.resolve(__dirname, '../../dataset.json');
    let hasLocalDataset = false;

    try {
      await fs.access(datasetPath);
      hasLocalDataset = true;
    } catch (err) {
      // Local dataset not found
    }

    if (hasLocalDataset) {
      console.log('[Seeder] Local dataset.json detected. Seeding database from local file...');
      try {
        const rawData = await fs.readFile(datasetPath, 'utf-8');
        const parsedData = JSON.parse(rawData);
        console.log(`[Seeder] Successfully loaded ${parsedData.length} records from dataset.json.`);

        earthquakes = parsedData.map((item, idx) => {
          const lat = parseFloat(item.latitude) || 0;
          const lng = parseFloat(item.longitude) || 0;
          const depth = parseFloat(item.depth) || 0;
          const mag = parseFloat(item.mag) || 0;
          const eventId = item.id || `dataset${idx}`;

          return {
            eventId,
            mag,
            place: item.place || 'Unknown Location',
            time: item.time ? new Date(item.time) : new Date(),
            updated: item.updated ? new Date(item.updated) : null,
            tz: item.tz ? parseInt(item.tz, 10) : null,
            url: item.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${eventId}`,
            detail: item.detail || `https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/${eventId}.geojson`,
            felt: item.felt ? parseInt(item.felt, 10) : 0,
            cdi: item.cdi ? parseFloat(item.cdi) : null,
            mmi: item.mmi ? parseFloat(item.mmi) : null,
            alert: item.alert || null,
            status: item.status || 'automatic',
            tsunami: item.tsunami === 'true' || item.tsunami === true || item.tsunami === 1,
            sig: item.sig ? parseInt(item.sig, 10) : Math.floor(mag * 100),
            net: item.net || '',
            code: item.code || '',
            ids: item.ids || '',
            sources: item.sources || '',
            types: item.types || '',
            nst: item.nst ? parseInt(item.nst, 10) : null,
            dmin: item.dmin ? parseFloat(item.dmin) : null,
            rms: item.rms ? parseFloat(item.rms) : null,
            gap: item.gap ? parseFloat(item.gap) : null,
            magType: item.magType || 'mb',
            type: item.type || 'earthquake',
            title: item.title || `M ${mag.toFixed(1)} - ${item.place || 'Unknown Location'}`,
            geometry: {
              type: 'Point',
              coordinates: [lng, lat, depth]
            }
          };
        });

        // Filter out duplicate eventIds
        const seenIds = new Set();
        earthquakes = earthquakes.filter(eq => {
          if (seenIds.has(eq.eventId)) return false;
          seenIds.add(eq.eventId);
          return true;
        });
        console.log(`[Seeder] Filtered duplicates. ${earthquakes.length} unique records to insert.`);
      } catch (err) {
        console.error(`[Seeder] Error parsing local dataset.json: ${err.message}. Falling back to live feed...`);
        hasLocalDataset = false;
      }
    }

    if (!hasLocalDataset) {
      console.log('[Seeder] Connecting to live USGS Earthquake GeoJSON Feed...');
      try {
        // Fetching moderate to large earthquakes (Mag 2.5+) in the past week
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson');
        
        if (!response.ok) {
          throw new Error(`USGS HTTP Error: Status ${response.status}`);
        }

        const geojsonData = await response.json();
        console.log(`[Seeder] Successfully fetched ${geojsonData.features.length} live features from USGS.`);

        // Map GeoJSON features to Mongoose model schema
        earthquakes = geojsonData.features.map(feat => {
          const props = feat.properties;
          const geom = feat.geometry;
          
          return {
            eventId: feat.id,
            mag: props.mag || 0,
            place: props.place || 'Unknown Location',
            time: new Date(props.time),
            updated: props.updated ? new Date(props.updated) : null,
            tz: props.tz || null,
            url: props.url || '',
            detail: props.detail || '',
            felt: props.felt || 0,
            cdi: props.cdi || null,
            mmi: props.mmi || null,
            alert: props.alert || null,
            status: props.status || 'automatic',
            tsunami: props.tsunami === 1,
            sig: props.sig || null,
            net: props.net || '',
            code: props.code || '',
            ids: props.ids || '',
            sources: props.sources || '',
            types: props.types || '',
            nst: props.nst || null,
            dmin: props.dmin || null,
            rms: props.rms || null,
            gap: props.gap || null,
            magType: props.magType || 'mw',
            type: props.type || 'earthquake',
            title: props.title || 'Seismic Event',
            geometry: {
              type: 'Point',
              coordinates: geom.coordinates // [longitude, latitude, depth]
            }
          };
        });

        // Filter out duplicate eventIds if any in the USGS feed
        const seenIds = new Set();
        earthquakes = earthquakes.filter(eq => {
          if (seenIds.has(eq.eventId)) return false;
          seenIds.add(eq.eventId);
          return true;
        });

      } catch (apiError) {
        console.warn(`[Seeder] WARNING: Could not connect to USGS live feed (${apiError.message}). Falling back to local offline mock generator...`);
        earthquakes = generateMockEarthquakes();
      }
    }

    console.log(`[Seeder] Importing ${earthquakes.length} earthquakes into MongoDB...`);
    
    // Perform bulk insertion
    await Earthquake.insertMany(earthquakes);
    console.log(`[Seeder] Success! Imported ${earthquakes.length} earthquakes into database.`);
    
    // Disconnect connection
    await mongoose.disconnect();
    console.log('[Seeder] Database connection closed. Seeding script complete.');
    process.exit(0);

  } catch (error) {
    console.error(`[Seeder] CRITICAL: Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

// Check if running from command line directly to seed
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  seedData();
}

export default seedData;
