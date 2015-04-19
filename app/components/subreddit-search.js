import React from 'react/addons';
import reddit from '../reddit';

export default class SubredditSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.title || 'all'
        };
    }
    onSubmit() {
        this.refs.searchInput.getDOMNode().blur();
        reddit.fetch(this.state.value);

        return false;
    }
    onChange(event) {
        this.setState({
            value: event.target.value
        });
    }
    render() {
        var value = this.state.value;
        return (
            <form className='subreddit-search form-inline' onSubmit={this.onSubmit.bind(this)}>
                <div className='input-group'>
                    <input ref='searchInput' type='text' className='form-control' value={value} onChange={this.onChange.bind(this)} />
                    <div className='input-group-btn'>
                        <button type='submit' onClick={this.onSubmit.bind(this)} className='btn btn-primary'>Go</button>
                    </div>
                </div>
            </form>
        );
    }
}