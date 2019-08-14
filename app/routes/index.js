const noteRoutes = require("./note_routes.js");
module.exports = function(app, db) {
  noteRoutes(app, db);
};
