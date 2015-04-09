import React from 'react';
import SortOption from './sort-option';
import reddit from '../reddit';

export default class SortOptionsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { current: props.mode || 'hot' }
    }
    render() {
        var options = [ 'Hot', 'New', 'Top' ]
            , html = options.map((option) => {
                return <SortOption mode={option} current={this.state.current} onChange={this.onChange.bind(this)} />
            });

        return (
            <div className='sort-options btn-group'>{html}</div>
        );
    }

    onChange(mode) {
        console.log('this', this);
        this.setState({ current: mode });
        reddit.fetch('all', mode.toLowerCase())
    }
}