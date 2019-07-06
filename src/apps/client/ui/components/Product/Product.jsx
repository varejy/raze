import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Product.css';

import openPopup from '../../../actions/openPopup';
import setLiked from '../../../actions/setLiked';

import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import ProductPreview from '../ProductPreview/ProductPreview';
import PopupBasket from '../PopupBasketAdding/PopupBasket';
import find from '@tinkoff/utils/array/find';
import remove from '@tinkoff/utils/array/remove';
import saveProductsLiked from '../../../services/client/saveProductsLiked';
import findIndex from '@tinkoff/utils/array/findIndex';

const mapStateToProps = ({ savedProducts }) => {
    return {
        basket: savedProducts.basket,
        liked: savedProducts.liked
    };
};
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
const mapDispatchToProps = (dispatch) => ({
    openPopup: payload => dispatch(openPopup(payload)),
    setLiked: payload => dispatch(setLiked(payload)),
    saveProductsLiked: payload => dispatch(saveProductsLiked(payload))
});

class Product extends Component {
    state = {
        isLiked: false
    };
    static propTypes = {
        product: PropTypes.object,
        category: PropTypes.object,
        openPopup: PropTypes.func.isRequired,
        basket: PropTypes.array.isRequired,
        liked: PropTypes.array.isRequired,
        setLiked: PropTypes.func.isRequired,
        saveProductsLiked: PropTypes.func.isRequired
    };

    static defaultProps = {
        product: {},
        category: {},
        basket: [],
        liked: []
    };

    handleLikeClick = () => {
        const { setLiked, product, liked, saveProductsLiked } = this.props;
        const { isLiked } = this.state;
        let newLiked;

        if (!isLiked) {
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

    handlePreviewClick = () => {
        const { openPopup, product } = this.props;
        openPopup(<ProductPreview product={product}/>);
    };

    handleOpenBasket = () => {
        const { openPopup, product } = this.props;
        openPopup(<PopupBasket product={product}/>);
    };

    isInBasket = () => {
        const { basket, product } = this.props;
        return !!find(basketProduct => product.id === basketProduct.product.id, basket);
    };

    isLiked = () => {
        const { liked, product } = this.props;
        return !!find(likedProduct => product.id === likedProduct.id, liked);
    };

    render () {
        const { product, category } = this.props;
        const inBasket = this.isInBasket();
        const isLiked = this.isLiked();

        return <div className={styles.product}>
            {!product.notAvailable && <div className={styles.labels}>
                <div className={styles.tags}>
                    {product.discountPrice && <div className={styles.tag} style={{ color: LABELS_MAP.lowPrice.color }}>
                        {LABELS_MAP.lowPrice.text}</div>}
                    {product.tags.map((tag, i) =>
                        tag !== 'notAvailable' && <div key={i} className={styles.tag}
                            style={{ color: LABELS_MAP[tag].color }}>{LABELS_MAP[tag].text}</div>
                    )}
                </div>
            </div>}
            <Link className={styles.link} key={product.id} to={`/${category.path}/${product.id}`}>
                <div className={styles.imageWrapper}>
                    <img className={styles.img} src={product.avatar} alt={product.avatar}/>
                </div>
            </Link>
            <div className={!product.notAvailable ? styles.infoWrapper : styles.infoWrapperDisabled}>
                <div className={styles.info}>
                    <div className={styles.manufacturer}>{product.company}</div>
                    <div className={styles.name}>{product.name}</div>
                    <div className={styles.prices}>
                        {product.discountPrice
                            ? <div className={styles.prices}>
                                <div className={styles.previousPrice}>{product.price} грн.</div>
                                <div
                                    className={classNames(styles.price, styles.priceDiscount)}>{product.discountPrice} грн.
                                </div>
                            </div>
                            : <div className={styles.prices}>
                                <div className={styles.price}>{product.price} грн.</div>
                            </div>}
                    </div>
                </div>
                {!product.notAvailable && <div className={styles.toolBar}>
                    <div className={classNames(styles.quickInspection, styles.toolBarItem)}
                        onClick={this.handlePreviewClick}>
                        <div className={classNames(styles.toolBarIcon, styles.eyeIcon)}/>
                        <div>Быстрый просмотр</div>
                    </div>
                    <div className={classNames(styles.heart, styles.toolBarItem)} onClick={this.handleLikeClick}>
                        <div className={classNames(styles.toolBarIcon, !isLiked ? styles.heartIcon : styles.isLikedHeart)}/>
                        {!isLiked ? <div>Избранное</div> : <div className={styles.isLiked}>Уже в избранном</div>}
                    </div>
                    <div className={classNames(styles.basket, styles.toolBarItem)} onClick={this.handleOpenBasket}>
                        <div className={classNames(styles.toolBarIcon, !inBasket ? styles.basketIcon : styles.isInBasketIcon)}/>
                        {!inBasket ? <div>В корзину</div> : <div className={styles.isInBasket}>Уже в корзине</div>}
                    </div>
                </div>}
            </div>
            {product.notAvailable &&
            <Link className={styles.link} key={product.id} to={`/${category.path}/${product.id}`}>
                <div className={styles.notAvailableHover}>
                    <div className={styles.notAvailable}>
                        Нет в наличии
                    </div>
                </div>
            </Link>}
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
