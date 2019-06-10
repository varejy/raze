import React, { Component } from 'react';
import styles from './ProductPreview.css';
import classNames from 'classnames';

const PREVIEW_WIDTH = 696;

class ProductPreview extends Component {
    state = {
        leftPosition: 0
    };

    handleDotClick = (leftMove) => () => {
        this.setState({
            leftPosition: leftMove
        });
    };

    handleArrowClick = (arrowType) => () => {
        if (arrowType === 'left') {
            this.setState({
                leftPosition: this.state.leftPosition - PREVIEW_WIDTH
            });
        } else {
            this.setState({
                leftPosition: this.state.leftPosition + PREVIEW_WIDTH
            });
        }
    };

    render () {
        return <div className={styles.productPreviewContainer}>
            <div className={styles.productPreview}>
                <div className={styles.productPhotoContainer}>
                    <div className={styles.slides} style={{ left: `-${this.state.leftPosition.toString()}px` }}>
                        <div className={styles.productPreviewSlide}>
                            <img className={styles.slidePhoto} src='/src/apps/client/ui/components/ProductPreview/images/ontario1.jpg' alt=''/>
                        </div>
                        <div className={styles.productPreviewSlide}>
                            <img className={styles.slidePhoto} src='/src/apps/client/ui/components/ProductPreview/images/ontario2.jpg' alt=''/>
                        </div>
                        <div className={styles.productPreviewSlide}>
                            <img className={styles.slidePhoto} src='/src/apps/client/ui/components/ProductPreview/images/ontario3.jpg' alt=''/>
                        </div>
                        <div className={styles.productPreviewSlide}>
                            <img className={styles.slidePhoto} src='/src/apps/client/ui/components/ProductPreview/images/ontario4.jpg' alt=''/>
                        </div>
                        <div className={styles.productPreviewSlide}>
                            <img className={styles.slidePhoto} src='/src/apps/client/ui/components/ProductPreview/images/ontario5.jpg' alt=''/>
                        </div>
                    </div>
                    <button className={classNames(styles.buttonLeft, this.state.leftPosition === 0 && styles.buttonDisabled)}
                        onClick={this.state.leftPosition !== 0 && this.handleArrowClick('left')}>
                        <img src='/src/apps/client/ui/components/ProductPreview/images/arrowLeft.png' alt=''/>
                    </button>
                    <button className={classNames(styles.buttonRight, this.state.leftPosition === (PREVIEW_WIDTH * 4) && styles.buttonDisabled)}
                        onClick={this.state.leftPosition !== (PREVIEW_WIDTH * 4) && this.handleArrowClick('right')}>
                        <img src='/src/apps/client/ui/components/ProductPreview/images/arrowRight.png' alt=''/>
                    </button>
                    <div className={styles.dotsContainer}>
                        <div className={styles.buttonDots}>
                            <div className={classNames(styles.dot, this.state.leftPosition === 0 && styles.dotActive)}
                                onClick={this.handleDotClick(0)}/>
                            <div className={classNames(styles.dot, this.state.leftPosition === PREVIEW_WIDTH && styles.dotActive)}
                                onClick={this.handleDotClick(PREVIEW_WIDTH * 1)}/>
                            <div className={classNames(styles.dot, this.state.leftPosition === (PREVIEW_WIDTH * 2) && styles.dotActive)}
                                onClick={this.handleDotClick(PREVIEW_WIDTH * 2)}/>
                            <div className={classNames(styles.dot, this.state.leftPosition === (PREVIEW_WIDTH * 3) && styles.dotActive)}
                                onClick={this.handleDotClick(PREVIEW_WIDTH * 3)}/>
                            <div className={classNames(styles.dot, styles.lastChildDot, this.state.leftPosition === (PREVIEW_WIDTH * 4) && styles.dotActive)}
                                onClick={this.handleDotClick(PREVIEW_WIDTH * 4)}/>
                        </div>
                    </div>
                </div>
                <div className={styles.productInfoContainer}>
                    <div className={styles.productPreviewHeader}>
                        <div className={styles.productName}>название товара</div>
                        <div className={styles.likeIcon}><img src="/src/apps/client/ui/components/ProductPreview/images/heartIcon.png" alt=''/></div>
                    </div>
                    <div className={styles.productPreviewInfo}>
                        <div className={styles.parameters}>
                            <div className={styles.parameterLine}>
                                <div className={styles.parameterName}>Лезвие</div>
                                <div className={styles.parameterValue}>Сталь</div>
                            </div>
                            <div className={styles.parameterLine}>
                                <div className={styles.parameterName}>Длина</div>
                                <div className={styles.parameterValue}>25 см</div>
                            </div>
                            <div className={styles.parameterLine}>
                                <div className={styles.parameterName}>Ширина</div>
                                <div className={styles.parameterValue}>15 см</div>
                            </div>
                        </div>
                        <div className={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse
                            ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.addToBasketButton}>в корзину</button>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default ProductPreview;
