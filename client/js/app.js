var reddit = require('./reddit');

document.addEventListener('DOMContentLoaded', function() {
    reddit.render('hot', {});
    reddit.fetch('all');
});