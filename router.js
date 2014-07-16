var routes = module.exports = require('express').Router()
    , request = require('request');

routes.get('/r/:r/:mode', function(req, res) {
    request('http://reddit.com/r/' + req.params.r + '/' + req.params.mode + '.json', function(error, response, body) {
        res.send(response.statusCode, error || body);
    });
});

routes.get('/r/:r', function(req, res) {
    request('http://reddit.com/r/' + req.params.r + '.json', function(error, response, body) {
        res.send(response.statusCode, error || body);
    });
});

routes.get('/', function(req, res) {
    res.render('index');
});
