import express from 'express';
import proxy from 'proxy';
import React from 'react';

var routes = express.Router();

routes.get('/r/:r/comments/:id',
    proxy.to('http://reddit.com/r/:r/comments/:id.json'));

routes.get('/r/:r/:mode',
    proxy.to('http://reddit.com/r/:r/:mode.json'));

routes.get('/r/:r',
    proxy.to('http://reddit.com/r/:r.json'));

//routes.get('/', (req, res) => {
//    var Hello = require('./components/hello.js');
//
//    res.render('index', {
//        content: React.renderToString(<Hello/>)
//    });
//});

export default routes