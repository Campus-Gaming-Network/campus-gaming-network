# Campus Gaming Network

## Starting the dev server

`npm run dev`

## Analyze build

`npm run analyze`

## Running Firestore Collection Tests

### Requirements

- [Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)
  - Node.js version 8.0 or higher.
  - Java version 1.8 or higher.

`firebase emulators:exec --only firestore "npm run test-firestore"`
