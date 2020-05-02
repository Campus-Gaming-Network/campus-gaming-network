const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const axios = require("axios");

exports.searchGames = functions.https.onRequest((req, res) => {
  axios({
    url: "https://api-v3.igdb.com/games",
    method: "POST",
    headers: {
      Accept: "application/json",
      "user-key": functions.config().igdb.key,
    },
    data: `search "${req.query.text}"; fields name,cover,slug; limit 10;`,
  })
    .then((response) => {
      res.status(200).send({
        data: response.data,
        query: req.query.text,
      });
    })
    .catch((err) => {
      res.send(err);
    });
});
