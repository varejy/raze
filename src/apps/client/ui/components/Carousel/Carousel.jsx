import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { connect } from 'react-redux';

import calcScrollbarWidth from 'scrollbar-width';

import styles from './Carousel.css';

const TIME_TO_NEXT_SWITCHING = 8000;
const SWITCHING_DURATION = 800;

const mapStateToProps = ({ application }) => {
    return {
        slides: application.mainSlides
    };
};

class Carousel extends Component {
    static propTypes = {
        slides: PropTypes.array
    };

    static defaultProps = {
        slides: []
    };

    constructor (...args) {
        super(...args);

        this.animation = false;
        this.maxSlideIndex = this.props.slides.length - 1;
        this.state = {
            activeSlideIndex: 0
        };
    }

    componentDidMount () {
        this.startSlider();
    }

    startSlider = () => {
        this.setTimeoutToNextSlide();
    };

    setTimeoutToNextSlide = () => {
        this.sliderTimoutId = setTimeout(() => {
            const { activeSlideIndex } = this.state;

            const nextActiveSlideIndex = activeSlideIndex + 1;

            this.setState({
                activeSlideIndex: nextActiveSlideIndex <= this.maxSlideIndex ? nextActiveSlideIndex : 0
            });

            this.doSlideSwitch();
        }, TIME_TO_NEXT_SWITCHING);
    };

    doSlideSwitch = () => {
        const { activeSlideIndex } = this.state;
        const scrollbarWidth = calcScrollbarWidth();

        this.animation = true;
        this.sliderTrack.style.transition = `left ${SWITCHING_DURATION}ms`;
        this.sliderTrack.style.left = `-${(document.documentElement.clientWidth * activeSlideIndex) + scrollbarWidth * activeSlideIndex}px`;

        this.sliderTimoutId = setTimeout(() => {
            this.animation = false;
            this.setTimeoutToNextSlide();
        }, SWITCHING_DURATION);
    };

    stopSlider = () => clearTimeout(this.sliderTimoutId);

    setActiveSlide = (nextActiveSlideIndex) => () => {
        const { activeSlideIndex } = this.state;

        if (this.animation || activeSlideIndex === nextActiveSlideIndex) {
            return;
        }

        this.animation = true;
        this.stopSlider();

        const scrollbarWidth = calcScrollbarWidth();

        if (this.state.activeSlideIndex < nextActiveSlideIndex) {
            const hidedSlides = nextActiveSlideIndex - activeSlideIndex - 1;

            for (let i = activeSlideIndex + 1; i < nextActiveSlideIndex; i++) {
                this.sliderTrack.children[i].style.display = 'none';
            }

            this.sliderTrack.style.transition = `left ${SWITCHING_DURATION}ms`;
            this.sliderTrack.style.left =
                `-${(document.documentElement.clientWidth * (nextActiveSlideIndex - hidedSlides)) + scrollbarWidth * (nextActiveSlideIndex - hidedSlides)}px`;
        } else {
            this.sliderTrack.style.transition = 'none';

            for (let i = nextActiveSlideIndex + 1; i < activeSlideIndex; i++) {
                this.sliderTrack.style.left =
                    `-${(document.documentElement.clientWidth * (nextActiveSlideIndex + 1)) + scrollbarWidth * (nextActiveSlideIndex + 1)}px`;
                this.sliderTrack.children[i].style.display = 'none';
            }

            setTimeout(() => {
                this.sliderTrack.style.transition = `left ${SWITCHING_DURATION}ms`;
                this.sliderTrack.style.left = `-${(document.documentElement.clientWidth * nextActiveSlideIndex) + scrollbarWidth * nextActiveSlideIndex}px`;
            }, 0);
        }

        this.setState({
            activeSlideIndex: nextActiveSlideIndex
        });

        setTimeout(() => {
            for (let i = 0; i < this.sliderTrack.children.length; i++) {
                this.sliderTrack.children[i].style.display = 'inline-block';
            }
            this.sliderTrack.style.transition = 'none';
            this.sliderTrack.style.left = `-${(document.documentElement.clientWidth * nextActiveSlideIndex) + scrollbarWidth * nextActiveSlideIndex}px`;

            this.animation = false;
            this.setTimeoutToNextSlide();
        }, SWITCHING_DURATION);
    };

    renderSlide = (slide, i) => <div className={styles.slide} key={i}>
        <div className={styles.imageWrapper}>
            <img
                className={styles.image} src={slide.path}
                alt={`slide${i}`}
            />
        </div>
        <div className={styles.contentWrapper}>
            <div className={styles.content}>
                { slide.title && <h2 className={styles.title}>{ slide.title }</h2> }
                { slide.description && <div className={styles.description}>{ slide.description }</div> }
            </div>
        </div>
    </div>;

    render () {
        const { slides } = this.props;
        const { activeSlideIndex } = this.state;

        return <div className={styles.carousel}>
            <div className={styles.sliderTrack} ref={ref => { this.sliderTrack = ref; }}>
                { slides.map((slide, i) => this.renderSlide(slide, i, slides)) }
            </div>
            <div className={styles.dots}>
                { slides.map((slide, i) =>
                    <div key={i} className={classNames(styles.dot, { [styles.dotActive]: i === activeSlideIndex })} onClick={this.setActiveSlide(i)} />) }
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(Carousel);
