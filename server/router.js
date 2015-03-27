import request from 'request';
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

routes.get('/', (req, res) => {
    var App = require('components/app.js');

    request('http://reddit.com/r/all.json', function(error, response, body) {
        if(response.statusCode == 200 && !error && body) {
            var posts = body.data.children;

            res.render('index', {
                content: React.renderToString(<App posts={posts} />)
            });
        }
    });
});

export default routes