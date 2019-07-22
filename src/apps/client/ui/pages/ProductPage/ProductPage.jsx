import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { connect } from 'react-redux';

import getProductById from '../../../services/client/getProductById';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';
import saveProductsViewed from '../../../services/client/saveProductsViewed';
import setLiked from '../../../actions/setLiked';

import getStarsArray from '../../../utils/getStarsArray';

import { Link, withRouter, matchPath } from 'react-router-dom';

import styles from './ProductPage.css';

import ProductCardCarousel from '../../components/ProductCardCarousel/ProductCardCarousel';
import FeedBackForm from '../../components/FeedBackForm/FeedBackForm';
import Comments from '../../components/Comments/Comments';
import PreviouslyViewed from '../../components/PreviouslyViewed/PreviouslyViewed';

import setViewed from '../../../actions/setViewed';
import setBasket from '../../../actions/setBasket';
import closePopup from '../../../actions/closePopup';

import filter from '@tinkoff/utils/array/filter';
import tail from '@tinkoff/utils/array/tail';
import concat from '@tinkoff/utils/array/concat';
import compose from '@tinkoff/utils/function/compose';
import saveProductsLiked from '../../../services/client/saveProductsLiked';
import findIndex from '@tinkoff/utils/array/findIndex';
import remove from '@tinkoff/utils/array/remove';
import find from '@tinkoff/utils/array/find';

const PRODUCT_PATH = '/:category/:id';
const LABELS_MAP = {
    lowPrice: {
        color: '#ff0000',
        text: 'скидочная цена'
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

const MAX_VIEWED = 7;

const mapStateToProps = ({ application, savedProducts }) => {
    return {
        productMap: application.productMap,
        basket: savedProducts.basket,
        viewed: savedProducts.viewed,
        liked: savedProducts.liked
    };
};

const mapDispatchToProps = (dispatch) => ({
    getProductById: payload => dispatch(getProductById(payload)),
    setViewed: payload => dispatch(setViewed(payload)),
    saveProductsViewed: payload => dispatch(saveProductsViewed(payload)),
    setBasket: payload => dispatch(setBasket(payload)),
    closePopup: payload => dispatch(closePopup(payload)),
    saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload)),
    setLiked: payload => dispatch(setLiked(payload)),
    saveProductsLiked: payload => dispatch(saveProductsLiked(payload))
});

class ProductPage extends Component {
    static propTypes = {
        getProductById: PropTypes.func.isRequired,
        location: PropTypes.object,
        productMap: PropTypes.object,
        viewed: PropTypes.array,
        setViewed: PropTypes.func.isRequired,
        basket: PropTypes.array.isRequired,
        setBasket: PropTypes.func.isRequired,
        closePopup: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired,
        saveProductsViewed: PropTypes.func.isRequired,
        liked: PropTypes.array.isRequired,
        setLiked: PropTypes.func.isRequired,
        saveProductsLiked: PropTypes.func.isRequired
    };

    static defaultProps = {
        location: {},
        productMap: {},
        viewed: [],
        media: {},
        liked: []
    };

    constructor (...args) {
        super(...args);

        this.state = this.getNewState();
    }

    componentDidMount () {
        this.getProduct();
    }

    componentWillReceiveProps (nextProps) {
        const { location: { pathname } } = this.props;
        const { productId } = this.state;

        if (nextProps.productMap !== this.props.productMap) {
            this.setState({ product: nextProps.productMap[productId] }, () => {
                const newViewed = this.getViewed(nextProps);

                this.props.setViewed(newViewed);
                this.props.saveProductsViewed(newViewed.map((product) => product.id));
            });
        }

        if (nextProps.location.pathname !== pathname) {
            this.setState(this.getNewState(nextProps), this.getProduct);
        }
    }

    getProduct = () => {
        if (this.notFoundPage) {
            return;
        }

        const { loading, productId } = this.state;

        if (loading) {
            this.props.getProductById(productId)
                .then(() => this.setState({ loading: false }));
        } else {
            const newViewed = this.getViewed();

            this.props.setViewed(newViewed);
            this.props.saveProductsViewed(newViewed.map((product) => product.id));
        }
    };

