require("dotenv").config({ path: "../../.env.local" });
const admin = require("firebase-admin");
const { performance } = require("perf_hooks");
const md5 = require("md5");
const faker = require("faker");
const sample = require("lodash.sample");
const sampleSize = require("lodash.samplesize");
const program = require("commander");
const isInteger = require("lodash.isinteger");

admin.initializeApp({
  credential: admin.credential.cert(process.env.REACT_APP_FIREBASE_SERVICE_ACCOUNT_KEY_PATH),
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
const batch = db.batch();

const MAX_USER_CREATION = 500;

const DEFAULT_USERS_TO_CREATE = 10;

const STUDENT_STATUS_OPTIONS = [
  "FRESHMAN",
  "SOPHMORE",
  "JUNIOR",
  "SENIOR",
  "GRAD",
  "ALUMNI",
  "FACULTY",
  "OTHER",
];

const SOCIAL_ACCTIONS = [
  "website",
  "twitter",
  "twitch",
  "youtube",
  "skype",
  "discord",
  "battlenet",
  "steam",
  "xbox",
  "psn",
];

const TIMEZONES = [
  "",
  "America/Puerto_Rico",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
];

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const oneOrNone = (value) => sample(["", value]);

const randomSocialAccounts = () =>
  sampleSize(SOCIAL_ACCTIONS, randomNumber(0, SOCIAL_ACCTIONS.length)).reduce(
    (acc, key) => ({
      ...acc,
      [key]: faker.internet.userName(),
    }),
    {}
  );

const createUser = (options) => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  status: sample(STUDENT_STATUS_OPTIONS),
  gravatar: createGravatarHash(faker.internet.email()),
  hometown: oneOrNone(`${faker.address.city()}, ${faker.address.stateAbbr()}`),
  birthdate: oneOrNone(faker.date.past()),
  ...randomSocialAccounts(),
  major: oneOrNone(faker.lorem.word()),
  minor: oneOrNone(faker.lorem.word()),
  bio: sample([
    "",
    faker.lorem.word(),
    faker.lorem.sentence(),
    faker.lorem.paragraph(),
  ]),
  timezone: sample(TIMEZONES),
  school: db.collection("schools").doc(options.school),
});

const createGravatarHash = (email = "") => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return undefined;
  }

  return md5(trimmedEmail.toLowerCase());
};

const main = async () => {
  program.requiredOption("-s, --school <id>", "School ID to assign to users");
  program.option("-u, --users <number>", "Number of users to create", DEFAULT_USERS_TO_CREATE);
  program.option("-v, --verbose", "Display extra details", false);
  program.option(
    "-d, --dry",
    "Dry run, doesn't make changes to firestore",
    false
  );

  program.parse(process.argv);

  const options = program.opts();

  if (!isInteger(parseInt(options.users))) {
    console.log(
      `[ERROR] Please use an integer when setting users. Invalid: ${options.users}`
    );
    process.exit(1);
  } else if (options.users > MAX_USER_CREATION) {
    console.log(
      `[ERROR] ${MAX_USER_CREATION} is the max number of users that can be created. Invalid: ${options.users}`
    );
    process.exit(1);
  }

  console.log("============================================================");
  console.log(
    `${options.dry ? "[DRY] " : ""}Creating ${
      options.users
    } users with school ID ${options.school}`
  );
  console.log("============================================================");

  const t0 = performance.now();

  const users = [];

  for (let index = 0; index < options.users; index++) {
    const user = createUser(options);

    if (options.verbose) {
      console.log(user);
    }

    users.push(user);
  }

  if (!options.dry) {
    users.forEach((user) => {
      const ref = db.collection("users").doc();
      batch.set(ref, user);
    });

    try {
      await batch.commit();
    } catch (error) {
      console.log(`Error on batch commit: ${error}`);
    }
  }

  const t1 = performance.now();

  console.log("============================================================");
  console.log(
    `${options.dry ? "[DRY] " : ""}Done. Took ${Math.floor(
      t1 - t0
    )} milliseconds.`
  );
  console.log("============================================================");

  process.exit(1);
};

main();
