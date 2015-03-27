export default {
    fetch(path, mode = 'hot') {
        return reddit.api.r(path+'/'+mode)
            .then((req) => {
                reddit.events.trigger('postsRefreshed', req.data.data.children);
            });
    },

    api: require('./api'),
    events: require('./events'),
    utils: require('./utils')
}