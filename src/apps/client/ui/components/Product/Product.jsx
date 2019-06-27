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

const mapStateToProps = ({ savedProducts }) => {
    return {
        basket: savedProducts.basket,
        liked: savedProducts.liked
    };
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

    addToLiked = () => {
        let newLiked;

        if (!this.state.isLiked) {
            newLiked = !this.isInBasket() ? [
                this.props.product, ...this.props.liked
            ] : [...this.props.liked];
            this.setState({ isLiked: true });
        } else {
            const index = this.props.liked.indexOf(this.isInBasket());
            newLiked = [
                ...remove(index, 1, this.props.liked)
            ];
            this.setState({ isLiked: false });
        }
        this.props.setLiked(newLiked);
        this.props.saveProductsLiked(newLiked.map((product) => product.id));
    };

    handlePreviewClick = () => {
        this.props.openPopup(<ProductPreview product={this.props.product}/>);
    };

    handleOpenBasket = () => {
        this.props.openPopup(<PopupBasket product={this.props.product}/>);
    };

    isInBasket = () => {
        const { basket, product } = this.props;
        const isInBasket = find(item => product.id === item.product.id, basket);

        return !!isInBasket;
    };

    isLiked = () => {
        const { liked, product } = this.props;
        return find(item => product.id === item.id, liked);
    };

    render () {
        const { product, category } = this.props;

        return <div className={styles.product}>
            <Link className={styles.link} key={product.id} to={`/${category.path}/${product.id}`}>
                <div className={styles.imageWrapper}>
                    {(!!product.discountPrice && !product.notAvailable) && <div className={styles.discount}>special<br />price</div>}
                    <img className={styles.img} src={product.avatar} alt={product.avatar} />
                </div>
            </Link>
            <div className={styles.infoWrapper}>
                <div className={styles.info}>
                    <div className={styles.manufacturer}>{product.company}</div>
                    <div className={styles.name}>{product.name}</div>
                    <div className={styles.prices}>
                        {product.discountPrice
                            ? <div className={styles.prices}>
                                <div className={styles.previousPrice}>{product.price} грн.</div>
                                <div className={classNames(styles.price, styles.priceDiscount)}>{product.discountPrice} грн.</div>
                            </div>
                            : <div className={styles.prices}>
                                <div className={styles.price}>{product.price} грн.</div>
                            </div>}
                    </div>
                </div>
                {!product.notAvailable && <div className={styles.toolBar}>
                    <div className={classNames(styles.quickInspection, styles.toolBarItem)} onClick={this.handlePreviewClick}>
                        <div className={classNames(styles.toolBarIcon, styles.eyeIcon)}/>
                        <div>Быстрый просмотр</div>
                    </div>
                    <div className={classNames(styles.heart, styles.toolBarItem)} onClick={this.addToLiked}>
                        <div className={classNames(styles.toolBarIcon, !this.isLiked() ? styles.heartIcon : styles.isLikedHeart)}/>
                        {!this.isLiked() ? <div>Избранное</div> : <div className={styles.isLiked}>Уже в избранном</div>}
                    </div>
                    <div className={classNames(styles.basket, styles.toolBarItem)} onClick={this.handleOpenBasket}>
                        <div className={classNames(styles.toolBarIcon, !this.isInBasket() ? styles.basketIcon : styles.isInBasketIcon)}/>
                        {!this.isInBasket() ? <div>В корзину</div> : <div className={styles.isInBasket}>Уже в корзине</div>}
                    </div>
                </div>}
            </div>
            {product.notAvailable && <div className={styles.notAvailableHover}>
                <div className={styles.notAvailable}>
                    Нет в наличии
                </div>
            </div>}
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
