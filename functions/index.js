const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const axios = require("axios");

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

    if (Object.keys(updatedValues).length > 0) {
      const eventDocRef = db.collection("events").doc(context.params.eventId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("event", "==", eventDocRef);

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
    } else {
      return null;
    }
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
    } else {
      return null;
    }
  });

exports.userOnCreated = functions.firestore
  .document("users/{userId}")
  .onCreate((snapshot, context) => {
    return snapshot.ref
      .set(
        {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .catch((err) => console.log(err));
  });

exports.eventOnCreated = functions.firestore
  .document("events/{eventId}")
  .onCreate((snapshot, context) => {
    return snapshot.ref
      .set(
        {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .catch((err) => console.log(err));
  });

exports.eventResponsesOnCreated = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onCreate(async (snapshot, context) => {
    const newEventResponseData = snapshot.data();
    const eventResponsesQuery = db.collection("event-responses").where("event", "==", newEventResponseData.event);
    const responsesCount = { yes: 0, no: 0 };
  
    try {
      const eventResponsesSnapshot = await eventResponsesQuery.get();

      if (!eventResponsesSnapshot.empty) {
        let batch = db.batch();

        eventResponsesSnapshot.forEach((doc) => {
          if (doc.data().response === "YES") {
            responsesCount.yes += 1;
          } else if (doc.data().response === "NO") {
            responsesCount.no += 1;
          }
        });

        eventResponsesSnapshot.forEach((doc) => {
          batch.update(doc.ref, { responses: responsesCount });
        });

        batch.commit();
      }
    } catch (err) {
      console.log(err);
    }

    db.collection("events").doc(newEventResponseData.event.id).update({ responses: responsesCount });

    return snapshot.ref
      .set(
        {
          responses: responsesCount,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .catch((err) => console.log(err));
  });

exports.userOnUpdated = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    return change.ref
      .update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      .catch((err) => console.log(err));
  });

exports.eventOnUpdated = functions.firestore
  .document("events/{eventId}")
  .onUpdate((change, context) => {
    return change.ref
      .update({
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      .catch((err) => console.log(err));
  });

exports.eventResponsesOnUpdated = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onUpdate(async (change, context) => {
    // 
    // FIX: infinite loop 
    // 
    const previousEventResponseData = change.after.data();
    const newEventResponseData = change.after.data();
    const eventResponsesDocRef = db.collection("event-responses").doc(context.params.eventResponseId);
    const eventResponsesQuery = db.collection("event-responses").where("event", "==", newEventResponseData.event);
    const responsesCount = { yes: 0, no: 0 };

    if (previousEventResponseData.response !== newEventResponseData.response) {
      try {
        const eventResponsesSnapshot = await eventResponsesQuery.get();

        if (!eventResponsesSnapshot.empty) {
          let batch = db.batch();
  
          eventResponsesSnapshot.forEach((doc) => {
            if (doc.data().response === "YES") {
              responsesCount.yes += 1;
            } else if (doc.data().response === "NO") {
              responsesCount.no += 1;
            }
          });
  
          eventResponsesSnapshot.forEach((doc) => {
            batch.update(doc.ref, {
              responses: responsesCount,
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
          });
  
          batch.commit();
        }
      } catch (err) {
        console.log(err);
      }

      try {
        const eventDoc = await newEventResponseData.event.get();

        if (eventDoc.exists) {
          eventDoc.update({ responses: responsesCount })
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
