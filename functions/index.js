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

exports.updateEventResponses = functions.firestore
  .document("events/{id}")
  .onUpdate((change, context) => {
    const eventId = context.params.id
    console.log(`eventId ${eventId}`)
    const newValue = change.after.data();
    console.log(`name ${newValue.name}`)
    const previousValue = change.before.data();
    console.log("newValue",newValue)
    console.log("previousValue",previousValue)
    const eventDocRef = db.collection("events").doc(eventId);

    return db
      .collection("event-responses")
      .where("event", "==", eventDocRef)
      .get()
      .then((snapshot) => {
        let batch = db.batch();
        console.log("snapshot", snapshot);
        snapshot.forEach(doc => {
          const docRef = db.collection("event-responses").doc(doc.id);
          batch.update(docRef, {
            eventDetails: {
              name: newValue.name
            }
          });
          batch.commit().then(() => {
            console.log('updated all documents')
          });
        });
      })
      .catch((err) => console.log(err));
  });
  