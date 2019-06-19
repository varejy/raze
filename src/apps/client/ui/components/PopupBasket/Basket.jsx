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
        path: '/src/apps/client/ui/components/PopupBasket/img/BestKnife.jpg',
        id: 0
    },
    {
        name: 'Emerson Steel',
        category: 'Ножи',
        price: 1500,
        path: '/src/apps/client/ui/components/PopupBasket/img/BestKnife.jpg',
        id: 1
    },
    {
        name: 'Iron Axe',
        category: 'Топоры',
        price: 2000,
        path: '/src/apps/client/ui/components/PopupBasket/img/BestKnife.jpg',
        id: 2
    }
];
const mapStateToProps = ({ popup }) => {
    return {
        basketVisible: popup.basketVisible
    };
};

const mapDispatchToProps = (dispatch) => ({
    closeBasketPopup: (payload) => dispatch(closeBasketPopup(payload))
});

class Basket extends Component {
    state = {
        productsMap: {},
        visible: false
    };

    static propTypes = {
        closeBasketPopup: PropTypes.func.isRequired,
        basketVisible: PropTypes.bool.isRequired
    };

    static defaultProps = {
        basketVisible: false
    };
    stateRewrite = () => {
        const result = PRODUCTS.reduce((acc, id, i) => {
            acc[i] = 1;
            return acc;
        }, {});
        this.setState({ productsMap: result });
    };

    componentDidMount () {
        this.stateRewrite();
    }

    handleCloseBasket = () => {
        this.props.closeBasketPopup();
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.basketVisible !== nextProps.basketVisible) {
            if (nextProps.basketVisible === true) {
                this.setState({ visible: true });
                document.body.style.overflowY = 'hidden';
            } else {
                this.setState({ visible: false });
                document.body.style.overflowY = 'auto';
            }
        }
    }

    handleCountClick = (id, operation) => () => {
        const { productsMap } = this.state;
        this.setState({ productsMap: {
            ...productsMap,
            [id]: productsMap[id] + (operation === 'plus' ? 1 : (productsMap[id] > 1 ? -1 : 0))
        } });
    };

    totalPrice = () => {
        const { productsMap } = this.state;
        return PRODUCTS.reduce((counter, item, i) => {
            counter = counter + item.price * productsMap[i];
            return counter;
        }, 0);
    };

    render () {
        return <div>
            {this.state.visible && <div className={styles.root}>
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
                                            <img src='/src/apps/client/ui/components/PopupBasket/img/deleteIcon.png' alt=''/>
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
                                        <div className={styles.amountButton} onClick={this.handleCountClick(product.id, 'minus')}>-</div>
                                        <div className={styles.countWrapp}>{this.state.productsMap[i]}</div>
                                        <div className={styles.amountButton} onClick={this.handleCountClick(product.id, 'plus')}>+</div>
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
            </div>}
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Basket);
