var ObjectID = require("mongodb").ObjectID;
module.exports = function(app, db) {
  //all location byname
  app.get("/locations/:q", (req, res) => {
    const name = req.params.q;

    db.collection("locations")
      .find({ name: { $regex: name } })
      .toArray(function(err, items) {
        if (err) {
          console.log(err);
        } else {
          //sort in ascending
          items.sort(GetSortOrder("name"));
          //calculate score

          console.log(items);

          res.send(items);
        }
      });
  });

  //all
  app.get("/locations/", (req, res) => {
    db.collection("locations")
      .find({})
      .toArray(function(err, items) {
        if (err) {
          console.log(err);
        } else {
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
