import React, { Component } from 'react';
import styles from './ProductCardCarousel.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Draggable from '../Draggable/Draggable.jsx';

const PROCESS_SWIPE_STATUS = 'process';
const END_SWIPE_STATUS = 'end';
const IGNORE_SWIPE_DISTANCE = 50;
const BIG_SLIDE_WIDTH = 600;
const LEFT_SLIDER_HEIGHT = 80;
const SLIDES_WITHOUT_ARROWS = 3;
const SCREEN_WIDTH_SLIDER_FULL = 1169;
const mapStateToProps = ({ application }) => {
    return {
        mediaWidth: application.media.width
    };
};

class ProductCardCarousel extends Component {
    static propTypes = {
        sliderImages: PropTypes.array,
        mediaWidth: PropTypes.number.isRequired
    };

    static defaultProps = {
        sliderImages: []
    };

    constructor (...args) {
        super(...args);

        this.minSlideIndex = 0;
        this.maxSlideIndex = this.props.sliderImages.length - 1;
        this.arrowsShowed = this.props.sliderImages.length > SLIDES_WITHOUT_ARROWS;
    }

    state = {
        activeSlide: 0,
        leftSliderTopIndex: 0,
        sliderLeft: 0,
        sliderLeftSmall: 0
    };

    maxSlide = this.props.sliderImages.length - 1;
    maxLeft = this.maxSlide * this.props.mediaWidth;
    maxLeftSmall = this.maxSlide * this.props.mediaWidth * 0.2 + 20;

    componentWillReceiveProps (nextProps) {
        if (nextProps.mediaWidth !== this.props.mediaWidth) {
            const { activeSlide, leftSliderTopIndex } = this.state;

            this.maxLeft = this.maxSlide * nextProps.mediaWidth;
            this.maxLeftSmall = this.maxSlide * nextProps.mediaWidth * 0.2 + 20;
            this.setState({
                sliderLeft: activeSlide * nextProps.mediaWidth,
                sliderLeftSmall: leftSliderTopIndex * nextProps.mediaWidth * 0.2 + 20
            });
        }
    }

    getTransitionStyles = () => {
        switch (this.swipeStatus) {
        case PROCESS_SWIPE_STATUS:
            return { transition: 'none' };
        case END_SWIPE_STATUS:
            return { transition: 'left .3s' };
        default:
            return { transition: 'left .5s' };
        }
    };

    handleSwitchClick = i => e => {
        const { mediaWidth } = this.props;

        this.setState({
            sliderLeft: i * mediaWidth,
            activeSlide: i
        });
    };

    handleDragStart = () => {
        this.startLeft = this.state.sliderLeft;
        this.swipeStatus = PROCESS_SWIPE_STATUS;
    };

    handleDragProcess = ({ delta: { client: { x: deltaX } } }) => {
        const nextSliderLeft = this.startLeft - deltaX;

        if (nextSliderLeft < 0 || nextSliderLeft > this.maxLeft) {
            return;
        }

        this.setState({
            sliderLeft: this.startLeft - deltaX
        });
    };

    handleDragEnd = ({ delta: { client: { x: deltaX } } }) => {
        const { mediaWidth, sliderImages } = this.props;
        const { activeSlide } = this.state;
        const newActiveSlideIndex = deltaX > 0 ? activeSlide - 1 : activeSlide + 1;

        if (Math.abs(deltaX) < IGNORE_SWIPE_DISTANCE || newActiveSlideIndex === -1 || newActiveSlideIndex === sliderImages.length) {
            return this.setState({
                sliderLeft: activeSlide * mediaWidth
            });
        }
        this.handleDotClick(newActiveSlideIndex)();

        this.startLeft = null;
        this.swipeStatus = END_SWIPE_STATUS;
        this.setState({
            sliderLeft: newActiveSlideIndex * mediaWidth,
            activeSlide: newActiveSlideIndex
        }, () => {
            this.swipeStatus = null;
        });
    };

