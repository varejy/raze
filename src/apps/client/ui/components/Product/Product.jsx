import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Product.css';

import openPopup from '../../../actions/openPopup';

import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import ProductPreview from '../ProductPreview/ProductPreview';
import PopupBasket from '../PopupBasketAdding/PopupBasket';
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
    openPopup: payload => dispatch(openPopup(payload))
});

class Product extends Component {
    static propTypes = {
        product: PropTypes.object,
        openPopup: PropTypes.func.isRequired,
        category: PropTypes.object
    };

    static defaultProps = {
        product: {},
        category: {}
    };

    handlePreviewClick = () => {
        this.props.openPopup(<ProductPreview product={this.props.product}/>);
    };

    handleOpenBasket = () => {
        this.props.openPopup(<PopupBasket product={this.props.product}/>);
    };

    discountMoveLeft = () => {
        const { product } = this.props;
        let discountLeft;

        switch (true) {
        case product.price > 9999:
            discountLeft = 76;
            break;
        case product.price > 999:
            discountLeft = 69;
            break;
        case product.price > 99:
            discountLeft = 62;
            break;
        default:
            discountLeft = 55;
        }

        return discountLeft;
    };

    render () {
        const { product, category } = this.props;

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
                                <div className={styles.previousPrice}
                                    style={{ left: -this.discountMoveLeft() }}>
                                    {product.price} грн.</div>
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
                    <div className={classNames(styles.heart, styles.toolBarItem)}>
                        <div className={classNames(styles.toolBarIcon, styles.heartIcon)}/>
                        <div>Избранное</div>
                    </div>
                    <div className={classNames(styles.basket, styles.toolBarItem)} onClick={this.handleOpenBasket}>
                        <div className={classNames(styles.toolBarIcon, styles.basketIcon)}/>
                        <div>В корзину</div>
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

export default connect(null, mapDispatchToProps)(Product);
