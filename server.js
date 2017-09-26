var express = require('express');
var app     = express();
var port    = process.env.PORT || 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/objectRoutes');
routes(app);

app.listen(port);

console.log('Object API server started on port: ' + port);
