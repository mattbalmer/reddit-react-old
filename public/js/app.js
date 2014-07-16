/** @jsx React.DOM */
var Post = React.createClass({
    render: function() {
        var post = this.props.post.data;
        console.log('post', post);
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

var PostList = React.createClass({
    render: function() {
        var posts = this.props.posts.map(function(post, i) {
            return <Post post={post} id={i} />
        });

        console.log('posts?', posts);
        return (
            <section className='posts'>
                { posts }
            </section>
        );
    }
});

// ============
// === Main ===
// ============
reddit.r('all')
    .then(function(req) {
        var posts = req.data.data.children;

        React.renderComponent(
            <PostList posts={posts} />,
            document.getElementById('main')
        );
    });