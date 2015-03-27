import React from 'react';
import SortOption from './sort-option';

export default class SortOptionsList {
    render() {
        var cs = React.addons.classSet
            , mode = this.props.mode || 'hot'
            , options = [ 'Hot', 'New', 'Top' ]
            , html = options.map(function(option) {
                return <SortOption mode={option} active={option.toLowerCase() == mode.toLowerCase()} />
            });

        return (
            <div className='sort-options btn-group'>{html}</div>
        );
    }
}