var axios = require("axios");

var base_url = "http://localhost:3000";

describe("Booking API Tests", function() {
  describe("GET /locations", function() {
    it("returns status code 200", function() {
      axios.get(base_url + "/locations").then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });
});

describe("Drivers API Tests", function() {
  describe("/locations", function() {
    describe("GET /:q", function() {
      it("should return status code 200", function() {
        axios
          .get(base_url + "/locations/5c73ba28e7179a3e36dc94d3")
          .then(response => {
            expect(response.statusCode).toBe(200);
            done();
          });
      });
    });
  });
});
