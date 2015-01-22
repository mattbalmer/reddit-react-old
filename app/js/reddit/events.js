(function(reddit){
    var eventListeners = {};

    reddit.on = function(event, callback) {
        if(!eventListeners.hasOwnProperty(event)) {
            eventListeners[event] = [];
        }
        eventListeners[event].push(callback);

        return function() {
            eventListeners.remove(callback);
        }
    };

    reddit.trigger = function(event) {
        var args = Array.prototype.slice.call(arguments, 1);

        if(!eventListeners.hasOwnProperty(event)) {
            console.error('No event listeners registered for event: %s', event);
        } else {
            eventListeners[event].forEach(function(callback) {
                callback.apply(null, args);
            })
        }
    };
}(reddit));