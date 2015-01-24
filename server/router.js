var routes = module.exports = require('express').Router()
    , proxy = require('proxy');

routes.get('/r/:r/comments/:id',
    proxy.to('http://reddit.com/r/:r/comments/:id.json'));

routes.get('/r/:r/:mode',
    proxy.to('http://reddit.com/r/:r/:mode.json'));

routes.get('/r/:r',
    proxy.to('http://reddit.com/r/:r.json'));