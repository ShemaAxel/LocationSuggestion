const express = require("express");
const MongoClient = require("mongodb");
const bondyParser = require("body-parser");
const app = express();
const db = require("./config/db");
//dcasdfsfsd
const port = 3000;
app.use(bondyParser.urlencoded({ extended: true }));
//import index routes

MongoClient.connect(db.url, (err, database) => {
  if (err) {
    console.log(err);
  } else {
    require("./app/routes")(app, database);
    app.listen(port, () => {
      console.log("Live from the server:" + port);
    });
  }
});
