const log = require("../../config/logging");
const geolib = require("geolib");
//
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
          //calculate score
          log.info("Calculating the score");
          items.forEach(element => {
            const dist =
              geolib.getDistance(
                { latitude: lat, longitude: lon },
                { latitude: element.latitude, longitude: element.longitude }
              ) / 1000; //distance in km
            element.score = calculateScore(dist);
          });
          //sorting array ascending
          log.info("Sorting the elements");
          items.sort(function(a, b) {
            return parseFloat(b.score) - parseFloat(a.score);
          });
          log.info("Success response :" + JSON.stringify(items));
          response = {
            suggestions: items
          };
          res.send(response);
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
          items.sort(function(a, b) {
            return parseFloat(b.score) - parseFloat(a.score);
          });
          res.send(items);
        }
      });
  });

  app.post("/locations", (req, res) => {
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

//score calculator
function calculateScore(dist) {
  if (dist < 10) {
    return 0.9;
  } else if (dist < 25) {
    return 0.8;
  } else if (dist < 50) {
    return 0.7;
  } else if (dist < 75) {
    return 0.6;
  } else if (dist < 100) {
    return 0.5;
  } else if (dist < 125) {
    return 0.4;
  } else if (dist < 150) {
    return 0.3;
  } else if (dist < 200) {
    return 0.2;
  } else {
    return 0.1;
  }
}
