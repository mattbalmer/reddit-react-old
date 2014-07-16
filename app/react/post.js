/** @jsx React.DOM */
var Post = React.createClass({
    render: function() {
        var post = this.props.post.data;
        return (
            <div className='post'>
                <span className='id'>{this.props.id}</span>
                <span className='score'>{post.score}</span>
                <img className='thumb' src={post.thumbnail}/>
                <section className='details'>
                    <a target='_blank' href={post.url} className='title'>{post.title}</a>
                    <span className='author'>{post.author}</span>
                    <span className='comment-count'>{post.num_comments}</span>
                </section>
            </div>
        );
    }
});