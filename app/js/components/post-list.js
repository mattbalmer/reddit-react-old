/** @jsx React.DOM */
var PostList = React.createClass({
    getInitialState: function(){
        return { activePost: {} }
    },
    onTabSelected: function(post) {
        if(this.state.activePost == post)
            post = {};

        this.setState({activePost: post});
    },
    render: function() {
        var posts = this.props.posts.map(function(post, i) {
            return <Post post={post} id={i} onClick={this.onTabSelected} activePost={this.state.activePost} />
        }, this);

        return (
            <section className='posts'>
                { posts }
            </section>
        );
    }
});