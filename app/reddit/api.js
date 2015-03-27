import Q from 'q';

var request = (path) => {
    var req = new XMLHttpRequest()
        , deferred = Q.defer();

    req.open('GET', path, true);

    req.onload = function() {
        if (req.status >= 200 && req.status < 400) {
            try {
                req.data = JSON.parse(req.responseText);
            } catch(e) {
                req.data = {};
            }

            deferred.resolve(req);
        } else {
            req.data = {};
            deferred.reject(req);
        }
    };

    req.onerror = function() {
        deferred.reject(req);
    };

    req.send();

    return deferred.promise;
};

export default class api {
    static r(sub) {
        return request('/r/'+sub);
    }
    static comments(post) {
        var path = '/r/' + post.subreddit + '/comments/' + post.id;
        return request(path);
    }
}