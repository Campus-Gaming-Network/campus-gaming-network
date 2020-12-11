const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const axios = require("axios");
const algoliasearch = require("algoliasearch");

const ALGOLIA_ID = functions.config().algolia.app;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search;
const ALGOLIA_SCHOOLS_COLLECTION = "test_SCHOOLS";

const algoliaAdminClient = algoliasearch(
  ALGOLIA_ID,
  ALGOLIA_ADMIN_KEY,
);
const algoliaSearchClient = algoliasearch(
  ALGOLIA_ID,
  ALGOLIA_SEARCH_KEY,
);
const algoliaAdminIndex = algoliaAdminClient.initIndex(ALGOLIA_SCHOOLS_COLLECTION);
const algoliaSearchIndex = algoliaSearchClient.initIndex(ALGOLIA_SCHOOLS_COLLECTION);

////////////////////////////////////////////////////////////////////////////////
// onCall

exports.searchGames = functions.https.onCall((data) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Searches IGDB for games matching search query.
  //
  // Returns a list of matching games, limited to 10, containing the fields: name, cover url, slug.
  //
  // The data returned for each query isn't that important and probably doesn't change often
  // so it isn't a priorty that we always return fresh data, so we store each query and
  // their results in a firestore collection "game-queries" and track how many times
  // the specific query has been made.
  //
  // If the query has been made previously, we grab the results from the stored document
  // instead of querying IGDB to save on API requests. (hopefully this is more cost effective).
  //
  // Later on we should make a change that checks the last time the document has been updated and
  // if its been longer than a certain time period (maybe 1-2 months?), we should update the query
  // results so it stays just slightly relevant.
  //
  // By counting how many times a query is made, we can eventually optimize for the top N queries and
  // their results.
  //
  ////////////////////////////////////////////////////////////////////////////////

  const gameQueryRef = db.collection("game-queries").doc(data.query);

  return gameQueryRef.get().then((doc) => {
    if (doc.exists) {
      gameQueryRef.set(
        { queries: admin.firestore.FieldValue.increment(1) },
        { merge: true }
      )
      .catch((err) => {
        console.log(err);
        return false;
      });

      const docData = doc.data();

      return new Promise(function (resolve, reject) {
        resolve({
          games: docData.games,
          query: data.query,
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
          data: `search "${data.query}"; fields name,cover.url,slug; limit 10;`,
        })
          .then((response) => {
            db.collection("game-queries")
              .doc(data.query)
              .set(
                {
                  games: response.data || [],
                  queries: admin.firestore.FieldValue.increment(1),
                },
                { merge: true }
              );

            resolve({
              games: response.data,
              query: data.query,
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  });
});

exports.searchSchools = functions.https.onCall((data) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Searches Algolia for schools matching search query.
  //
  // A school is added/removed/updated in Algolia whenever a document is
  // added/removed/updated in the schools collection.
  //
  //
  ////////////////////////////////////////////////////////////////////////////////

  const limit = data.limit > 100
    ? 100
    : data.limit < 0
    ? 0
    : data.limit;

  return algoliaSearchIndex.search(data.query, {
    hitsPerPage: limit,
  });
});

exports.searchUsers = functions.https.onCall(async (data, context) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Allows admins to query for a user based on uid or email.
  //
  // If a matching auth user exists, it will query for the matching firestore document
  // of the user too.
  //
  ////////////////////////////////////////////////////////////////////////////////

  // TODO: Only allow admins access to this route
  try {
    const query = data.query ? data.query.trim() : "";

    let authRecord;
    let record;

    if (query && query !== "") {
      const isEmailQuery = isValidEmail(query);

      if (isEmailQuery) {
        authRecord = await admin.auth().getUserByEmail(query);
      } else {
        authRecord = await admin.auth().getUser(query);
      }

      if (authRecord && authRecord.uid) {
        record = await admin.firestore().collection("users").doc(authRecord.uid).get();
      }
    }

    return {
        authUser: authRecord,
        docUser: record ? record.data() : null,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
});

////////////////////////////////////////////////////////////////////////////////
// onWrite

exports.trackCreatedUpdated = functions.firestore
  .document("{colId}/{docId}")
  .onWrite((change, context) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Source: https://stackoverflow.com/a/60963531
  //
  // Updates firestore documents whenever they are updated or created with the current timestamp.
  //
  // Only specific collections documents are being tracked.
  //
  ////////////////////////////////////////////////////////////////////////////////

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

exports.updateAlgoliaIndex = functions.firestore
  .document("schools/{schoolId}")
  .onUpdate((change) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Updates the school in Algolia whenever the school gets updated in firestore.
    //
    // A school can be updated manually by admins or via the edit school page by school admins.
    //
    ////////////////////////////////////////////////////////////////////////////////
    const { createdAt, updatedAt, ...newData } = change.after.data();
    const objectID = change.after.id;

    return algoliaAdminIndex.saveObject({ ...newData, objectID });
  });

exports.updateEventResponsesOnEventUpdate = functions.firestore
  .document("events/{eventId}")
  .onUpdate((change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Updates all event responses that are tied to the event we are updating.
    //
    // There are specific fields that are duplicated on the event responses, so we
    // only need to update the event responses if those specific fields change.
    //
    // Data is duplicated on these documents because of the nature of NoSQL databases.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousEventData = change.before.data();
    const newEventData = change.after.data();
    const changes = [];

    if (previousEventData.name !== newEventData.name) {
      changes.push(changeLog(previousEventData.name, newEventData.name));
    }

    if (previousEventData.description !== newEventData.description) {
      changes.push(changeLog(previousEventData.description, newEventData.description));
    }

    if (previousEventData.startDateTime !== newEventData.startDateTime) {
      changes.push(changeLog(previousEventData.startDateTime, newEventData.startDateTime));
    }

    if (previousEventData.endDateTime !== newEventData.endDateTime) {
      changes.push(changeLog(previousEventData.endDateTime, newEventData.endDateTime));
    }

    if (previousEventData.isOnlineEvent !== newEventData.isOnlineEvent) {
      changes.push(changeLog(previousEventData.isOnlineEvent, newEventData.isOnlineEvent));
    }

    if (!shallowEqual(previousEventData.responses, newEventData.responses)) {
      changes.push(changeLog(previousEventData.responses, newEventData.responses));
    }

    if (!shallowEqual(previousEventData.game, newEventData.game)) {
      changes.push(changeLog(previousEventData.game, newEventData.game));
    }

    if (changes.length > 0) {
      const eventDocRef = db.collection("events").doc(context.params.eventId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("event.ref", "==", eventDocRef);

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
                  event: {
                    name: newEventData.name,
                    description: newEventData.description,
                    startDateTime: newEventData.startDateTime,
                    endDateTime: newEventData.endDateTime,
                    isOnlineEvent: newEventData.isOnlineEvent,
                    responses: newEventData.responses,
                    game: newEventData.game,
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
    ////////////////////////////////////////////////////////////////////////////////
    //
    // We store the name of the school tied to an event on the event-response so that it can
    // be used for display reasons. If the name of that school gets changed for whatever reason,
    // we need to update all the event-responses tied to that school.
    //
    // Data is duplicated on these documents because of the nature of NoSQL databases.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousSchoolData = change.before.data();
    const newSchoolData = change.after.data();
    const changes = [];

    if (previousSchoolData.name !== newSchoolData.name) {
      changes.push(changeLog(previousSchoolData.name, newSchoolData.name));
    }

    if (changes.length > 0) {
      const schoolDocRef = db
        .collection("schools")
        .doc(context.params.schoolId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("school.ref", "==", schoolDocRef);

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
                  school: {
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
    ////////////////////////////////////////////////////////////////////////////////
    //
    // When a user updates specific fields on their document, update all other documents
    // that contain the duplicated data that we are updating.
    //
    ////////////////////////////////////////////////////////////////////////////////


    const previousUserData = change.before.data();
    const newUserData = change.after.data();
    const changes = [];

    if (previousUserData.firstName !== newUserData.firstName) {
      changes.push(changeLog(previousUserData.firstName, newUserData.firstName));
    }

    if (previousUserData.lastName !== newUserData.lastName) {
      changes.push(changeLog(previousUserData.lastName, newUserData.lastName));
    }

    if (previousUserData.gravatar !== newUserData.gravatar) {
      changes.push(changeLog(previousUserData.gravatar, newUserData.gravatar));
    }

    if (changes.length > 0) {
      const userDocRef = db.collection("users").doc(context.params.userId);
      const eventResponsesQuery = db
        .collection("event-responses")
        .where("user.ref", "==", userDocRef);

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
                  user: {
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

exports.eventResponsesOnUpdated = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onUpdate((change, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If an event-response document response field is updated, increment or decrement
    // the related event responses count field.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const previousEventResponseData = change.before.data();
    const newEventResponseData = change.after.data();
    const changes = [];

    if (previousEventResponseData.response !== newEventResponseData.response) {
      changes.push(changeLog(previousEventResponseData.response, newEventResponseData.response));
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
// onCreate

exports.addAlgoliaIndex = functions.firestore
  .document("schools/{schoolId}")
  .onCreate((snapshot) => {
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Adds school to the Algolia collection whenever a school document is added to the
  // schools collection so we can query for it.
  //
  // Schools dont get added often, except for when we initially upload all the schools.
  //
  ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const { createdAt, updatedAt, ...data } = snapshot.data();
      const objectID = snapshot.id;

      return algoliaAdminIndex.saveObject({ ...data, objectID });
    }
  });

exports.eventResponsesOnCreated = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onCreate((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // To keep track of how many people are going to an event, when a event-response is created
    // find the event tied to it and increment the responses by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
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
    }
  });

////////////////////////////////////////////////////////////////////////////////
// onDelete

exports.removeAlgoliaIndex = functions.firestore
  .document("schools/{schoolId}")
  .onDelete((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If a school document is deleted, remove the document from Algolia so that it can no
    // longer be queried.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      return algoliaAdminIndex.deleteObject(snapshot.id);
    }
  });

exports.eventOnDelete = functions.firestore
  .document("events/{eventId}")
  .onDelete((snapshot, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If a user deletes an event, find all the event-responses tied to the event and
    // delete those too.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const eventDocRef = db.collection("events").doc(context.params.eventId);
    const eventResponsesQuery = db
      .collection("event-responses")
      .where("event.ref", "==", eventDocRef);

      return eventResponsesQuery
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let batch = db.batch();

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          return batch.commit();
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  });

exports.userOnDelete = functions.firestore
  .document("users/{userId}")
  .onDelete((snapshot, context) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // A user can delete their account whenever they want.
    //
    // If they decide to do this, find all documents (events, event-responses) that are attached to this user
    // and delete those too so there is no record of them.
    //
    // We delete both the firestore document of the user and their auth user profile.
    //
    ////////////////////////////////////////////////////////////////////////////////

    const userDocRef = db.collection("users").doc(context.params.userId);
    const eventsQuery = db
      .collection("events")
      .where("creator", "==", userDocRef);
    const eventResponsesQuery = db
      .collection("event-responses")
      .where("user.ref", "==", userDocRef);

    eventResponsesQuery
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let batch = db.batch();

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          batch.commit();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    eventsQuery
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let batch = db.batch();

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          batch.commit();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return admin.auth().deleteUser(context.params.userId);
  });


exports.eventResponsesOnDelete = functions.firestore
  .document("event-responses/{eventResponseId}")
  .onDelete((snapshot) => {
    ////////////////////////////////////////////////////////////////////////////////
    //
    // If an event-response document is deleted, find the attached event document if it
    // exists and decrement the responses count by 1.
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (snapshot.exists) {
      const deletedData = snapshot.data();

      if (deletedData) {
        const eventRef = db.collection("events").doc(deletedData.event.id);

        if (eventRef.exists) {
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
        }

        return null;
      }
    }
  });

////////////////////////////////////////////////////////////////////////////////
// Helpers

const shallowEqual = (object1, object2) => {
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

const changeLog = (prev, curr) => `${prev} -> ${curr}`;

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
