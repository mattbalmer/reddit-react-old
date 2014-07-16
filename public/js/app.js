api = (function(){
    var api = {};

    api.request = function(path) {
        var req = new XMLHttpRequest()
            , deferred = Q.defer();

        req.open('GET', path, true);

        req.onload = function() {
            if (req.status >= 200 && req.status < 400) {
                try {
                    var data = JSON.parse(req.responseText);
                    req.data = data;
                } catch(e) {
                    req.data = {};
                }

                deferred.resolve(req);
            } else {
                req.data = {};
                deferred.reject(req);
            }
        };

        req.onerror = function() {
            deferred.reject(req);
        };

        req.send();

        return deferred.promise;
    };

    api.r = function(subapi) {
        return api.request('/r/'+subapi);
    };

    return api;
}());
/** @jsx React.DOM */
var PostList = React.createClass({displayName: 'PostList',
    render: function() {
        var posts = this.props.posts.map(function(post, i) {
            return Post( {post:post, id:i} )
        });

        return (
            React.DOM.section( {className:"posts"}, 
                 posts 
            )
        );
    }
});
/** @jsx React.DOM */
var Post = React.createClass({displayName: 'Post',
    render: function() {
        var post = this.props.post.data;
        return (
            React.DOM.div( {className:"post"}, 
                React.DOM.span( {className:"id"}, this.props.id),
                React.DOM.span( {className:"score"}, post.score),
                React.DOM.img( {className:"thumb", src:post.thumbnail}),
                React.DOM.section( {className:"details"}, 
                    React.DOM.a( {target:"_blank", href:post.url, className:"title"}, post.title),
                    React.DOM.span( {className:"author"}, post.author),
                    React.DOM.span( {className:"comment-count"}, post.num_comments)
                )
            )
        );
    }
});
/** @jsx React.DOM */
var SortOption = React.createClass({displayName: 'SortOption',
    onClick: function(event) {
        console.log('CLICK!', this.props.mode);
        reddit.fetch('all', this.props.mode.toLowerCase())
    },
    render: function() {
        var mode = this.props.mode.toLowerCase()
            , classNames = mode;

        if(this.props.active) {
            classNames += ' active';
        }

        return React.DOM.li( {onClick:this.onClick, className:classNames}, this.props.mode);
    }
});
/** @jsx React.DOM */
var Sort = React.createClass({displayName: 'Sort',
    render: function() {
        var cs = React.addons.classSet
            , mode = this.props.mode
            , options = [ 'Hot', 'New', 'Top' ]
            , html = options.map(function(option) {
                return SortOption( {mode:option, active:option.toLowerCase() == mode.toLowerCase()} )
            });

        return (
            React.DOM.ul( {className:"sorting-options"}, 
                html
            )
        );
    }
});
/** @jsx React.DOM */
var reddit = (function(api) {
    var app = {};

    app.fetch = function(path, mode) {
        mode = mode || 'hot';

        api.r(path+'/'+mode)
            .then(function(req) {
                var posts = req.data.data.children;

                React.renderComponent(
                    PostList( {posts:posts} ),
                    document.getElementById('main')
                );

                React.renderComponent(
                    Sort( {mode:mode} ),
                    document.getElementById('sorting')
                );
            });
    };

    app.fetch('all');

    return app;
}(api));

if(typeof global !== 'undefined')
    global.reddit = reddit;