/** @jsx React.DOM */
var Sort = React.createClass({
    render: function() {
        var cs = React.addons.classSet
            , mode = this.props.mode
            , options = [ 'Hot', 'New', 'Top' ]
            , html = options.map(function(option) {
                return <SortOption mode={option} active={option.toLowerCase() == mode.toLowerCase()} />
            });

        return (
            <div className='btn-group'>
                {html}
            </div>
        );
    }
});