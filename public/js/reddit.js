var reddit = {};

reddit.request = function(path) {
    var req = new XMLHttpRequest()
        , deferred = Q.defer();

    req.open('GET', path, true);

    req.onload = function() {
        if (req.status >= 200 && req.status < 400) {
            try {
                var data = JSON.parse(req.responseText);
                req.data = data;
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

reddit.r = function(subreddit) {
    return reddit.request('/r/'+subreddit);
};