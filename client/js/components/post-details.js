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