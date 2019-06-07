import React, { Component } from 'react';
import styles from './Carousel.css';
import CarouselSlider from '../CarouselSlider/CarouselSlider.jsx';
import classNames from 'classnames';

const sliders = [
    { url: '../../../../../../client/images/banner-image.jpg' },
    { url: '../../../../../../client/images/banner-image-2.jpg' },
    { url: '../../../../../../client/images/banner-image-3.jpg' }
];

class Carousel extends Component {
    state = {
        activeTabName: 'tab1'
    };
    handleTabClick = (tabName) => () => {
        this.setState({
            activeTabName: tabName
        });
    };
    render () {
        const { activeTabName } = this.state;
        return <div className={styles.carousel}>
            {sliders.map((slider, i) =>
                <CarouselSlider
                    key={i}
                    url={slider.url}
                    activeTabName={this.state.activeTabName}
                />)
            }
            <div className={styles.dots_container}>
                <div className={styles.carousel_dots}>
                    <div className={classNames(styles.dot_button, activeTabName === 'tab1' && styles.active)} onClick={this.handleTabClick('tab1')}/>
                    <div className={classNames(styles.dot_button, activeTabName === 'tab2' && styles.active)} onClick={this.handleTabClick('tab2')}/>
                    <div className={classNames(styles.dot_button, activeTabName === 'tab3' && styles.active)} onClick={this.handleTabClick('tab3')}/>
                </div>
            </div>
        </div>;
    }
}

export default Carousel;
