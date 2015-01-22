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
            PostDetails(null),
            document.getElementById('Comments')
        );

        React.renderComponent(
            PostList({posts: posts}),
            document.getElementById('Main')
        );

        React.renderComponent(
            SubredditSearch(null),
            document.getElementById('SubredditSearch')
        );

        React.renderComponent(
            Sort({mode: mode}),
            document.getElementById('SortOptions')
        );
    };

    return reddit;
}());

if(typeof global !== 'undefined')
    global.reddit = reddit;
reddit.api = (function(reddit){
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

    api.comments = function(post) {
        var path = '/r/' + post.subreddit + '/comments/' + post.id;
        return api.request(path);
    };

    return api;
}(reddit));
(function(reddit){
    var eventListeners = {};

    reddit.on = function(event, callback) {
        if(!eventListeners.hasOwnProperty(event)) {
            eventListeners[event] = [];
        }
        eventListeners[event].push(callback);

        return function() {
            eventListeners.remove(callback);
        }
    };

    reddit.trigger = function(event) {
        var args = Array.prototype.slice.call(arguments, 1);

        if(!eventListeners.hasOwnProperty(event)) {
            console.error('No event listeners registered for event: %s', event);
        } else {
            eventListeners[event].forEach(function(callback) {
                callback.apply(null, args);
            })
        }
    };
}(reddit));
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
/** @jsx React.DOM */
var Comment = React.createClass({displayName: 'Comment',
    getInitialState: function() {
        return { collapsed: false };
    },
    collapseComment: function() {
        console.log('collapse', this.props.comment.data);
        this.setState({ collapsed: true });
    },
    expandComment: function() {
        console.log('expand', this.props.comment.data);
        this.setState({ collapsed: false });
    },
    json: function() {
        return JSON.stringify(this.props.comment.data);
    },
    hasReplies: function() {
        var replies = this.props.comment.data.replies;
        if(typeof replies !== 'object') return false;
        return replies.data.children.length > 0;
    },
    mapChildren: function(replies) {
        if(!this.hasReplies()) return [];
        return replies.data.children.map(function(comment, i) {
            return Comment({comment: comment, id: i+1, level: this.props.level + 1})
        }, this)
    },
    render: function() {
        var cx = React.addons.classSet
            , classes = cx({
                comment: true,
                collapsed: this.state.collapsed,
                'even-tiered': this.props.level % 2 == 0
            })
            , repliesClasses = cx({
                replies: true,
                'has-replies': this.hasReplies()
            });

        return (
            React.DOM.div({className: classes}, 
                React.DOM.div({className: "details"}, 
                    React.DOM.span({className: "comment-collapse", onClick: this.collapseComment}, "-"), 
                    React.DOM.span({className: "comment-expand", onClick: this.expandComment}, "+"), 
                    React.DOM.span({className: "author"}, this.props.comment.data.author), 
                    React.DOM.span({className: "score"}, this.props.comment.data.score, " points"), 
                    React.DOM.span({className: "when"}, reddit.utils.timeAgo(this.props.comment.data.created_utc))
                ), 
                React.DOM.span({className: "body"}, this.props.comment.data.body), 
                React.DOM.div({className: repliesClasses}, 
                    this.mapChildren(this.props.comment.data.replies)
                )
            )
        );
    }
});
/** @jsx React.DOM */
var PostDetails = React.createClass({displayName: 'PostDetails',
    getInitialState: function(){
        return { post: {}, comments: [] }
    },
    componentDidMount: function() {
        var component = this;

        this.unsubscribe = reddit.on('postSelected', function(post) {
            var active = Object.keys(post).length > 0;
            component.setState({ post: post });
            component.setState({ active: active });

            if(active) {
                reddit.api.comments(post)
                    .then(function(req) {
                        var comments = req.data[1].data.children;
                        console.log('comments', post, comments);
                        component.setState({ comments: comments });
                    })
                    .catch(function(err) {
                        console.error('comments error', post, err);
                    })
            }
        });
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    mapComments: function(comments) {
        return comments.map(function(comment, i) {
            return Comment({comment: comment, id: i+1, level: 1})
        }, this);
    },
    render: function() {
        var cx = React.addons.classSet
            , classes = cx({
                'post-details': true,
                active: this.state.active
            });

        return (
            React.DOM.div({className: classes}, 
                React.DOM.div({className: "post-container"}, 
                    React.DOM.section({className: "post-meta-info"}, 
                        React.DOM.span({className: "title"}, this.state.post.title), 
                        React.DOM.span({className: "when"}, "Posted ", reddit.utils.timeAgo(this.state.post.created_utc)), 
                        React.DOM.span({className: "author"}, "by ", this.state.post.author), 
                        React.DOM.span({className: "subreddit"}, "to /r/", this.state.post.subreddit)
                    ), 
                    React.DOM.section({className: "comments"}, 
                        this.mapComments(this.state.comments)
                    )
                )
            )
        );
    }
});
/** @jsx React.DOM */
var PostList = React.createClass({displayName: 'PostList',
    getInitialState: function(){
        return { activePost: {}, posts: [] }
    },
    componentDidMount: function() {
        var component = this;

        this.unsubscribe = reddit.on('postsRefreshed', function(posts) {
            component.setState({ posts: posts });
        });
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    onPostSelected: function(post) {
        if(this.state.activePost == post)
            post = {};

        this.setState({activePost: post});

        reddit.trigger('postSelected', post);
    },
    mapPosts: function(posts) {
        return posts.map(function(post, i) {
            return Post({post: post, id: i+1, onClick: this.onPostSelected, activePost: this.state.activePost})
        }, this);
    },
    render: function() {
        return (
            React.DOM.section({className: "posts"}, 
                 this.mapPosts(this.state.posts) 
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
                post: true,
                active: post.id == this.props.activePost.id
            })
            , thumbClasses = cx({
                thumb: true,
                hide: !post.thumbnail
            });

        return (
            React.DOM.div({className: classes, onClick: this.onClick}, 
                React.DOM.span({className: "id"}, this.props.id), 
                React.DOM.span({className: "score"}, post.score), 
                React.DOM.img({className: thumbClasses, src: post.thumbnail}), 
                React.DOM.section({className: "details"}, 
                    React.DOM.a({target: "_blank", href: post.url, className: "title"}, post.title), 
                    React.DOM.span({className: "when"}, "Posted ", reddit.utils.timeAgo(post.created_utc)), 
                    React.DOM.span({className: "author"}, "by ", post.author), 
                    React.DOM.span({className: "subreddit"}, "to /r/", post.subreddit), 
                    React.DOM.span({className: "comment-count"}, post.num_comments, " comments")
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

        return React.DOM.button({type: "button", onClick: this.onClick, className: classNames}, this.props.mode);
    }
});
/** @jsx React.DOM */
var Sort = React.createClass({displayName: 'Sort',
    render: function() {
        var cs = React.addons.classSet
            , mode = this.props.mode
            , options = [ 'Hot', 'New', 'Top' ]
            , html = options.map(function(option) {
                return SortOption({mode: option, active: option.toLowerCase() == mode.toLowerCase()})
            });

        return (
            React.DOM.div({className: "btn-group"}, html)
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
            React.DOM.form({className: "form-inline", onSubmit: this.onSubmit}, 
                React.DOM.div({className: "input-group"}, 
                    React.DOM.input({ref: "searchInput", type: "text", className: "form-control", value: value, onChange: this.onChange}), 
                    React.DOM.div({className: "input-group-btn"}, 
                        React.DOM.button({type: "submit", onClick: this.onSubmit, className: "btn btn-primary"}, "Go")
                    )
                )
            )
        );
    }
});