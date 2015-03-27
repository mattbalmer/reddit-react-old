import React from 'react';
import SortOptionsList from './sort-options-list.js';
import SubredditSearch from './subreddit-search.js';
import PostList from './post-list.js';
import PostDetails from './post-details.js';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <header className='header'>
                    <h1>reddit-react</h1>
                    <SubredditSearch />
                    <SortOptionsList />
                </header>

                <PostList posts={this.props.posts} />

                <PostDetails />
            </div>
        )
    }
}