import React, { Component } from 'react';
import styles from './ProductCard.css';
import classNames from 'classnames';

const SLIDER_IMAGES = [
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario1.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario2.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario3.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario4.jpg' },
    { path: '/src/apps/client/ui/components/ProductPreview/images/ontario5.jpg' }
];
const BIG_SLIDE_WIDTH = 700;
const LEFT_SLIDER_HEIGHT = 80;
const SLIDES_QUANTITY = SLIDER_IMAGES.length;
const LABELS = [
    { labelText: 'топ продаж', labelColor: '#ff0000' },
    { labelText: 'низкая цена', labelColor: '#ffb116' },
    { labelText: 'товар заканчивается', labelColor: '#797979' }
];
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
const PREVIOUSLY_VIEWED = [
    {
        avatarPath: '/src/apps/client/ui/components/ProductCard/images/avatar.jpg',
        productName: 'Тесак Emerson',
        categoryName: 'Ножи',
        price: '1000 UAH'
    },
    {
        avatarPath: '/src/apps/client/ui/components/ProductCard/images/avatar.jpg',
        productName: 'Мачете Emerson',
        categoryName: 'Ножи',
        price: '1500 UAH'
    },
    {
        avatarPath: '/src/apps/client/ui/components/ProductCard/images/avatar.jpg',
        productName: 'Колун Cold Steel',
        categoryName: 'Топоры',
        price: '500 UAH'
    }
];
const RATING_STARS = 3.5;

class ProductCard extends Component {
    state = {
        stars: {
            starFull: '/src/apps/client/ui/components/ProductCard/images/starFull.png',
            starHalfFull: '/src/apps/client/ui/components/ProductCard/images/starHalfFull.png',
            starEmpty: '/src/apps/client/ui/components/ProductCard/images/starEmpty.png'
        },
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
        if (this.state.i <= 2) {
            return 0;
        } else if (this.state.i > 2) {
            return (-(this.state.topPosition - LEFT_SLIDER_HEIGHT * 2)).toString();
        }
    };

    renderStars = () => {
        let fullStars = Math.floor(RATING_STARS);
        let halfStars = 0;
        if (RATING_STARS % fullStars > 0) {
            halfStars = 1;
        }
        let emptyStars = 5 - fullStars - halfStars;
        let starsArray = [];
        for (let i = 0; i < fullStars; i++) {
            starsArray.push(this.state.stars.starFull);
        }
        for (let i = 0; i < halfStars; i++) {
            starsArray.push(this.state.stars.starHalfFull);
        }
        for (let i = 0; i < emptyStars; i++) {
            starsArray.push(this.state.stars.starEmpty);
        }
        return starsArray;
    };

    render () {
        return <div className={styles.productCardContainer}>
            <div className={styles.topProductInfo}>
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
                                style = {{ top: `${this.handleLeftSliderClick()}px` }}
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
                </div>
                <div className={styles.productInfo}>
                    <div className={styles.labels}>
                        {LABELS.map((label, i) =>
                            <div key={i} className={styles.label}
                                style={{ color: label.labelColor }}>{label.labelText}</div>
                        )}
                    </div>
                    <div className={styles.productCardHeader}>
                        <div className={styles.productName}>название товара</div>
                        <div><img className={styles.heartIcon}
                            src='/src/apps/client/ui/components/ProductCard/images/likeHeart.png' alt=''/></div>
                    </div>
                    <div className={styles.stars}>
                        {this.renderStars().map((star, i) =>
                            <div key={i} className={styles.star}><img src={star} alt=''/></div>
                        )}
                    </div>
                    <div className={styles.order}>
                        <div className={styles.prices}>
                            <div className={styles.pricePrevious}>45$</div>
                            <div className={styles.price}>45$</div>
                        </div>
                        <button className={classNames(styles.orderButton, styles.buttonDefault)}>Оформление заказа
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.bottomProductInfo}>
                <div className={classNames(styles.productDescription, styles.infoContainer)}>
                    <div className={styles.bottomHeader}>описание товара</div>
                    <div className={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse
                        ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
                    </div>
                </div>
                <div className={classNames(styles.productParameters, styles.infoContainer)}>
                    <div className={styles.bottomHeader}>характеристика товара</div>
                    <div className={styles.parameters}>
                        {PARAMETERS.map((parameter, i) =>
                            <div key={i} className={classNames(styles.parameterLine, {
                                [styles.parameterLineGrey]: i % 2 !== 0
                            })}>
                                <div className={styles.parameterName}>{parameter.parameterName}</div>
                                <div className={styles.parameterValue}>{parameter.parameterValue}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={classNames(styles.productFeedbacks, styles.infoContainer)}>
                    <div className={styles.bottomHeader}>всего отзывов</div>
                    <div className={styles.feedbacks}>
                        <div className={styles.feedbackNone}>
                            К данному товару не было оставлено комментариев
                        </div>
                    </div>
                </div>
                <div className={classNames(styles.productPreviouslyViewed, styles.infoContainer)}>
                    <div className={styles.bottomHeader}>недавно просматривали</div>
                    <div className={styles.previouslyViewed}>
                        {PREVIOUSLY_VIEWED.map((item, i) =>
                            <div key={i} className={styles.previouslyViewedItem}>
                                <div><img className={styles.avatar} src={item.avatarPath} alt=''/></div>
                                <div className={styles.itemInfoContainer}>
                                    <div className={styles.viewedProductName}>{item.productName}</div>
                                    <div className={styles.viewedCategoryName}>{item.categoryName}</div>
                                    <div className={styles.itemPrice}>{item.price}</div>
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default ProductCard;
