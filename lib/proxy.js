var request = require('request')
    , format = require('format-url')
    , cache = require('memory-cache');

var CACHE_DURATION = 10 * 60 * 1000,    // Ten minutes
    DEV_CACHE_DURATION = 30 * 1000;     // 30 seconds

var proxy = module.exports = {};

var requestThenCache = function(url, res) {
    request(url, function(error, response, body) {
        res.send(response.statusCode, error || body);

        if(response.statusCode == 200 && !error) {
            console.log('caching response');
            cache.put(url, {
                statusCode: response.statusCode,
                body: body
            }, CACHE_DURATION);
        }
    });
};

proxy.to = function(path) {
    return function(req, res) {
        var url = format(path, req.params);

        var cachedResponse = cache.get(url);

        if(cachedResponse) {
            console.log('using cached response');
            res.send(cachedResponse.statusCode, cachedResponse.body);
        } else {
            console.log('fetching new response');
            requestThenCache(url, res);
        }
    }
};