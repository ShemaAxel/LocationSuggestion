const log = require("../../config/logging");
const geolib = require("geolib");
const request = require("superagent");
var suggestions;
var all = [];
var lat;
var lon;
var response;
//
module.exports = function(app) {
  //all location byname
  app.get("/suggestions/:q/:lat/:lon", async (req, res) => {
    const name = req.params.q;
    lat = req.params.lat;
    lon = req.params.lon;
    response = res;
    log.info(
      "Accessing the Locations API with Parameter : " +
        name +
        " at:" +
        new Date().toJSON()
    );
    suggestions = await fetchLocation(name).then(function(result) {
      log.info("fetching all places from google :" + JSON.stringify(result));
      return result;
    });
    await suggestions.forEach(async function(element) {
      var suggestionz = await fetchDetails(element).then(function(result) {
        pushResults(result);
      });
    });
  });
};

//all results
async function pushResults(place) {
  all.push(place);

  if (all.length === suggestions.length) {
    log.info("all places and coordinates :" + JSON.stringify(all));
    allOperations(all);
  }
}

//getting locations
async function fetchLocation(name) {
  log.info("fetching places with :" + name);
  const all = await request.get(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
      name +
      "&key=AIzaSyDUYbTR-3PDWPhgxjENs4yf35g2eHc641s"
  );
  return all.body.predictions;
}

//suggestions details
async function fetchDetails(element) {
  log.info("fetching places details with place id :" + element.place_id);
  const all = await request.get(
    "https://maps.googleapis.com/maps/api/place/details/json?input=bar&placeid=" +
      element.place_id +
      "&key=AIzaSyDUYbTR-3PDWPhgxjENs4yf35g2eHc641s"
  );
  place = {
    name: element.description,
    latitude: all.body.result.geometry.location.lat,
    longitude: all.body.result.geometry.location.lng,
    score: 0
  };
  log.info("place with details :" + JSON.stringify(place));
  return place;
}

function allOperations(locations) {
  log.info("preparing the response allOperations()");
  locations.forEach(element => {
    log.info("calculating the distance for :" + JSON.stringify(element));
    const dist =
      geolib.getDistance(
        { latitude: lat, longitude: lon },
        { latitude: element.latitude, longitude: element.longitude }
      ) / 1000; //distance in km
    log.info("calculating the score for :" + JSON.stringify(element));
    element.score = calculateScore(dist);
  });
  //sorting array ascending
  log.info("Sorting the elements");
  locations.sort(function(a, b) {
    return parseFloat(b.score) - parseFloat(a.score);
  });
  log.info("Success response :" + JSON.stringify(locations));
  result = {
    suggestions: locations
  };
  suggestions = null;
  all = [];
  response.send(result);
}
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
