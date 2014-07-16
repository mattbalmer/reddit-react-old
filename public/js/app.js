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

var SortOption = React.createClass({
    handleClick: function(event) {
        console.log('CLICK!', this.props.mode);
        app.fetch('all/'+this.props.mode.toLowerCase())
    },
    render: function() {
        var mode = this.props.mode.toLowerCase()
            , classNames = mode;

        if(this.props.active) {
            classNames += ' active';
        }

        return <li onClick={this.onClick} className={classNames}>{this.props.mode}</li>;
    }
});

var Sort = React.createClass({
    render: function() {
        var cs = React.addons.classSet
            , mode = this.props.mode
            , options = [ 'Hot', 'New', 'Top' ]
            , html = options.map(function(option) {
                return <SortOption mode={option} active={option.toLowerCase() == mode.toLowerCase()} />
            });

        return (
            <ul className='sorting-options'>
                {html}
            </ul>
        );
    }
});

// ============
// === Main ===
// ============
app = (function(reddit) {
    var app = {};

    app.fetch = function(path) {
        reddit.r(path)
            .then(function(req) {
                var posts = req.data.data.children;

                React.renderComponent(
                    <PostList posts={posts} />,
                    document.getElementById('main')
                );

                React.renderComponent(
                    <Sort mode='hot' />,
                    document.getElementById('sorting')
                );
            });
    };

    return app;
}(reddit));

app.fetch('all');