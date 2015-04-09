import React from 'react/addons';

export default class SortOption extends React.Component {
    onClick(event) {
        this.props.onChange(this.props.mode);
    }
    render() {
        var cx = React.addons.classSet
            , classes = cx({
                btn: true,
                'btn-default': true,
                active: this.props.current.toLowerCase() == this.props.mode.toLowerCase()
            });
        return <button type='button' onClick={this.onClick.bind(this)} className={classes}>{this.props.mode}</button>;
    }
}