export default {
    eventListeners: {},
    on(event, callback) {
        if (!this.eventListeners.hasOwnProperty(event)) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);

        return () => {
            this.eventListeners.remove(callback);
        }
    },
    trigger(event, ...args) {
        if(!this.eventListeners.hasOwnProperty(event)) {
            console.error('No event listeners registered for event: %s', event);
        } else {
            this.eventListeners[event].forEach(function(callback) {
                callback.apply(null, args);
            })
        }
    }
}