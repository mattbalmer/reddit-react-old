//var reddit = require('reddit');
var React = require('react'),
    App = require('components/app.js');

document.addEventListener('DOMContentLoaded', function() {
    //reddit.render('hot', {});
    //reddit.fetch('all');
    var state = window.__STATE__;
    React.render(<App posts={state.posts} />, document.body);
});