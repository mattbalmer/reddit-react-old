reddit.utils = (function(reddit){
    var utils = {};

    utils.timeAgo = function(utc) {
        var millis = Date.now() - (utc * 1000),
            seconds = parseInt(millis / 1000),
            minutes = parseInt(seconds / 60),
            hours = parseInt(minutes / 60),
            days = parseInt(hours / 24),
            string = '';

        if(days) {
            string += days + ' days '
        }
        if(hours) {
            string += hours % 24 + ' hours '
        }
        if(!days && !hours && minutes) {
            string += minutes % 60 + ' minutes '
        }
        if(!days && !hours && !minutes && seconds) {
            string += seconds % 60 + ' seconds '
        }

        return string + 'ago';
    };

    return utils;
}(reddit));