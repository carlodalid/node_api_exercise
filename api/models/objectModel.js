var env = process.env.NODE_ENV || 'development';
var request = require('request');

const db    = require('../../config/database')[env];
const dbURL = "http://" + db.host + ":" + db.port + "/" + db.name;

exports.save = function(jsonData, done) {
  request.post({
    url: dbURL,
    body: jsonData,
    json: true,
  }, function(error, response, body){
    if (error) return done('Unable to connect to CouchDB');
    if (response.statusCode === 200) {
      done(null, jsonData);
    }
  });
}

exports.find = function(key, timestamp, done) {
  var query = {
    selector: {
      key: key,
      timestamp: { "$lte": timestamp }
    },
    sort: [{"timestamp":"desc"}],
    limit: 1,
    use_index: ["_design/8680bc258c23abf105f38477d00111ca605a8f08", "timestamp_index"]
  }

  request.post({
    url: dbURL + "/_find",
    body: query,
    json: true
  }, function(error, response, body){
    if (error) return done('Unable to connect to CouchDB');

    if (response.statusCode === 200) {
      var obj = new Object;
      obj.value = body.docs[0].value;

      done(null, obj);
    }
  });
}
