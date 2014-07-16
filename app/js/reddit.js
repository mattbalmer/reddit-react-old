/** @jsx React.DOM */
var reddit = (function(api) {
    var app = {};

    app.fetch = function(path, mode) {
        mode = mode || 'hot';

        api.r(path+'/'+mode)
            .then(function(req) {
                var posts = req.data.data.children;

                React.renderComponent(
                    <PostList posts={posts} />,
                    document.getElementById('Main')
                );

                React.renderComponent(
                    <Sort mode={mode} />,
                    document.getElementById('SortOptions')
                );
            });
    };

    app.fetch('all');

    return app;
}(api));

if(typeof global !== 'undefined')
    global.reddit = reddit;