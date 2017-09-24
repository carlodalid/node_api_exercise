'use strict';
module.exports = function(app) {
  var objectController = require('../controllers/objectController');

  // object routes
  app.route('/object')
    .post(objectController.createObject);

  app.route('/object/:key')
    .get(objectController.getObject);
};
