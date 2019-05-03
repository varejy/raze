import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';

const materialStyles = {

};

const mapStateToProps = ({ application }) => {
    return {};
};

const mapDispatchToProps = (dispatch) => ({
    // logout: payload => dispatch(logout(payload))
});

class MainSlider extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    static defaultProps = {
        location: {}
    };

    state = {};

    render () {
        const { classes } = this.props;

        return <div />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(MainSlider));
