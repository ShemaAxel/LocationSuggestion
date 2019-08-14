const express = require("express");
const MongoClient = require("mongodb");
const bondyParser = require("body-parser");
const app = express();
const db = require("./config/db");
const log = require("./config/logging");
// const port = 3000;
app.set("port", process.env.PORT || 3000);
app.use(bondyParser.urlencoded({ extended: true }));
//import index routes

MongoClient.connect(db.url, (err, database) => {
  if (err) {
    console.log(err);
  } else {
    require("./app/routes")(app, database);
    app.listen(app.get("port"), () => {
      log.info("Accessing the API entry point at: " + new Date().toJSON());
      console.log("Live from the server:" + app.get("port"));
    });
  }
});
