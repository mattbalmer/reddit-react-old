import React from 'react/addons';
import reddit from '../reddit';

export default class SortOption extends React.Component {
    onClick(event) {
        reddit.fetch('all', this.props.mode.toLowerCase())
    }
    render() {
        var mode = this.props.mode.toLowerCase()
            , classNames = mode + ' btn btn-default';

        if(this.props.active) {
            classNames += ' active';
        }

        return <button type='button' onClick={this.onClick} className={classNames}>{this.props.mode}</button>;
    }
}