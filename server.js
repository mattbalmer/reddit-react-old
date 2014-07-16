var express = require('express'),
    jade = require('jade'),
    stylus = require('stylus'),
    nib = require('nib'),
    fs = require('fs'),
    config = require('config'),
    request = require('request');

var app = express();

app.set('port', config.port);
app.set('view engine', 'jade' );
app.set('views', __dirname + '/app/views' );

// Stylus
app.use(stylus.middleware({
    src: __dirname + '/app',
    dest: __dirname + '/public',
    debug: true,
    force: true,
    compile: function (str, path) {
        return stylus(str)
            .set('filename', path)
            .use(nib());
    }
}));

app.get('/', function(req, res) {
    res.redirect('index.html');
});

app.get('/r/:r', function(req, res) {
    request('http://reddit.com/r/' + req.params.r + '.json', function(error, response, body) {
        res.send(response.statusCode, error || body);
    });
});

// Static dir
app.use(express.static(__dirname + '/public'));

//==================
// Start Server
//==================
app.listen(config.port, function () {
    console.log("Express server listening on port %d", config.port);
});