    handleDragStartSmallSlider = () => {
        this.startLeftSmall = this.state.sliderLeftSmall;
        this.swipeStatus = PROCESS_SWIPE_STATUS;
    };

    handleDragProcessSmallSlider = ({ delta: { client: { x: deltaX } } }) => {
        const nextSliderLeftSmall = this.startLeftSmall - deltaX;

        if (nextSliderLeftSmall < 0 || nextSliderLeftSmall > this.maxLeftSmall) {
            return;
        }

        this.setState({
            sliderLeftSmall: this.startLeftSmall - deltaX
        });
    };

    handleDragEndSmallSlider = ({ delta: { client: { x: deltaX } } }) => {
        const { mediaWidth, sliderImages } = this.props;
        const { leftSliderTopIndex } = this.state;
        const newActiveSlideIndex = deltaX > 0 ? leftSliderTopIndex - 1 : leftSliderTopIndex + 1;

        if (Math.abs(deltaX) < IGNORE_SWIPE_DISTANCE || newActiveSlideIndex === -1 || newActiveSlideIndex === sliderImages.length) {
            return this.setState({
                sliderLeftSmall: newActiveSlideIndex * mediaWidth * 0.2 + 20
            });
        }

        this.handleArrowClick(newActiveSlideIndex > leftSliderTopIndex ? 'bottom' : 'top')();

        this.startLeftSmall = null;
        this.swipeStatus = END_SWIPE_STATUS;
        this.setState({
        }, () => {
            this.swipeStatus = null;
        });
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

        this.handleSwitchClick(newIndex);
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
        const { mediaWidth } = this.props;
        const sliderIsFullScreen = mediaWidth <= SCREEN_WIDTH_SLIDER_FULL;
        const leftSliderWidth = mediaWidth * 0.2 + 20;

        if (direction === 'smallSliderLeft') {
            return sliderIsFullScreen ? -leftSliderTopIndex * leftSliderWidth : 0;
        } else if (direction === 'smallSliderTop') {
            return !sliderIsFullScreen ? -leftSliderTopIndex * LEFT_SLIDER_HEIGHT : 0;
        } else {
            return -activeSlide * (!sliderIsFullScreen ? BIG_SLIDE_WIDTH : (mediaWidth));
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
                    <Draggable
                        onDragStart={this.handleDragStartSmallSlider}
                        onDrag={this.handleDragProcessSmallSlider}
                        onDragEnd={this.handleDragEndSmallSlider}
                        allowDefaultAction
                        touchable
                    >
                        <div className={styles.sliderLeftSlides}
                            style={{ top: this.sliderPositionMoveCount('smallSliderTop')(),
                                left: this.sliderPositionMoveCount('smallSliderLeft')(),
                                ...this.getTransitionStyles() }}
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
                    </Draggable>
                </div>
                {this.arrowsShowed && <button
                    className={classNames(styles.button, styles.buttonBottom)}
                    onClick={this.handleArrowClick('bottom')}
                >
                    <div className={classNames(styles.buttonImage, isBottom ? styles.buttonDisabled : styles.buttonEnabled)}/>
                </button>}
            </div>
            <div className={styles.sliderContainer}>
                <Draggable
                    onDragStart={this.handleDragStart}
                    onDrag={this.handleDragProcess}
                    onDragEnd={this.handleDragEnd}
                    allowDefaultAction
                    touchable
                >
                    <div className={styles.slides} style={{ left: this.sliderPositionMoveCount('bigSliderLeft')(), ...this.getTransitionStyles() }}>
                        {sliderImages.map((sliderImage, i) =>
                            <div className={styles.productPreviewSlide} key={i}>
                                <img className={styles.slidePhoto} src={sliderImage} alt={`slide${i}`}/>
                            </div>)}
                    </div>
                </Draggable>
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
