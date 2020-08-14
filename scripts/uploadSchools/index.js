require("dotenv").config({ path: '../../.env.local' });
const firebase = require("firebase/app");
require("firebase/firestore");
const chunk = require("lodash.chunk");
const kebabCase = require("lodash.kebabcase");
const geohash = require("ngeohash");
const { performance } = require('perf_hooks');

// Source:
// https://hifld-geoplatform.opendata.arcgis.com/datasets/colleges-and-universities
const DATA = require("../../data/schools.json");

// Each transaction or batch of writes can write to a maximum of 500 documents.
const MAX_DOCUMENTS = 500;

// Track duplicate names
let names = {};

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
});

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
    location: new firebase.firestore.GeoPoint(LATITUDE, LONGITUDE),
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

    let db = firebase.firestore();
    let batch = db.batch();

    const mappedSchools = _chunk.map(mapSchool);

    mappedSchools.forEach(school => {
      const ref = db.collection("schools").doc();
      batch.set(ref, school);
    });

    try {
      await batch.commit();
    } catch (error) {
      console.log(`Error on batch commit: ${error}`);
    }

    console.count("Finished chunk");
  }

  const t1 = performance.now();

  console.log("====================");
  console.log(`Done. Took ${Math.floor(t1 - t0)} milliseconds.`);
  console.log("====================");

  process.exit(1);
};

main();
