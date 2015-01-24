var React = require('react/addons'),
    reddit = require('../reddit'),
    Post = require('./post');

module.exports = React.createClass({
    getInitialState: function(){
        return { activePost: {}, posts: [] }
    },
    componentDidMount: function() {
        var component = this;

        this.unsubscribe = reddit.events.on('postsRefreshed', function(posts) {
            component.setState({ posts: posts });
        });
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    onPostSelected: function(post) {
        if(this.state.activePost == post)
            post = {};

        this.setState({activePost: post});

        reddit.events.trigger('postSelected', post);
    },
    mapPosts: function(posts) {
        return posts.map(function(post, i) {
            return <Post post={post} id={i+1} onClick={this.onPostSelected} activePost={this.state.activePost} />
        }, this);
    },
    render: function() {
        return (
            <section className='posts'>
                { this.mapPosts(this.state.posts) }
            </section>
        );
    }
});