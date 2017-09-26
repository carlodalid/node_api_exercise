'use strict';
var objectModel = require('../models/objectModel');
var moment      = require('moment');

exports.insertObject = function(request, response) {
  var body = request.body;
  var keys = Object.keys(body);

  var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

  var dataObj       = new Object;
  dataObj.key       = keys[0];
  dataObj.value     = body[dataObj.key];
  dataObj.timestamp = timestamp;

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
    timestamp = moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
  } else if (timestamp === undefined) {
    timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  } else {
    response.status(400).send('Invalid timestamp parameter');
  }

  objectModel.find(objectkey, timestamp, function(error, doc){
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(200).send(doc);
    }
  });
};
