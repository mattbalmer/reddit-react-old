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
    getInitialState: function(){
        return { activePost: {} }
    },
    onTabSelected: function(post) {
        if(this.state.activePost == post)
            post = {};
        
        this.setState({activePost: post});
    },
    render: function() {
        var posts = this.props.posts.map(function(post, i) {
            return Post( {post:post, id:i, onClick:this.onTabSelected, activePost:this.state.activePost} )
        }, this);

        return (
            React.DOM.section( {className:"posts"}, 
                 posts 
            )
        );
    }
});
/** @jsx React.DOM */
var Post = React.createClass({displayName: 'Post',
    onClick: function() {
        this.props.onClick(this.props.post.data);
    },
    render: function() {
        var post = this.props.post.data
            , cx = React.addons.classSet
            , classes = cx({
                'post': true,
                'active': post.id == this.props.activePost.id
            });

        return (
            React.DOM.div( {className:classes, onClick:this.onClick}, 
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
            , classNames = mode + ' btn btn-default';

        if(this.props.active) {
            classNames += ' active';
        }

        return React.DOM.button( {type:"button", onClick:this.onClick, className:classNames}, this.props.mode);
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
            React.DOM.div( {className:"btn-group"}, html)
        );
    }
});
/** @jsx React.DOM */
var SubredditSearch = React.createClass({displayName: 'SubredditSearch',
    getInitialState: function() {
        return {
            value: this.props.title || 'all'
        };
    },
    onSubmit: function() {
        this.refs.searchInput.getDOMNode().blur();
        reddit.fetch(this.state.value);

        return false;
    },
    onChange: function(event) {
        this.setState({
            value: event.target.value
        });
    },
    render: function() {
        var value = this.state.value;
        return (
            React.DOM.form( {className:"form-inline", onSubmit:this.onSubmit}, 
                React.DOM.div( {className:"input-group"}, 
                    React.DOM.input( {ref:"searchInput", type:"text", className:"form-control", value:value, onChange:this.onChange} ),
                    React.DOM.div( {className:"input-group-btn"}, 
                        React.DOM.button( {type:"submit", onClick:this.onSubmit, className:"btn btn-primary"}, "Go")
                    )
                )
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
                    document.getElementById('Main')
                );

                React.renderComponent(
                    SubredditSearch(null ),
                    document.getElementById('SubredditSearch')
                );

                React.renderComponent(
                    Sort( {mode:mode} ),
                    document.getElementById('SortOptions')
                );
            });
    };

    app.fetch('all');

    return app;
}(api));

if(typeof global !== 'undefined')
    global.reddit = reddit;