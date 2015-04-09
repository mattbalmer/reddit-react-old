import React from 'react/addons';
import reddit from '../reddit';
import Post from './post';

export default class PostList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { activePost: {}, posts: props.posts }
    }
    componentDidMount() {
        var component = this;

        this.unsubscribe = reddit.events.on('postsRefreshed', function(posts) {
            component.setState({ posts: posts });
        });
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    onPostSelected(post) {
        if(this.state.activePost == post)
            post = {};

        this.setState({activePost: post});

        reddit.events.trigger('postSelected', post);
    }
    mapPosts(posts) {
        return posts.map((post, i) => {
            return <Post post={post} id={i+1} onClick={this.onPostSelected.bind(this)} activePost={this.state.activePost} />
        });
    }
    render() {
        return (
            <section className='posts'>
                { this.mapPosts(this.state.posts) }
            </section>
        );
    }
}