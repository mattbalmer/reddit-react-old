api = (function(){
    var api = {};

    api.request = function(path) {
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

    api.r = function(subapi) {
        return api.request('/r/'+subapi);
    };

    return api;
}());