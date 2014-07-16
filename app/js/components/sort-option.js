/** @jsx React.DOM */
var SortOption = React.createClass({
    onClick: function(event) {
        console.log('CLICK!', this.props.mode);
        reddit.fetch('all', this.props.mode.toLowerCase())
    },
    render: function() {
        var mode = this.props.mode.toLowerCase()
            , classNames = mode + ' btn btn-default';

        if(this.props.active) {
            classNames += ' active';
        }

        return <button type='button' onClick={this.onClick} className={classNames}>{this.props.mode}</button>;
    }
});