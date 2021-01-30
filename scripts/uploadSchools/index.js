const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
const admin = require("firebase-admin");
const chunk = require("lodash.chunk");
const kebabCase = require("lodash.kebabcase");
const geohash = require("ngeohash");
const { performance } = require("perf_hooks");

admin.initializeApp({
  credential: admin.credential.cert(process.env.REACT_APP_FIREBASE_SERVICE_ACCOUNT_KEY_PATH),
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
});

// Source:
// https://hifld-geoplatform.opendata.arcgis.com/datasets/colleges-and-universities
const DATA = require("../../data/schools.json");

// Each transaction or batch of writes can write to a maximum of 500 documents.
const MAX_DOCUMENTS = 500;

const MAX_RETRIES = 5;

// Track duplicate names
let names = {};

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Map the school data fields for use in the db
const mapSchool = ({
  NAME,
  ADDRESS,
  CITY,
  COUNTRY,
  STATE,
  WEBSITE,
  ZIP,
  COUNTY,
  TELEPHONE,
  LATITUDE,
  LONGITUDE
}) => {
  const school = {
    name: NAME,
    address: ADDRESS,
    city: CITY,
    country: COUNTRY,
    state: STATE,
    website: WEBSITE,
    zip: String(ZIP),
    county: COUNTY,
    phone: String(TELEPHONE),
    location: new admin.firestore.GeoPoint(LATITUDE, LONGITUDE),
    geohash: geohash.encode(LATITUDE, LONGITUDE),
    handle: kebabCase(NAME)
  };

  if (!names[school.name]) {
    names[school.name] = 0;
  } else {
    names[school.name]++;
    school.handle = `${school.handle}-${names[school.name]}`;
  }

  return school;
};

// Where the magic happens
const main = async () => {
  console.log("====================");
  console.log("Starting...");
  console.log("====================");

  const t0 = performance.now()

  console.log(`${DATA.length} colleges`);

  const chunks = chunk(DATA, MAX_DOCUMENTS);

  console.log(`${chunks.length} chunks`);

  for (const _chunk of chunks) {
    console.count("Started chunk");

    let db = admin.firestore();
    let batch = db.batch();

    const mappedSchools = _chunk.map(mapSchool);

    mappedSchools.forEach(school => {
      const ref = db.collection("schools").doc();
      const schoolToUpload = { ...school, id: ref.id };
      batch.set(ref, schoolToUpload);
    });

    let tries = 0;
    let success = false;
    let hasNotExceededTries = tries < MAX_RETRIES;

    while(!success && hasNotExceededTries) {
        await sleep(2000);

        try {
          await batch.commit();
          success = true;
        } catch (error) {
            console.log(`Error on batch commit: ${error}`);
            tries++;
            console.count("Trying again...")
        }
    }

    if (!hasNotExceededTries) {
      console.count("EXCEEDED MAX NUMBER OF RETRIES.")
    }

    console.count("Finished chunk");
  }

  const t1 = performance.now();
  const elapsedTime = millisToMinutesAndSeconds(Math.floor(t1 - t0));

  console.log("====================");
  console.log(`Done. Time elapsed: ${elapsedTime}.`);
  console.log("====================");

  process.exit(1);
};

main();
