import React, { Component } from 'react';
import styles from './ProductCardCarousel.css';
import classNames from 'classnames';

const SLIDER_IMAGES = [
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario1.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario2.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario3.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario4.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario5.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario1.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario2.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario3.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario4.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario5.jpg' }
];
const BIG_SLIDE_WIDTH = 600;
const LEFT_SLIDER_HEIGHT = 80;
const SLIDES_QUANTITY = SLIDER_IMAGES.length;

class ProductCardCarousel extends Component {
    state = {
        leftPosition: 0,
        topPosition: 0,
        i: 0
    };

    handleDotClick = (leftMoveIndex) => () => {
        this.setState({
            leftPosition: leftMoveIndex * BIG_SLIDE_WIDTH,
            topPosition: leftMoveIndex * LEFT_SLIDER_HEIGHT,
            i: leftMoveIndex
        });
    };

    handleArrowClick = (arrowType) => () => {
        if (arrowType === 'top') {
            this.setState({
                leftPosition: this.state.leftPosition - BIG_SLIDE_WIDTH,
                topPosition: this.state.topPosition - LEFT_SLIDER_HEIGHT,
                i: this.state.i > 0 ? this.state.i - 1 : 0
            });
        } else {
            this.setState({
                leftPosition: this.state.leftPosition + BIG_SLIDE_WIDTH,
                topPosition: this.state.topPosition + LEFT_SLIDER_HEIGHT,
                i: this.state.i + 1
            });
        }
    };

    handleLeftSliderClick = () => {
        let slideNumber = this.state.i;
        if (slideNumber === 0 || slideNumber === 1 || slideNumber === 2) {
            return 0;
        } else if (slideNumber === (SLIDES_QUANTITY - 1)) {
            if (SLIDES_QUANTITY % 3 === 1) {
                return (-(LEFT_SLIDER_HEIGHT * ((3 * Math.floor(SLIDES_QUANTITY / 3) - (SLIDES_QUANTITY % 3 + 1))))).toString();
            }
            if (SLIDES_QUANTITY % 3 === 2) {
                return (-(LEFT_SLIDER_HEIGHT * ((3 * Math.floor(SLIDES_QUANTITY / 3) - (SLIDES_QUANTITY % 3 - 1))))).toString();
            } else if (SLIDES_QUANTITY % 3 === 0) {
                return (-(LEFT_SLIDER_HEIGHT * ((3 * Math.floor(SLIDES_QUANTITY / 3) - (SLIDES_QUANTITY % 3 + 3))))).toString();
            }
        } else {
            for (let k = 3; k <= SLIDES_QUANTITY; k++) {
                if (slideNumber === k) {
                    return (-(LEFT_SLIDER_HEIGHT * (k - 2))).toString();
                }
            }
        }
    };

    render () {
        return <div className={styles.sliders}>
            <div className={styles.sliderLeftContainer}>
                {SLIDES_QUANTITY > 3 && <button
                    className={classNames(styles.buttonTop)}
                    onClick={this.state.leftPosition !== 0 && this.handleArrowClick('top')}
                >
                    <div
                        className={this.state.leftPosition === 0 && styles.buttonDisabled
                            ? styles.buttonDisabled
                            : styles.buttonEnabled}/>
                </button>}
                <div className={styles.slidesContainer}>
                    <div className={styles.sliderLeftSlides}
                        style={{ top: `${this.handleLeftSliderClick()}px` }}
                    >
                        {SLIDER_IMAGES.map((sliderLeftImage, i) =>
                            <div
                                className={classNames(styles.sliderLeftSlide,
                                    this.state.topPosition === i * LEFT_SLIDER_HEIGHT && styles.sliderLeftActive)}
                                onClick={this.handleDotClick(i)}
                                key={i}>
                                <img className={styles.sliderLeftPhoto} src={sliderLeftImage.path}
                                    alt={`slide${i}`}/>
                            </div>)}
                    </div>
                </div>
                {SLIDES_QUANTITY > 3 && <button
                    className={classNames(styles.buttonBottom)}
                    onClick={this.state.leftPosition !== (BIG_SLIDE_WIDTH * (SLIDES_QUANTITY - 1)) &&
                    this.handleArrowClick('bottom')}
                >
                    <div
                        className={this.state.leftPosition === (BIG_SLIDE_WIDTH * (SLIDES_QUANTITY - 1))
                            ? styles.buttonDisabled
                            : styles.buttonEnabled}/>
                </button>}
            </div>
            <div className={styles.sliderContainer}>
                <div className={styles.slides} style={{ left: `-${this.state.leftPosition.toString()}px` }}>
                    {SLIDER_IMAGES.map((sliderImage, i) =>
                        <div className={styles.productPreviewSlide} key={i}>
                            <img className={styles.slidePhoto} src={sliderImage.path} alt={`slide${i}`}/>
                        </div>)}
                </div>
                <div className={styles.dotsContainer}>
                    <div className={styles.buttonDots}>
                        {SLIDER_IMAGES.map((sliderImage, i) =>
                            <div key={i}
                                className={classNames(styles.dot,
                                    this.state.leftPosition === i * BIG_SLIDE_WIDTH && styles.dotActive)}
                                onClick={this.handleDotClick(i)}/>
                        )}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default ProductCardCarousel;
