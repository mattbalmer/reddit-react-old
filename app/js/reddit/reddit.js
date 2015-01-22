/** @jsx React.DOM */
var reddit = (function() {
    var reddit = {};

    reddit.fetch = function(path, mode) {
        mode = mode || 'hot';

        reddit.api.r(path+'/'+mode)
            .then(function(req) {
                reddit.trigger('postsRefreshed', req.data.data.children);
                //reddit.update({
                //    mode: 'hot',
                //    posts: req.data.data.children
                //});
            });
    };

    reddit.render = function(mode, posts) {
        React.renderComponent(
            <PostDetails />,
            document.getElementById('Comments')
        );

        React.renderComponent(
            <PostList posts={posts} />,
            document.getElementById('Main')
        );

        React.renderComponent(
            <SubredditSearch />,
            document.getElementById('SubredditSearch')
        );

        React.renderComponent(
            <Sort mode={mode} />,
            document.getElementById('SortOptions')
        );
    };

    return reddit;
}());

if(typeof global !== 'undefined')
    global.reddit = reddit;