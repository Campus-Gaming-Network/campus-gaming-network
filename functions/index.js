const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const axios = require("axios");

////////////////////////////////////////////////////////////////////////////////
// onCall

exports.searchGames = functions.https.onCall((data) => {
  const gameQueryRef = db.collection("game-queries").doc(data.text);

  return gameQueryRef.get().then((doc) => {
    if (doc.exists) {
      gameQueryRef.set(
        { queries: admin.firestore.FieldValue.increment(1) },
        { merge: true }
      );

      return new Promise(function (resolve, reject) {
        resolve({
          games: doc.data().games,
          query: data.text,
        });
      });
    } else {
      return new Promise(function (resolve, reject) {
        axios({
          url: "https://api-v3.igdb.com/games",
          method: "POST",
          headers: {
            Accept: "application/json",
            "user-key": functions.config().igdb.key,
          },
          data: `search "${data.text}"; fields name,cover.url,slug; limit 10;`,
        })
          .then((response) => {
            db.collection("game-queries")
              .doc(data.text)
              .set(
                {
                  games: response.data || [],
                  queries: admin.firestore.FieldValue.increment(1),
                },
                { merge: true }
              );

            resolve({
              games: response.data,
              query: data.text,
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  });
});

////////////////////////////////////////////////////////////////////////////////
// onWrite

// Source: https://stackoverflow.com/a/60963531
exports.trackCreatedUpdated = functions.firestore
  .document("{colId}/{docId}")
  .onWrite(async (change, context) => {
    const setCols = [
      "events",
      "event-responses",
      "users",
      "schools",
      "game-queries",
    ];

    if (setCols.indexOf(context.params.colId) === -1) {
      return null;
    }

    const createDoc = change.after.exists && !change.before.exists;
    const updateDoc = change.before.exists && change.after.exists;
    const deleteDoc = change.before.exists && !change.after.exists;

    if (deleteDoc) {
      return null;
    }

    const after = change.after.exists ? change.after.data() : null;
    const before = change.before.exists ? change.before.data() : null;

    const canUpdate = () => {
      if (before.updatedAt && after.updatedAt) {
        if (after.updatedAt._seconds !== before.updatedAt._seconds) {
          return false;
        }
      }

      if (!before.createdAt && after.createdAt) {
        return false;
      }

      return true;
    };

    if (createDoc) {
      return change.after.ref
        .set(
          { createdAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        )
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    if (updateDoc && canUpdate()) {
      return change.after.ref
        .set(
          { updatedAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        )
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    return null;
  });

////////////////////////////////////////////////////////////////////////////////
// onUpdate

exports.updateEventResponsesOnEventUpdate = functions.firestore
  .document("events/{eventId}")
  .onUpdate((change, context) => {
    const previousEventData = change.before.data();
    const newEventData = change.after.data();
    const changes = [];

    if (previousEventData.name !== newEventData.name) {
      changes.push(`${previousEventData.name} -> ${newEventData.name}`);
    }

    if (previousEventData.isOnlineEvent !== newEventData.isOnlineEvent) {
      changes.push(
        `${previousEventData.isOnlineEvent} -> ${newEventData.isOnlineEvent}`
      );
    }

    if (!shallowEqual(previousEventData.responses, newEventData.responses)) {
      changes.push(
        `${previousEventData.isOnlineEvent} -> ${newEventData.isOnlineEvent}`
      );
    }

    if (changes.length > 0) {
      const eventDocRef = db.collection("events").doc(context.params.eventId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("event", "==", eventDocRef);

      console.log(
        `Event ${context.params.eventId} updated: ${changes.join(", ")}`
      );

      return eventResponsesQuery
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            let batch = db.batch();

            snapshot.forEach((doc) => {
              batch.set(
                doc.ref,
                {
                  eventDetails: {
                    name: newEventData.name,
                    isOnlineEvent: newEventData.isOnlineEvent,
                    responses: newEventData.responses,
                  },
                },
                { merge: true }
              );
            });

            return batch.commit();
          }
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    return null;
  });

exports.updateEventResponsesOnSchoolUpdate = functions.firestore
  .document("schools/{schoolId}")
  .onUpdate((change, context) => {
    const previousSchoolData = change.before.data();
    const newSchoolData = change.after.data();
    const changes = [];

    if (previousSchoolData.name !== newSchoolData.name) {
      changes.push(`${previousSchoolData.name} -> ${newSchoolData.name}`);
    }

    if (changes.length > 0) {
      const schoolDocRef = db
        .collection("schools")
        .doc(context.params.schoolId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("school", "==", schoolDocRef);

      console.log(
        `School updated ${context.params.schoolId} updated: ${changes.join(
          ", "
        )}`
      );

      return eventResponsesQuery
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            return null;
          } else {
            let batch = db.batch();

            snapshot.forEach((doc) => {
              batch.update(
                doc.ref,
                {
                  schoolDetails: {
                    name: newSchoolData.name,
                  },
                },
                { merge: true }
              );
            });

            return batch.commit();
          }
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    return null;
  });

exports.updateEventResponsesOnUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    const previousUserData = change.before.data();
    const newUserData = change.after.data();
    const changes = [];

    if (previousUserData.firstName !== newUserData.firstName) {
      changes.push(`${previousUserData.firstName} -> ${newUserData.firstName}`);
    }

    if (previousUserData.lastName !== newUserData.lastName) {
      changes.push(`${previousUserData.lastName} -> ${newUserData.lastName}`);
    }

    if (previousUserData.gravatar !== newUserData.gravatar) {
      changes.push(`${previousUserData.gravatar} -> ${newUserData.gravatar}`);
    }

    if (changes.length > 0) {
      const userDocRef = db.collection("users").doc(context.params.userId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("user", "==", userDocRef);

      console.log(
        `User updated ${context.params.userId} updated: ${changes.join(", ")}`
      );

      return eventResponsesQuery
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            let batch = db.batch();

            snapshot.forEach((doc) => {
              batch.set(
                doc.ref,
                {
                  userDetails: {
                    firstName: newUserData.firstName,
                    lastName: newUserData.lastName,
                    gravatar: newUserData.gravatar,
                  },
                },
                { merge: true }
              );
            });

            return batch.commit();
          }
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    return null;
  });

////////////////////////////////////////////////////////////////////////////////
// onCreate

exports.eventResponsesOnCreated = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onCreate((snapshot) => {
    const eventResponseData = snapshot.data();
    const eventRef = db.collection("events").doc(eventResponseData.event.id);

    if (eventResponseData.response === "YES") {
      return eventRef
        .set(
          { responses: { yes: admin.firestore.FieldValue.increment(1) } },
          { merge: true }
        )
        .catch((err) => {
          console.log(err);
          return false;
        });
    } else if (eventResponseData.response === "NO") {
      return eventRef
        .set(
          { responses: { no: admin.firestore.FieldValue.increment(1) } },
          { merge: true }
        )
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    return null;
  });

exports.eventResponsesOnUpdated = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onUpdate((change, context) => {
    const previousEventResponseData = change.before.data();
    const newEventResponseData = change.after.data();
    const changes = [];

    if (previousEventResponseData.response !== newEventResponseData.response) {
      changes.push(
        `${previousEventResponseData.response} -> ${newEventResponseData.response}`
      );
    }

    if (changes.length > 0) {
      const eventRef = db
        .collection("events")
        .doc(newEventResponseData.event.id);

      console.log(
        `Event Response ${
          context.params.eventResponseId
        } updated: ${changes.join(", ")}`
      );

      if (newEventResponseData.response === "YES") {
        return eventRef
          .set(
            {
              responses: {
                no: admin.firestore.FieldValue.increment(-1),
                yes: admin.firestore.FieldValue.increment(1),
              },
            },
            { merge: true }
          )
          .catch((err) => {
            console.log(err);
            return false;
          });
      } else if (newEventResponseData.response === "NO") {
        return eventRef
          .set(
            {
              responses: {
                yes: admin.firestore.FieldValue.increment(-1),
                no: admin.firestore.FieldValue.increment(1),
              },
            },
            { merge: true }
          )
          .catch((err) => {
            console.log(err);
            return false;
          });
      }
    }

    return null;
  });

////////////////////////////////////////////////////////////////////////////////
// onDelete

exports.eventResponsesOnDelete = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onDelete((snapshot) => {
    const deletedData = snapshot.data();

    const eventRef = db.collection("events").doc(deletedData.event.id);

    if (deletedData.response === "YES") {
      return eventRef
        .set(
          { responses: { yes: admin.firestore.FieldValue.increment(-1) } },
          { merge: true }
        )
        .catch((err) => {
          console.log(err);
          return false;
        });
    } else if (deletedData.response === "NO") {
      return eventRef
        .set(
          { responses: { no: admin.firestore.FieldValue.increment(-1) } },
          { merge: true }
        )
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    return null;
  });

////////////////////////////////////////////////////////////////////////////////
// Helpers

function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}
