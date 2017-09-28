module.exports = function(app) {
  var objectController = require('../controllers/objectController');
  
  app.route('/')
    .get(function(request, response){
      response.status(200).send("All systems are go!");
    });

  app.route('/object')
    .post(objectController.insertObject);

  app.route('/object/:key')
    .get(objectController.findObject);
};
