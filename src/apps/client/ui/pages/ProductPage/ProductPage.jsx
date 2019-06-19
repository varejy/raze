import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import getProductById from '../../../services/client/getProductById';

import { withRouter, matchPath } from 'react-router-dom';

import styles from './ProductPage.css';
import ProductCardCarousel from '../../components/ProductCardCarousel/ProductCardCarousel';
import classNames from 'classnames';

const PRODUCT_PATH = '/:category/:id';
const LABELS = {
    notAvailable: '#ff0000',
    topSales: '#ffb116',
    almostGone: '#797979'
};
const PREVIOUSLY_VIEWED = [
    {
        avatarPath: '/src/apps/client/ui/pages/ProductPage/images/avatar.jpg',
        productName: 'Тесак Emerson',
        categoryName: 'Ножи',
        price: '1000'
    },
    {
        avatarPath: '/src/apps/client/ui/pages/ProductPage/images/avatar.jpg',
        productName: 'Мачете Emerson',
        categoryName: 'Ножи',
        price: '1500'
    },
    {
        avatarPath: '/src/apps/client/ui/pages/ProductPage/images/avatar.jpg',
        productName: 'Колун Cold Steel',
        categoryName: 'Топоры',
        price: '500'
    }
];
const STAR = {
    full: '/src/apps/client/ui/pages/ProductPage/images/starFull.png',
    half: '/src/apps/client/ui/pages/ProductPage/images/starHalfFull.png',
    empty: '/src/apps/client/ui/pages/ProductPage/images/starEmpty.png'
};
const RATING_STARS = 3.5;

const mapStateToProps = ({ application }) => {
    return {
        productMap: application.productMap
    };
};

const mapDispatchToProps = (dispatch) => ({
    getProductById: payload => dispatch(getProductById(payload))
});

class ProductPage extends Component {
    static propTypes = {
        getProductById: PropTypes.func.isRequired,
        location: PropTypes.object,
        productMap: PropTypes.object
    };

    static defaultProps = {
        location: {},
        productMap: {}
    };

    constructor (...args) {
        super(...args);

        const { location: { pathname }, productMap } = this.props;
        const match = matchPath(pathname, { path: PRODUCT_PATH, exact: true });
        const product = productMap[match.params.id];

        this.notFoundPage = product === null;

        this.state = {
            loading: !this.notFoundPage && !product,
            product: product,
            productId: match.params.id
        };
    }

    componentDidMount () {
        const { loading, productId } = this.state;

        if (loading) {
            this.props.getProductById(productId)
                .then(() => this.setState({ loading: false }));
        }
    }

    componentWillReceiveProps (nextProps) {
        const { productId } = this.state;

        if (nextProps.productMap !== this.props.productMap) {
            this.setState({ product: nextProps.productMap[productId] });
        }
    }

    renderStars = () => {
        const fullStars = Math.floor(RATING_STARS);
        let halfStars = 0;
        if (RATING_STARS % fullStars > 0) {
            halfStars = 1;
        }
        const emptyStars = 5 - fullStars - halfStars;
        let starsArray = [];
        for (let i = 0; i < fullStars; i++) {
            starsArray.push(STAR.full);
        }
        if (halfStars !== 0) {
            starsArray.push(STAR.half);
        }
        for (let i = 0; i < emptyStars; i++) {
            starsArray.push(STAR.empty);
        }
        return starsArray;
    };

    findColor = (tag) => {
        let color = '';
        switch (tag) {
        case 'almostGone':
            color = LABELS.almostGone;
            break;
        case 'notAvailable':
            color = LABELS.notAvailable;
            break;
        case 'topSales':
            color = LABELS.topSales;
            break;
        }
        return color;
    };

    render () {
        const { loading, product } = this.state;

        // TODO: Сделать страницу Not Found
        if (this.notFoundPage) {
            return <div>404</div>;
        }

        if (loading) {
            return <div className={styles.loader}>
                <img src='/src/apps/client/ui/icons/loader.svg' alt='loader'/>
            </div>;
        }

        return <section>
            <div className={styles.productCardContainer}>
                <div className={styles.topProductInfo}>
                    <ProductCardCarousel sliderImages={product.files}/>
                    <div className={styles.productInfo}>
                        <div className={styles.tags}>
                            {product.tags.map((tag, i) =>
                                <div key={i} className={styles.tag}
                                    style={{ color: this.findColor(tag) }}>{tag}</div>
                            )}
                        </div>
                        <div className={styles.productCardHeader}>
                            <div className={styles.productName}>{product.name}</div>
                            <div><img className={styles.heartIcon}
                                src='/src/apps/client/ui/pages/ProductPage/images/likeHeart.png' alt='like'/></div>
                        </div>
                        <div className={styles.stars}>
                            {this.renderStars().map((star, i) =>
                                <div key={i} className={styles.star}><img src={star} alt='star'/></div>
                            )}
                        </div>
                        <div className={styles.order}>
                            {product.discountPrice
                                ? <div className={styles.prices}>
                                    <div className={styles.pricePrevious}>{product.price}</div>
                                    <div className={classNames(styles.price, styles.priceDiscount)}>{product.discountPrice}</div>
                                </div>
                                : <div className={styles.prices}>
                                    <div className={styles.price}>{product.price}</div>
                                </div>}
                            <button className={classNames(styles.buttonDefault, styles.orderButton)}>Оформление заказа
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.bottomProductInfo}>
                    <div className={classNames(styles.productDescription, styles.infoContainer)}>
                        <div className={styles.bottomHeader}>описание товара</div>
                        <div className={styles.description}>{product.description}
                        </div>
                    </div>
                    <div className={classNames(styles.productParameters, styles.infoContainer)}>
                        <div className={styles.bottomHeader}>характеристика товара</div>
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
                                        <div className={styles.itemPrice}>{item.price} UAH</div>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>
            </div>;
            }
        </section>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductPage));
