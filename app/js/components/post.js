/** @jsx React.DOM */
var Post = React.createClass({
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
                    <span className='author'>{post.author}</span>
                    <span className='comment-count'>{post.num_comments}</span>
                </section>
            </div>
        );
    }
});