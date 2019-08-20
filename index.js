const express = require("express");
const bondyParser = require("body-parser");
const app = express();

const log = require("./config/logging");
// const port = 3000;
app.set("port", process.env.PORT || 3000);
app.use(bondyParser.urlencoded({ extended: true }));
//import index routes

require("./app/routes")(app);
app.listen(app.get("port"), () => {
  log.info("API entry point Live at Port: " + app.get("port"));
  console.log("Live from the server:" + app.get("port"));
});
