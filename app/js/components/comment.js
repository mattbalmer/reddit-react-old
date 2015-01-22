/** @jsx React.DOM */
var Comment = React.createClass({
    getInitialState: function() {
        return { collapsed: false };
    },
    collapseComment: function() {
        console.log('collapse', this.props.comment.data);
        this.setState({ collapsed: true });
    },
    expandComment: function() {
        console.log('expand', this.props.comment.data);
        this.setState({ collapsed: false });
    },
    json: function() {
        return JSON.stringify(this.props.comment.data);
    },
    hasReplies: function() {
        var replies = this.props.comment.data.replies;
        if(typeof replies !== 'object') return false;
        return replies.data.children.length > 0;
    },
    mapChildren: function(replies) {
        if(!this.hasReplies()) return [];
        return replies.data.children.map(function(comment, i) {
            return <Comment comment={comment} id={i+1} level={this.props.level + 1} />
        }, this)
    },
    render: function() {
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
                    <span className='comment-collapse' onClick={this.collapseComment}>-</span>
                    <span className='comment-expand' onClick={this.expandComment}>+</span>
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
});