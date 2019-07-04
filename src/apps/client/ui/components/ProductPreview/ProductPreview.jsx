import React, { Component } from 'react';
import styles from './ProductPreview.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const PREVIEW_WIDTH = 700;

class ProductPreview extends Component {
    state = {
        leftPosition: 0,
        slidesQuantity: this.props.product.files.length
    };

    static propTypes = {
        product: PropTypes.object
    };

    static defaultProps = {
        product: {}
    };

    handleDotClick = (leftMoveIndex) => () => {
        this.setState({
            leftPosition: leftMoveIndex * PREVIEW_WIDTH
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
        const { product } = this.props;
        const { slidesQuantity } = this.state;

        return <div className={styles.productPreviewContainer}>
            <div className={styles.productPreview}>
                <div className={styles.productPhotoContainer}>
                    <div className={styles.slides} style={{ left: `-${this.state.leftPosition.toString()}px` }}>
                        {product.files.map((sliderImage, i) =>
                            <div className={styles.productPreviewSlide} key={i}>
                                <img className={styles.slidePhoto} src={sliderImage} alt={`slide${i}`} />
                            </div>)}
                    </div>
                    <button
                        className={classNames(styles.buttonLeft)}
                        onClick={this.state.leftPosition !== 0 && this.handleArrowClick('left')}
                    >
                        <div className={this.state.leftPosition === 0 && styles.buttonDisabled ? styles.buttonDisabled : styles.buttonEnabled}/>
                    </button>
                    <button
                        className={classNames(styles.buttonRight)}
                        onClick={this.state.leftPosition !== (PREVIEW_WIDTH * (slidesQuantity - 1)) && this.handleArrowClick('right')}
                    >
                        <div className={this.state.leftPosition === (PREVIEW_WIDTH * (slidesQuantity - 1)) ? styles.buttonDisabled : styles.buttonEnabled}/>
                    </button>
                    <div className={styles.dotsContainer}>
                        <div className={styles.buttonDots}>
                            {product.files.map((sliderImage, i) =>
                                <div key={i} className={classNames(styles.dot, {
                                    [styles.dotActive]: this.state.leftPosition === i * PREVIEW_WIDTH
                                })}
                                onClick={this.handleDotClick(i)}/>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.productInfoContainer}>
                    <div className={styles.productPreviewHeader}>
                        <div className={styles.productName}>{product.name}</div>
                        <div className={styles.likeIcon}><img src='/src/apps/client/ui/components/ProductPreview/images/heartIcon.png' alt='' /></div>
                    </div>
                    <div className={styles.productPreviewInfo}>
                        <div className={styles.parameters}>
                            {product.features.map((parameter, i) =>
                                <div key={i} className={classNames(styles.parameterLine, {
                                    [styles.parameterLineGrey]: i % 2 !== 0
                                })}>
                                    <div className={styles.parameterName}>{parameter.prop}</div>
                                    <div className={styles.parameterValue}>{parameter.value}</div>
                                </div>
                            )}
                        </div>
                        <div className={styles.description}>{product.description}
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={classNames(styles.addToBasketButton, styles.buttonDefault)}>в корзину</button>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default ProductPreview;
