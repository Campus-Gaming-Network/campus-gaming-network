# Campus Gaming Network

## Development Requirements (In Progress)

- Node LTS
- NPM LTS
- Firebase
  - Account
  - Project
  - CLI
- .env.local (based off of .env.sample)
  - serviceAccountKey_dev.json
  - Google Maps API key
  - Sentry
  - NextJS
  - Firebase

## Starting the development server

`npm run dev`

## Analyze production build

`npm run analyze`

## Running Firestore Collection Tests

### Requirements

- [Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)
  - Node.js version 8.0 or higher.
  - Java version 1.8 or higher.

`firebase emulators:exec --only firestore "npm run test-firestore"`
