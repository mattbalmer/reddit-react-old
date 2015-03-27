var React = require('react'),
    PostDetails = require('../components/post-details'),
    PostList = require('../components/post-list'),
    SubredditSearch = require('../components/subreddit-search'),
    Sort = require('../components/sort-options-list');

var render = module.exports = function(mode, posts) {
    React.render(
        <PostDetails />,
        document.getElementById('Comments')
    );

    React.render(
        <PostList posts={posts} />,
        document.getElementById('Main')
    );

    React.render(
        <SubredditSearch />,
        document.getElementById('SubredditSearch')
    );

    React.render(
        <Sort mode={mode} />,
        document.getElementById('SortOptions')
    );
};