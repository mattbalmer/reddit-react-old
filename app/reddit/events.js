export default class events {
    constructor() {
        this.eventListeners = {};
    }
    static on(event, callback) {
        if (!events.eventListeners.hasOwnProperty(event)) {
            events.eventListeners[event] = [];
        }
        events.eventListeners[event].push(callback);

        return () => {
            events.eventListeners.remove(callback);
        }
    }

    static trigger(event, ...args) {
        if(!events.eventListeners.hasOwnProperty(event)) {
            console.error('No event listeners registered for event: %s', event);
        } else {
            events.eventListeners[event].forEach(function(callback) {
                callback.apply(null, args);
            })
        }
    }
}