const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const axios = require("axios");

////////////////////////////////////////////////////////////////////////////////
// onCall

exports.searchGames = functions.https.onCall((data) => {
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
        resolve({
          games: response.data,
          query: data.text,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
});

////////////////////////////////////////////////////////////////////////////////
// onWrite

// Source: https://stackoverflow.com/a/60963531
exports.trackCreatedUpdated = functions.firestore
  .document("{colId}/{docId}")
  .onWrite(async (change, context) => {
    const setCols = ["events", "event-responses", "users", "schools"];

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
        .catch((e) => {
          console.log(e);
          return false;
        });
    }

    if (updateDoc && canUpdate()) {
      return change.after.ref
        .set(
          { updatedAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        )
        .catch((e) => {
          console.log(e);
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

    let updatedValues = {};

    if (previousEventData.name !== newEventData.name) {
      updatedValues = {
        ...updatedValues,
        eventDetails: {
          ...updatedValues.eventDetails,
          name: newEventData.name,
        },
      };
    }

    if (previousEventData.isOnlineEvent !== newEventData.isOnlineEvent) {
      updatedValues = {
        ...updatedValues,
        eventDetails: {
          ...updatedValues.eventDetails,
          isOnlineEvent: newEventData.isOnlineEvent,
        },
      };
    }

    if (!shallowEqual(previousEventData.responses, newEventData.responses)) {
      updatedValues = {
        ...updatedValues,
        eventDetails: {
          ...updatedValues.eventDetails,
          responses: newEventData.responses,
        },
      };
    }

    if (Object.keys(updatedValues).length > 0) {
      const eventDocRef = db.collection("events").doc(context.params.eventId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("event", "==", eventDocRef);

      eventResponsesQuery
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            let batch = db.batch();

            snapshot.forEach((doc) => {
              batch.update(doc.ref, updatedValues);
            });

            batch.commit();
          }
        })
        .catch((err) => console.log(err));
    }

    return null;
  });

exports.updateEventResponsesOnSchoolUpdate = functions.firestore
  .document("schools/{schoolId}")
  .onUpdate((change, context) => {
    const previousSchoolData = change.before.data();
    const newSchoolData = change.after.data();

    if (previousSchoolData.name !== newSchoolData.name) {
      const updatedValues = {
        schoolDetails: {
          name: newSchoolData.name,
        },
      };
      const schoolDocRef = db
        .collection("schools")
        .doc(context.params.schoolId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("school", "==", schoolDocRef);

      return eventResponsesQuery
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            return null;
          } else {
            let batch = db.batch();

            snapshot.forEach((doc) => {
              batch.update(doc.ref, updatedValues);
            });

            return batch.commit();
          }
        })
        .catch((err) => console.log(err));
    }

    return null;
  });

exports.updateEventResponsesOnUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    const previousUserData = change.before.data();
    const newUserData = change.after.data();

    if (
      previousUserData.firstName !== newUserData.firstName ||
      previousUserData.lastName !== newUserData.lastName ||
      previousUserData.gravatar !== newUserData.gravatar
    ) {
      const updatedValues = {
        userDetails: {
          firstName: newUserData.firstName,
          lastName: newUserData.lastName,
          gravatar: newUserData.gravatar,
        },
      };
      const userDocRef = db.collection("users").doc(context.params.userId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("user", "==", userDocRef);

      eventResponsesQuery
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            let batch = db.batch();

            snapshot.forEach((doc) => {
              batch.update(doc.ref, updatedValues);
            });

            batch.commit();
          }
        })
        .catch((err) => console.log(err));
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
      eventRef.set(
        { responses: { yes: admin.firestore.FieldValue.increment(1) } },
        { merge: true }
      );
    } else if (eventResponseData.response === "NO") {
      eventRef.set(
        { responses: { no: admin.firestore.FieldValue.increment(1) } },
        { merge: true }
      );
    }

    return null;
  });

exports.eventResponsesOnUpdated = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onUpdate((change, context) => {
    const previousEventResponseData = change.before.data();
    const newEventResponseData = change.after.data();

    if (previousEventResponseData.response !== newEventResponseData.response) {
      console.log(
        `Event response ${context.params.eventResponseId} updated: ${previousEventResponseData.response} -> ${newEventResponseData.response}`
      );

      const eventRef = db
        .collection("events")
        .doc(newEventResponseData.event.id);

      if (newEventResponseData.response === "YES") {
        eventRef.set(
          {
            responses: {
              no: admin.firestore.FieldValue.increment(-1),
              yes: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true }
        );
      } else if (newEventResponseData.response === "NO") {
        eventRef.set(
          {
            responses: {
              yes: admin.firestore.FieldValue.increment(-1),
              no: admin.firestore.FieldValue.increment(1),
            },
          },
          { merge: true }
        );
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
      eventRef.set(
        { responses: { yes: admin.firestore.FieldValue.increment(-1) } },
        { merge: true }
      );
    } else if (deletedData.response === "NO") {
      eventRef.set(
        { responses: { no: admin.firestore.FieldValue.increment(-1) } },
        { merge: true }
      );
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
