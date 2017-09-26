var env = process.env.NODE_ENV || 'development';
var db  = require('../../config/database')[env];
var request = require('request');

const dbURL = 'http://' + db.host + ':' + db.port + '/' + db.name;

exports.save = function(jsonData, done) {
  request.post({
    url: dbURL,
    body: jsonData,
    json: true,
  }, function(error, response, body){
    if (error) return done('Unable to connect to CouchDB');
    if (body.ok) {
      done(null, jsonData);
    }
  });
}

exports.find = function(key, timestamp) {

}
