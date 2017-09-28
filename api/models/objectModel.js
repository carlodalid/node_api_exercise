require('dotenv').load();

const request = require('request');
const env     = process.env.NODE_ENV || 'development'

const db      = require('../../config/database')[env];
const dbURL   = "http://" + db.user + ":" + db.pass + "@" + db.host + ":" + db.port + "/" + db.name;

const views   = require('../../config/views');
const index   = views.index_name;
const view    = views.index_view; 

request.get(dbURL + '/' + index, function(error, response, body) {
  var jsonResp = JSON.parse(body);
  if (jsonResp.error === 'not_found') {
    request.put({
      url: dbURL + '/' + views.index_name,
      body: { language: 'query', views: views.index_view },
      json: true
    });
  }
});

exports.save = function(jsonData, done) {
  request.post({
    url: dbURL,
    body: jsonData,
    json: true,
  }, function(error, response, body){
    if (error) return done('Unable to connect to CouchDB');
    if (response.statusCode === 201) {
      done(null, jsonData);
    } else {
      done('Unable to save object');
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
    use_index: ["_design/timestamp_index", "timestamp_index"]
  }

  request.post({
    url: dbURL + "/_find",
    body: query,
    json: true
  }, function(error, response, body){
    if (error) return done('Unable to connect to CouchDB');
    if (response.statusCode === 200) {
      var obj = { };
      if (body.docs.length === 1){
        obj = { value: body.docs[0].value };
      }

      done(null, obj);
    } else {
      done('Unable to find object');
    }
  });
}
