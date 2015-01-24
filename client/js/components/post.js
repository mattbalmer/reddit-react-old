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