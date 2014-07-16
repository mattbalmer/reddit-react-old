/** @jsx React.DOM */
var PostList = React.createClass({
    render: function() {
        var posts = this.props.posts.map(function(post, i) {
            return <Post post={post} id={i} />
        });

        return (
            <section className='posts'>
                { posts }
            </section>
        );
    }
});