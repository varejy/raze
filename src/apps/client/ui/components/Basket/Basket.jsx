import React, { Component } from 'react';

import classNames from 'classnames';

import styles from './Basket.css';
import closeBasketPopup from '../../../actions/closeBasketPopup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PRODUCTS = [
    {
        name: 'Knife Alfa',
        category: 'Ножи',
        price: 1000,
        path: '/src/apps/client/ui/components/Basket/img/BestKnife.jpg'
    },
    {
        name: 'Emerson Steel',
        category: 'Ножи',
        price: 1500,
        path: '/src/apps/client/ui/components/Basket/img/BestKnife.jpg'
    },
    {
        name: 'Iron Axe',
        category: 'Топоры',
        price: 2000,
        path: '/src/apps/client/ui/components/Basket/img/BestKnife.jpg'
    }
];

const mapDispatchToProps = (dispatch) => ({
    closeBasketPopup: (payload) => dispatch(closeBasketPopup(payload))
});

class Basket extends Component {
    state = {
        productsMap: [1, 1, 1]
    };

    static propTypes = {
        closeBasketPopup: PropTypes.func.isRequired
    };

    static defaultProps = {
        basketVisible: true
    };

    handleCloseBasket = () => {
        document.body.style.overflowY = 'auto';
        this.props.closeBasketPopup(false);
    };

    handleMinusClick = (i) => () => {
        if (this.state.productsMap[i] > 0) {
            this.setState({ productsMap: this.state.productsMap.map(function (value, index) {
                if (index === i) {
                    return value - 1;
                } else {
                    return value;
                }
            }) });
        }
    };

    handlePlusClick = (i) => () => {
        if (this.state.productsMap[i] < 100) {
            this.setState({ productsMap: this.state.productsMap.map(function (value, index) {
                if (index === i) {
                    return value + 1;
                } else {
                    return value;
                }
            }) });
        }
    };

    totalPrice = () => {
        let priceCounter = 0;
        for (let i = 0; i < PRODUCTS.length; i++) {
            priceCounter = priceCounter + PRODUCTS[i].price * this.state.productsMap[i];
        }
        return priceCounter;
    };

    render () {
        return <div className={styles.root}>
            <div className={styles.popupContent}>
                <div>
                    <div className={styles.headerContainer}>
                        <div className={styles.header}>корзина</div>
                        <div className={styles.closeButton} onClick={this.handleCloseBasket}>+</div>
                    </div>
                    <div className={styles.amountTxt}>
                        <div>Количество</div>
                    </div>
                    <div className={styles.items}>
                        {PRODUCTS.map((product, i) => this.state.productsMap[i] !== 0 &&
                            <div className={styles.item} key={i}>
                                <div className={styles.itemImageWrapp}>
                                    <div className={styles.deleteItem}>
                                        <img src='/src/apps/client/ui/components/Basket/img/deleteIcon.png' alt=''/>
                                    </div>
                                    <div className={styles.itemImage}>
                                        <img className={styles.itemAvatar}
                                            src={product.path}
                                            alt="product"/>
                                    </div>
                                </div>
                                <div className={styles.itemInfo}>
                                    <h2 className={styles.itemName}>{product.name}</h2>
                                    <div className={styles.itemCategory}>{product.category}</div>
                                    <h2 className={styles.itemPrice}>{product.price} UAH</h2>
                                </div>
                                <div className={styles.itemAmount}>
                                    <div className={styles.amountButton} onClick={this.handleMinusClick(i)}>-</div>
                                    <div className={styles.countWrapp}>{this.state.productsMap[i]}</div>
                                    <div className={styles.amountButton} onClick={this.handlePlusClick(i)}>+</div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.priceTotal}>Итог: {this.totalPrice()} грн</div>
                </div>
                <div className={styles.buttonsWrapp}>
                    <button
                        className={classNames(styles.buttonDefault, styles.continueShopping, styles.buttons)}>продолжить
                        покупки
                    </button>
                    <button className={classNames(styles.buttonDefault, styles.ordering, styles.buttons)}>оформление
                        заказа
                    </button>
                </div>
            </div>
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(Basket);
