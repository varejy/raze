import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import getMainSlider from '../../../services/getMainSlider';

const materialStyles = {

};

const mapStateToProps = ({ application }) => {
    return {
        slider: application.mainSlider
    };
};

const mapDispatchToProps = (dispatch) => ({
    getMainSlider: payload => dispatch(getMainSlider(payload))
});

class MainSlider extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getMainSlider: PropTypes.func.isRequired,
        slider: PropTypes.object
    };

    static defaultProps = {
        slider: {}
    };

    state = {};

    componentDidMount () {
        this.props.getMainSlider();
    }

    render () {
        const { slider } = this.props;

        return <div>
            { slider.slides.map((slide, i) => <div key={i}/>) }
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(MainSlider));
