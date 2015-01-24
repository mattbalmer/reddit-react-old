var reddit = module.exports = {};

reddit.api = require('./api');
reddit.events = require('./events');
reddit.utils = require('./utils');
reddit.render = require('./render');

reddit.fetch = function(path, mode) {
    mode = mode || 'hot';

    reddit.api.r(path+'/'+mode)
        .then(function(req) {
            reddit.events.trigger('postsRefreshed', req.data.data.children);
        });
};