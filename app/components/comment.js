import React from 'react/addons';
import reddit from '../reddit';

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = { collapsed: false };
    }
    render() {
        var cx = React.addons.classSet
            , classes = cx({
                comment: true,
                collapsed: this.state.collapsed,
                'even-tiered': this.props.level % 2 == 0
            })
            , repliesClasses = cx({
                replies: true,
                'has-replies': this.hasReplies()
            });

        return (
            <div className={classes}>
                <div className='details'>
                    <span className='comment-collapse' onClick={this.collapseComment.bind(this)}>-</span>
                    <span className='comment-expand' onClick={this.expandComment.bind(this)}>+</span>
                    <span className='author'>{this.props.comment.data.author}</span>
                    <span className='score'>{this.props.comment.data.score} points</span>
                    <span className='when'>{reddit.utils.timeAgo(this.props.comment.data.created_utc)}</span>
                </div>
                <span className='body'>{this.props.comment.data.body}</span>
                <div className={repliesClasses}>
                    {this.mapChildren(this.props.comment.data.replies)}
                </div>
            </div>
        );
    }

    // -----

    json() {
        return JSON.stringify(this.props.comment.data);
    }
    collapseComment() {
        this.setState({ collapsed: true });
    }
    expandComment() {
        this.setState({ collapsed: false });
    }
    hasReplies() {
        var replies = this.props.comment.data.replies;
        if(typeof replies !== 'object') return false;
        return replies.data.children.length > 0;
    }
    mapChildren(replies) {
        if(!this.hasReplies()) return [];
        return replies.data.children.map(function(comment, i) {
            return <Comment comment={comment} id={i+1} level={this.props.level + 1} />
        }, this)
    }
}