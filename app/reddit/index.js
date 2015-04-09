import events from './events'
import api from './api'

export default {
    fetch(path, mode = 'hot') {
        return api.r(path+'/'+mode)
            .then((req) => {
                events.trigger('postsRefreshed', req.data.data.children);
            });
    },

    api: require('./api'),
    events: require('./events'),
    utils: require('./utils')
}