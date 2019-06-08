import React, { Component } from 'react';
import styles from './CarouselSlider.css';
import PropTypes from 'prop-types';

class CarouselSlider extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        activeTabName: PropTypes.string.isRequired
    };
    render () {
        return <div
            className={this.props.activeTabName === 'tab1'
                ? styles.slider_container_first_slide
                : this.props.activeTabName === 'tab2' ? styles.slider_container_second_slide
                    : styles.slider_container_third_slide }
            style={{ backgroundImage: `url(${this.props.url})` }}/>;
    }
}

export default CarouselSlider;
