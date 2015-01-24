var events = module.exports = {};

events.eventListeners = {};

events.on = function(event, callback) {
    if(!events.eventListeners.hasOwnProperty(event)) {
        events.eventListeners[event] = [];
    }
    events.eventListeners[event].push(callback);

    return function() {
        events.eventListeners.remove(callback);
    }
};

events.trigger = function(event) {
    var args = Array.prototype.slice.call(arguments, 1);

    if(!events.eventListeners.hasOwnProperty(event)) {
        console.error('No event listeners registered for event: %s', event);
    } else {
        events.eventListeners[event].forEach(function(callback) {
            callback.apply(null, args);
        })
    }
};