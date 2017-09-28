const objectModel = require('../models/objectModel');
const moment      = require('moment');

exports.insertObject = function(request, response) {
  if (Object.keys(request.body).length === 0 || Object.keys(request.body)[0].length === 0) {
    return response.status(400).send('Bad Request');
  }

  var body = request.body;
  var keys = Object.keys(body);

  var timestamp = moment().utcOffset(0).format('YYYY-MM-DD HH:mm:ss');

  var dataObj = {
    key: keys[0],
    value: body[keys[0]],
    timestamp: timestamp
  }

  objectModel.save(dataObj, function(error, doc){
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(200).send(doc);
    }
  });   
};

exports.findObject = function(request, response) {
  var objectkey = request.params.key;
  var timestamp = request.query.timestamp;

  if (timestamp !== undefined && moment.unix(timestamp) !== 'Invalid date'){
    timestamp = moment.unix(timestamp).utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
  } else if (timestamp === undefined) {
    timestamp = moment().utcOffset(0).format('YYYY-MM-DD HH:mm:ss');
  } else {
    return response.status(400).send('Bad Request');
  }

  objectModel.find(objectkey, timestamp, function(error, doc){
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(200).send(doc);
    }
  });
};
