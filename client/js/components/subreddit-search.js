var React = require('react/addons'),
    reddit = require('../reddit');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            value: this.props.title || 'all'
        };
    },
    onSubmit: function() {
        this.refs.searchInput.getDOMNode().blur();
        reddit.fetch(this.state.value);

        return false;
    },
    onChange: function(event) {
        this.setState({
            value: event.target.value
        });
    },
    render: function() {
        var value = this.state.value;
        return (
            <form className='form-inline' onSubmit={this.onSubmit}>
                <div className='input-group'>
                    <input ref='searchInput' type='text' className='form-control' value={value} onChange={this.onChange} />
                    <div className='input-group-btn'>
                        <button type='submit' onClick={this.onSubmit} className='btn btn-primary'>Go</button>
                    </div>
                </div>
            </form>
        );
    }
});