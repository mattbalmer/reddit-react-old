/** @jsx React.DOM */
var PostDetails = React.createClass({
    getInitialState: function(){
        return { post: {} }
    },
    render: function() {
        var post = this.props.post.data
            , json = ''
            , cx = React.addons.classSet
            , classes = cx({
                'post-details': true
            });

        window.selectPost = function(_post) {
            console.log('select post', _post, JSON.stringify(_post));
            post = _post;
            json = JSON.stringify(post);
        };

        return (
            <div className={classes}>
                {this.props.post.data.title}
            </div>
        );
    }
});