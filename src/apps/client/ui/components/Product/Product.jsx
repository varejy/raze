import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Product.css';
import openPopup from '../../../actions/openPopup';
import { connect } from 'react-redux';
import ProductPreview from '../ProductPreview/ProductPreview';
import PopupBasket from '../PopupBasketAdding/PopupBasket';
import find from '@tinkoff/utils/array/find';

const mapStateToProps = ({ savedProducts }) => {
    return {
        basket: savedProducts.basket
    };
};
const mapDispatchToProps = (dispatch) => ({
    openPopup: payload => dispatch(openPopup(payload))
});

class Product extends Component {
    static propTypes = {
        product: PropTypes.object,
        openPopup: PropTypes.func.isRequired,
        basket: PropTypes.array.isRequired
    };

    static defaultProps = {
        product: {},
        basket: []
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

    render () {
        const { product } = this.props;

        return <div className={styles.product}>
            <div className={styles.imageWrapper}>
                { (!!product.discountPrice && !product.notAvailable) && <div className={styles.discount}>special<br/>price</div>}
                <img className={styles.img} src={product.avatar} alt={product.avatar}/>
            </div>
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
                    <div className={classNames(styles.heart, styles.toolBarItem)}>
                        <div className={classNames(styles.toolBarIcon, styles.heartIcon)}/>
                        <div>Избранное</div>
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
