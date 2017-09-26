'use strict';
module.exports = function(app) {
  var objectController = require('../controllers/objectController');

  app.route('/object')
    .post(objectController.insertObject);

  app.route('/object/:key')
    .get(objectController.findObject);
};