    getNewState = (props = this.props) => {
        const { location: { pathname }, productMap } = props;
        const match = matchPath(pathname, { path: PRODUCT_PATH, exact: true });
        const product = productMap[match.params.id];

        this.notFoundPage = product === null;

        return {
            loading: !this.notFoundPage && !product,
            product: product,
            productId: match.params.id
        };
    };

    getViewed = (props = this.props) => {
        const { product } = this.state;
        const { viewed } = props;

        const newViewed = compose(
            concat([product]),
            filter(item => product.id !== item.id)
        )(viewed);

        return newViewed.length > MAX_VIEWED ? tail(newViewed) : newViewed;
    };

    handleLikeClick = () => {
        const { setLiked, liked, saveProductsLiked } = this.props;
        const { product } = this.state;
        let newLiked;

        if (!this.isLiked()) {
            newLiked = !this.isLiked() ? [
                product,
                ...liked
            ] : [...liked];
            this.setState({ isLiked: true });
        } else {
            const index = findIndex(likedItem => likedItem.id === product.id, liked);
            newLiked = [
                ...remove(index, 1, liked)
            ];
            this.setState({ isLiked: false });
        }
        setLiked(newLiked);
        saveProductsLiked(newLiked.map((product) => product.id));
    };

    isLiked = () => {
        const { liked } = this.props;
        const { product } = this.state;
        return !!find(likedProduct => product.id === likedProduct.id, liked);
    };

    render () {
        const { viewed } = this.props;
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

        const isLiked = this.isLiked();

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
                        </div>
                        <div className={styles.stars}>
                            {getStarsArray(product.rating).map((star, i) => <div key={i} className={styles.star}>
                                <img src={star} alt='star'/>
                            </div>)}
                        </div>
                        <div className={styles.description}>{product.description}</div>
                        <div className={styles.order}>
                            {product.discountPrice
                                ? <div className={styles.prices}>
                                    <div className={styles.pricePrevious}>{product.price} грн.</div>
                                    <div className={classNames(styles.price, styles.priceDiscount)}>{product.discountPrice} грн.</div>
                                </div>
                                : <div className={styles.prices}>
                                    <div className={styles.price}>{product.price} грн.</div>
                                </div>}
                            <div className={styles.buttonContainer}>
                                <Link className={styles.link} to={`/order?id=${product.id}`}>
                                    <button className={classNames(
                                        styles.buttonDefault, styles.orderButton, product.notAvailable && styles.orderButtonDisabled
                                    )}>
                                    Оформление заказа
                                    </button>
                                </Link>
                                <div onClick={this.handleLikeClick}>
                                    <img
                                        className={styles.heartIcon}
                                        src={!isLiked
                                            ? '/src/apps/client/ui/pages/ProductPage/images/likeHeart.png'
                                            : '/src/apps/client/ui/pages/ProductPage/images/heartGreen.png'}
                                        alt='like'/>
                                </div>
                                <div onClick={this.handleLikeClick}>
                                    <img
                                        className={styles.basketIcon}
                                        src={!isLiked
                                            ? '/src/apps/client/ui/pages/ProductPage/images/basket.png'
                                            : '/src/apps/client/ui/pages/ProductPage/images/basketGreen.png'}
                                        alt='basket'/>
                                </div>
                            </div>
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
                    <div className={classNames(styles.infoContainer, styles.productDescription)}>
                        <div className={styles.bottomHeader}>описание товара</div>
                        <div className={styles.descriptionText}>{product.description}</div>
                    </div>
                    {product.features.length > 0 && <div className={classNames(styles.productParameters, styles.infoContainer)}>
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
                    </div>}
                    <div className={classNames(styles.productFeedbacks, styles.infoContainer)}>
                        <div className={styles.bottomHeader}>отзывы</div>
                        <div className={styles.feedbacks}>
                            <Comments productComments={product.comments}/>
                        </div>
                    </div>
                    <div className={classNames(styles.feedbackForm, styles.infoContainer)}>
                        <div className={styles.bottomHeader}>добавьте комментарий</div>
                        <div className={styles.creatingFeedback}>
                            <FeedBackForm productId={product.id}/>
                        </div>
                    </div>
                    {!!viewed.length && <PreviouslyViewed viewed={tail(viewed)} />}
                </div>
            </div>
        </section>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductPage));
