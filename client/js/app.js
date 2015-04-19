var React = require('react'),
    App = require('components/app.js');

document.addEventListener('DOMContentLoaded', function() {
    var state = window.__STATE__;
    React.render(<App posts={state.posts} />, document.body);
});