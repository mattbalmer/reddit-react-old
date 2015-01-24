var Q = require('q');

var request = function(path) {
    var req = new XMLHttpRequest()
        , deferred = Q.defer();

    req.open('GET', path, true);

    req.onload = function() {
        if (req.status >= 200 && req.status < 400) {
            try {
                req.data = JSON.parse(req.responseText);
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

var api = module.exports = {};

api.r = function(subapi) {
    return request('/r/'+subapi);
};

api.comments = function(post) {
    var path = '/r/' + post.subreddit + '/comments/' + post.id;
    return request(path);
};
var events = module.exports = {};

events.eventListeners = {};

events.on = function(event, callback) {
    if(!events.eventListeners.hasOwnProperty(event)) {
        events.eventListeners[event] = [];
    }
    events.eventListeners[event].push(callback);

    return function() {
        events.eventListeners.remove(callback);
    }
};

events.trigger = function(event) {
    var args = Array.prototype.slice.call(arguments, 1);

    if(!events.eventListeners.hasOwnProperty(event)) {
        console.error('No event listeners registered for event: %s', event);
    } else {
        events.eventListeners[event].forEach(function(callback) {
            callback.apply(null, args);
        })
    }
};
var reddit = module.exports = {};

reddit.api = require('./api');
reddit.events = require('./events');
reddit.utils = require('./utils');
reddit.render = require('./render');

reddit.fetch = function(path, mode) {
    mode = mode || 'hot';

    reddit.api.r(path+'/'+mode)
        .then(function(req) {
            reddit.events.trigger('postsRefreshed', req.data.data.children);
        });
};
/** @jsx React.DOM */
var React = require('react'),
    PostDetails = require('../components/post-details'),
    PostList = require('../components/post-list'),
    SubredditSearch = require('../components/subreddit-search'),
    Sort = require('../components/sort-options-list');

var render = module.exports = function(mode, posts) {
    React.render(
        PostDetails(null),
        document.getElementById('Comments')
    );

    React.render(
        PostList({posts: posts}),
        document.getElementById('Main')
    );

    React.render(
        SubredditSearch(null),
        document.getElementById('SubredditSearch')
    );

    React.render(
        Sort({mode: mode}),
        document.getElementById('SortOptions')
    );
};
var utils = module.exports = {};

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
var React = require('react/addons'),
    reddit = require('../reddit');

module.exports = Comment = React.createClass({
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
            return <Comment comment={comment} id={i+1} level={this.props.level + 1} />
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
            <div className={classes}>
                <div className='details'>
                    <span className='comment-collapse' onClick={this.collapseComment}>-</span>
                    <span className='comment-expand' onClick={this.expandComment}>+</span>
                    <span className='author'>{this.props.comment.data.author}</span>
                    <span className='score'>{this.props.comment.data.score} points</span>
                    <span className='when'>{reddit.utils.timeAgo(this.props.comment.data.created_utc)}</span>
                </div>
                <span className='body'>{this.props.comment.data.body}</span>
                <div className={repliesClasses}>
                    {this.mapChildren(this.props.comment.data.replies)}
                </div>
            </div>
        );
    }
});
var React = require('react/addons'),
    reddit = require('../reddit'),
    Comment = require('./comment');

module.exports = React.createClass({
    getInitialState: function(){
        return { post: {}, comments: [] }
    },
    componentDidMount: function() {
        var component = this;

        this.unsubscribe = reddit.events.on('postSelected', function(post) {
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
            return <Comment comment={comment} id={i+1} level={1} />
        }, this);
    },
    render: function() {
        var cx = React.addons.classSet
            , classes = cx({
                'post-details': true,
                active: this.state.active
            });

        return (
            <div className={classes}>
                <div className='post-container'>
                    <section className='post-meta-info'>
                        <span className='title'>{this.state.post.title}</span>
                        <span className='when'>Posted {reddit.utils.timeAgo(this.state.post.created_utc)}</span>
                        <span className='author'>by {this.state.post.author}</span>
                        <span className='subreddit'>to /r/{this.state.post.subreddit}</span>
                    </section>
                    <section className='comments'>
                        {this.mapComments(this.state.comments)}
                    </section>
                </div>
            </div>
        );
    }
});
var React = require('react/addons'),
    reddit = require('../reddit'),
    Post = require('./post');

module.exports = React.createClass({
    getInitialState: function(){
        return { activePost: {}, posts: [] }
    },
    componentDidMount: function() {
        var component = this;

        this.unsubscribe = reddit.events.on('postsRefreshed', function(posts) {
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

        reddit.events.trigger('postSelected', post);
    },
    mapPosts: function(posts) {
        return posts.map(function(post, i) {
            return <Post post={post} id={i+1} onClick={this.onPostSelected} activePost={this.state.activePost} />
        }, this);
    },
    render: function() {
        return (
            <section className='posts'>
                { this.mapPosts(this.state.posts) }
            </section>
        );
    }
});
var React = require('react/addons'),
    reddit = require('../reddit');

module.exports = React.createClass({
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
            <div className={classes} onClick={this.onClick}>
                <span className='id'>{this.props.id}</span>
                <span className='score'>{post.score}</span>
                <img className={thumbClasses} src={post.thumbnail}/>
                <section className='details'>
                    <a target='_blank' href={post.url} className='title'>{post.title}</a>
                    <span className='when'>Posted {reddit.utils.timeAgo(post.created_utc)}</span>
                    <span className='author'>by {post.author}</span>
                    <span className='subreddit'>to /r/{post.subreddit}</span>
                    <span className='comment-count'>{post.num_comments} comments</span>
                </section>
            </div>
        );
    }
});
var React = require('react/addons'),
    reddit = require('../reddit');

module.exports = React.createClass({
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

        return <button type='button' onClick={this.onClick} className={classNames}>{this.props.mode}</button>;
    }
});
var React = require('react'),
    SortOption = require('./sort-option');

module.exports = React.createClass({
    render: function() {
        var cs = React.addons.classSet
            , mode = this.props.mode
            , options = [ 'Hot', 'New', 'Top' ]
            , html = options.map(function(option) {
                return <SortOption mode={option} active={option.toLowerCase() == mode.toLowerCase()} />
            });

        return (
            <div className='btn-group'>{html}</div>
        );
    }
});
var React = require('react/addons'),
    reddit = require('../reddit');

module.exports = React.createClass({
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
            <form className='form-inline' onSubmit={this.onSubmit}>
                <div className='input-group'>
                    <input ref='searchInput' type='text' className='form-control' value={value} onChange={this.onChange} />
                    <div className='input-group-btn'>
                        <button type='submit' onClick={this.onSubmit} className='btn btn-primary'>Go</button>
                    </div>
                </div>
            </form>
        );
    }
});