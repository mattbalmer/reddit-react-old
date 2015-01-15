/** @jsx React.DOM */
var Post = React.createClass({
    onClick: function() {
        window.selectPost(this.props.post);
        this.props.onClick(this.props.post.data);
    },
    timeAgo: function(utc) {
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
                    <span className='when'>Posted {this.timeAgo(post.created_utc)}</span>
                    <span className='author'>by {post.author}</span>
                    <span className='subreddit'>to /r/{post.subreddit}</span>
                    <span className='comment-count'>{post.num_comments} comments</span>
                </section>
            </div>
        );
    }
});