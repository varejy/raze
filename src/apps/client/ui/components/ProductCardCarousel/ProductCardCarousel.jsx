import React, { Component } from 'react';
import styles from './ProductCardCarousel.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const BIG_SLIDE_WIDTH = 600;
const LEFT_SLIDER_HEIGHT = 80;
const SLIDES_WITHOUT_ARROWS = 3;
const SCREEN_WIDTH_SLIDER_FULL = 1169;
const mapStateToProps = ({ application, savedProducts }) => {
    return {
        media: application.media
    };
};

class ProductCardCarousel extends Component {
    static propTypes = {
        sliderImages: PropTypes.array,
        media: PropTypes.object.isRequired
    };

    static defaultProps = {
        sliderImages: [],
        media: {}
    };

    constructor (...args) {
        super(...args);

        this.minSlideIndex = 0;
        this.maxSlideIndex = this.props.sliderImages.length - 1;
        this.arrowsShowed = this.props.sliderImages.length > SLIDES_WITHOUT_ARROWS;
    }

    state = {
        activeSlide: 0,
        leftSliderTopIndex: 0
    };

    handleDotClick = (newIndex) => () => {
        const { activeSlide, leftSliderTopIndex } = this.state;

        if (activeSlide === newIndex) {
            return;
        }

        let newLeftSliderTopIndex;

        if (newIndex >= leftSliderTopIndex && newIndex <= leftSliderTopIndex + SLIDES_WITHOUT_ARROWS - 1) {
            newLeftSliderTopIndex = leftSliderTopIndex;
        } else if (newIndex < leftSliderTopIndex) {
            newLeftSliderTopIndex = newIndex;
        } else {
            newLeftSliderTopIndex = newIndex - SLIDES_WITHOUT_ARROWS + 1;
        }

        this.setState({
            activeSlide: newIndex,
            leftSliderTopIndex: newLeftSliderTopIndex
        });
    };

    handleArrowClick = (arrowType) => () => {
        const { activeSlide, leftSliderTopIndex } = this.state;

        if (arrowType === 'top') {
            if (activeSlide === this.minSlideIndex) {
                return;
            }

            this.setState({
                activeSlide: activeSlide - 1,
                leftSliderTopIndex: leftSliderTopIndex === activeSlide ? leftSliderTopIndex - 1 : leftSliderTopIndex
            });
        } else {
            if (activeSlide === this.maxSlideIndex) {
                return;
            }
            this.setState({
                activeSlide: activeSlide + 1,
                leftSliderTopIndex: activeSlide === leftSliderTopIndex + SLIDES_WITHOUT_ARROWS - 1
                    ? leftSliderTopIndex + 1 : leftSliderTopIndex
            });
        }
    };

    sliderPositionMoveCount = (direction) => () => {
        const { activeSlide, leftSliderTopIndex } = this.state;
        const { media } = this.props;
        const sliderIsFullScreen = media.width <= SCREEN_WIDTH_SLIDER_FULL;
        const leftSliderWidth = media.width * 0.2 + 20;

        if (direction === 'smallSliderLeft') {
            return sliderIsFullScreen ? -leftSliderTopIndex * leftSliderWidth : 0;
        } else if (direction === 'smallSliderTop') {
            return !sliderIsFullScreen ? -leftSliderTopIndex * LEFT_SLIDER_HEIGHT : 0;
        } else {
            return -activeSlide * (!sliderIsFullScreen ? BIG_SLIDE_WIDTH : (media.width));
        }
    };

    render () {
        const { activeSlide } = this.state;
        const { sliderImages } = this.props;
        const isTop = activeSlide === this.minSlideIndex;
        const isBottom = activeSlide === this.maxSlideIndex;

        return <div className={styles.sliders}>
            <div className={styles.sliderLeftContainer}>
                {this.arrowsShowed && <button
                    className={classNames(styles.button, styles.buttonTop)}
                    onClick={this.handleArrowClick('top')}
                >
                    <div className={classNames(styles.buttonImage, isTop ? styles.buttonDisabled : styles.buttonEnabled)}/>
                </button>}
                <div className={styles.slidesContainer}>
                    <div className={styles.sliderLeftSlides}
                        style={{ top: this.sliderPositionMoveCount('smallSliderTop')(),
                            left: this.sliderPositionMoveCount('smallSliderLeft')() }}
                    >
                        {sliderImages.map((sliderLeftImage, i) =>
                            <div
                                className={classNames(styles.sliderLeftSlide, {
                                    [styles.sliderLeftActive]: activeSlide === i
                                })}
                                onClick={this.handleDotClick(i)}
                                key={i}>
                                <img className={styles.sliderLeftPhoto} src={sliderLeftImage}
                                    alt={`slide${i}`}/>
                            </div>)}
                    </div>
                </div>
                {this.arrowsShowed && <button
                    className={classNames(styles.button, styles.buttonBottom)}
                    onClick={this.handleArrowClick('bottom')}
                >
                    <div className={classNames(styles.buttonImage, isBottom ? styles.buttonDisabled : styles.buttonEnabled)}/>
                </button>}
            </div>
            <div className={styles.sliderContainer}>
                <div className={styles.slides} style={{ left: this.sliderPositionMoveCount('bigSliderLeft')() }}>
                    {sliderImages.map((sliderImage, i) =>
                        <div className={styles.productPreviewSlide} key={i}>
                            <img className={styles.slidePhoto} src={sliderImage} alt={`slide${i}`}/>
                        </div>)}
                </div>
                <div className={styles.dotsContainer}>
                    <div className={styles.buttonDots}>
                        {sliderImages.map((sliderImage, i) =>
                            <div key={i}
                                className={classNames(styles.dot, {
                                    [styles.dotActive]: activeSlide === i
                                })}
                                onClick={this.handleDotClick(i)}/>
                        )}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(ProductCardCarousel);
