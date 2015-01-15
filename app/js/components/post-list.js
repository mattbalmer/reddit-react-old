/** @jsx React.DOM */
var PostList = React.createClass({
    getInitialState: function(){
        return { activePost: {} }
    },
    onPostSelected: function(post) {
        if(this.state.activePost == post)
            post = {};

        this.setState({activePost: post});

        this.props.onClick(post);
        console.log('post selected', post);
    },
    render: function() {
        var posts = this.props.posts.map(function(post, i) {
            return <Post post={post} id={i+1} onClick={this.onPostSelected} activePost={this.state.activePost} />
        }, this);

        return (
            <section className='posts'>
                { posts }
            </section>
        );
    }
});