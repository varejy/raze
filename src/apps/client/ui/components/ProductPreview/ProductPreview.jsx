import React, { Component } from 'react';
import styles from './ProductPreview.css';
import classNames from 'classnames';

const PARAMETERS = [
    {
        parameterName: 'Лезвие',
        parameterValue: 'Сталь'
    },
    {
        parameterName: 'Длина',
        parameterValue: '25 см'
    },
    {
        parameterName: 'Ширина',
        parameterValue: '15 см'
    }
];

const PRODUCT_INFO = {
    productName: 'название товара',
    productDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,\n' +
        '                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse\n' +
        '                            ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.'
};

const SLIDER_IMAGES = [
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario1.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario2.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario3.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario4.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario5.jpg' }
];

const PREVIEW_WIDTH = 700;

const SLIDES_QUANTITY = SLIDER_IMAGES.length;

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
                        {SLIDER_IMAGES.map((SLIDER_IMAGE, i) =>
                            <div className={styles.productPreviewSlide} key={i}>
                                <img className={styles.slidePhoto} src={SLIDER_IMAGE.path} alt={`slide${i}`} />
                            </div>)}
                    </div>
                    <button
                        className={classNames(styles.buttonLeft, this.state.leftPosition === 0 && styles.buttonDisabled)}
                        onClick={this.state.leftPosition !== 0 && this.handleArrowClick('left')}
                    >
                        <img src='/src/apps/client/ui/components/ProductPreview/images/arrowLeft.png' alt=''/>
                    </button>
                    <button
                        className={classNames(styles.buttonRight, this.state.leftPosition === (PREVIEW_WIDTH * (SLIDES_QUANTITY - 1)) && styles.buttonDisabled)}
                        onClick={this.state.leftPosition !== (PREVIEW_WIDTH * (SLIDES_QUANTITY - 1)) && this.handleArrowClick('right')}
                    >
                        <img src='/src/apps/client/ui/components/ProductPreview/images/arrowRight.png' alt=''/>
                    </button>
                    <div className={styles.dotsContainer}>
                        <div className={styles.buttonDots}>
                            {SLIDER_IMAGES.map((SLIDER_IMAGE, i) =>
                                <div key={i} className={classNames(styles.dot, this.state.leftPosition === (PREVIEW_WIDTH * i) && styles.dotActive)}
                                    onClick={this.handleDotClick(PREVIEW_WIDTH * i)}/>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.productInfoContainer}>
                    <div className={styles.productPreviewHeader}>
                        <div className={styles.productName}>{PRODUCT_INFO.productName}</div>
                        <div className={styles.likeIcon}><img src='/src/apps/client/ui/components/ProductPreview/images/heartIcon.png' alt='' /></div>
                    </div>
                    <div className={styles.productPreviewInfo}>
                        <div className={styles.parameters}>
                            {PARAMETERS.map((PARAMETER, i) =>
                                <div key={i} className={styles.parameterLine}>
                                    <div className={styles.parameterName}>{PARAMETER.parameterName}</div>
                                    <div className={styles.parameterValue}>{PARAMETER.parameterValue}</div>
                                </div>
                            )}
                        </div>
                        <div className={styles.description}>{PRODUCT_INFO.productDescription}
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
