var ObjectID = require("mongodb").ObjectID;
const log = require("../../config/logging");

module.exports = function(app, db) {
  //all location byname
  app.get("/suggestions/:q/:lat/:lon", (req, res) => {
    const name = req.params.q;
    const lat = req.params.lat;
    const lon = req.params.lon;
    log.info(
      "Accessing the Locations API with Parameter : " +
        name +
        " at:" +
        new Date().toJSON()
    );
    db.collection("locations")
      .find({ name: { $regex: name } })
      .toArray(function(err, items) {
        if (err) {
          log.error("An error occured :" + err.toJSON());
          console.log(err);
        } else {
          //sort in ascending
          items.sort(GetSortOrder("name"));
          //calculate score
          log.info("Success response :" + JSON.stringify(items));
          res.send(items);
        }
      });
  });

  //all
  app.get("/locations/", (req, res) => {
    log.info("Accessing Locations End-Point");
    db.collection("locations")
      .find({})
      .toArray(function(err, items) {
        if (err) {
          log.info("Error occured :" + err);
          console.log(err);
        } else {
          log.info("Success Response :" + JSON.stringify(items));
          res.send(items);
        }
      });
  });

  app.post("/locations", (req, res) => {
    console.log(req.body);

    const location = {
      name: req.body.name,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      score: req.body.score
    };
    db.collection("locations").insert(location, (err, result) => {
      if (err) {
        res.send({ error: err });
      } else {
        // console.log(result);
        res.send(result.ops[0]);
      }
    });
  });
};

function GetSortOrder(prop) {
  return function(a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}
