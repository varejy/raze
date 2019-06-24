import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import getProductById from '../../../services/client/getProductById';

import { withRouter, matchPath } from 'react-router-dom';

import styles from './ProductPage.css';
import ProductCardCarousel from '../../components/ProductCardCarousel/ProductCardCarousel';
import classNames from 'classnames';
import PreviouslyViewed from '../../components/PreviouslyViewed/PreviouslyViewed';
import setViewed from '../../../actions/setViewed';
import saveProductsViewed from '../../../services/client/saveProductsViewed';
import find from '@tinkoff/utils/array/find';

const PRODUCT_PATH = '/:category/:id';
const LABELS_MAP = {
    lowPrice: {
        color: '#ff0000',
        text: 'низкая цена'
    },
    topSales: {
        color: '#ffb116',
        text: 'топ продаж'
    },
    almostGone: {
        color: '#797979',
        text: 'товар заканчивается'
    }
};
const STAR = {
    full: '/src/apps/client/ui/pages/ProductPage/images/starFull.png',
    half: '/src/apps/client/ui/pages/ProductPage/images/starHalfFull.png',
    empty: '/src/apps/client/ui/pages/ProductPage/images/starEmpty.png'
};
const RATING_STARS = 3.5;
const MAX_VIEWED = 6;

const mapStateToProps = ({ application, savedProducts }) => {
    return {
        productMap: application.productMap,
        viewed: savedProducts.viewed
    };
};

const mapDispatchToProps = (dispatch) => ({
    getProductById: payload => dispatch(getProductById(payload)),
    setViewed: payload => dispatch(setViewed(payload)),
    saveProductsViewed: payload => dispatch(saveProductsViewed(payload))
});

class ProductPage extends Component {
    static propTypes = {
        getProductById: PropTypes.func.isRequired,
        location: PropTypes.object,
        productMap: PropTypes.object,
        viewed: PropTypes.array,
        setViewed: PropTypes.func.isRequired,
        saveProductsViewed: PropTypes.func.isRequired
    };

    static defaultProps = {
        location: {},
        productMap: {},
        viewed: []
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
        } else {
            const newViewed = this.getViewed();

            this.props.saveProductsViewed(newViewed.map((product) => product.id));
        }
    }

    componentWillReceiveProps (nextProps) {
        const { productId } = this.state;

        if (nextProps.productMap !== this.props.productMap) {
            this.setState({ product: nextProps.productMap[productId] }, () => {
                const newViewed = this.getViewed(nextProps);

                this.props.saveProductsViewed(newViewed.map((product) => product.id));
            });
        }
    }

    componentWillUnmount () {
        const newViewed = this.getViewed();

        this.props.setViewed(newViewed);
    };

    getViewed = (props = this.props) => {
        const { product } = this.state;
        const { viewed } = props;
        const item = find(item => product.id === item.id, viewed);

        return item ? [...viewed] : [
            product, ...(viewed.length < MAX_VIEWED ? viewed : viewed.slice(1))
        ];
    };

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
                            { product.discountPrice && <div className={styles.tag} style={{ color: LABELS_MAP.lowPrice.color }}>
                                {LABELS_MAP.lowPrice.text}</div>}
                            { product.tags.map((tag, i) =>
                                tag !== 'notAvailable' && <div key={i} className={styles.tag}
                                    style={{ color: LABELS_MAP[tag].color }}>{LABELS_MAP[tag].text}</div>
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
                                    <div className={styles.pricePrevious}>{product.price} грн.</div>
                                    <div className={classNames(styles.price, styles.priceDiscount)}>{product.discountPrice} грн.</div>
                                </div>
                                : <div className={styles.prices}>
                                    <div className={styles.price}>{product.price} грн.</div>
                                </div>}
                            <button className={classNames(
                                styles.buttonDefault, styles.orderButton, product.notAvailable && styles.orderButtonDisabled
                            )}>
                                    Оформление заказа
                            </button>
                        </div>
                        {product.notAvailable &&
                        <div className={styles.notAvailableContent}>
                            <div className={styles.notAvailableMessage}>
                                Товара нет в наличии, но Вы
                                можете оставить е-мейл и мы свяжемся с Вами,
                                как только он появится
                            </div>
                            <div>
                                <input className={styles.notAvailableInput} placeholder='Введите е-мейл'/>
                            </div>
                        </div>
                        }
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
                    {this.props.viewed.length > 0 && <PreviouslyViewed/>}
                </div>
            </div>;
            }
        </section>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductPage));
