var express = require('express'),
    path = require('path'),
    config = require('config');
var app = express();

app.use( require('./router') );
app.use(express.static( path.join(__dirname, '..', 'public') ));

app.listen(config.port, function () {
    console.log("Express server listening on port %d", config.port);
});