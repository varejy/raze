import React, { Component } from 'react';

import classNames from 'classnames';

import styles from './Basket.css';
import closeBasketPopup from '../../../actions/closeBasketPopup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import setBasket from '../../../actions/setBasket';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';
import remove from '@tinkoff/utils/array/remove';

const mapStateToProps = ({ popup, savedProducts }) => {
    return {
        basketVisible: popup.basketVisible,
        basket: savedProducts.basket
    };
};

const mapDispatchToProps = (dispatch) => ({
    closeBasketPopup: (payload) => dispatch(closeBasketPopup(payload)),
    setBasket: payload => dispatch(setBasket(payload)),
    saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload))
});

class Basket extends Component {
    state = {
        productsMap: {}
    };

    static propTypes = {
        closeBasketPopup: PropTypes.func.isRequired,
        basketVisible: PropTypes.bool.isRequired,
        basket: PropTypes.array.isRequired,
        setBasket: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired
    };

    static defaultProps = {
        basketVisible: false,
        basket: []
    };

    setProductsMap = () => {
        const { basket } = this.props;
        const productsMap = basket.reduce((acc, product, i) => {
            acc[i] = product.amount;
            return acc;
        }, {});

        this.setState({ productsMap });
    };

    setNewBasket = () => {
        const newBasket = this.props.basket.map((product, i) => {
            return { product: product.product, amount: this.state.productsMap[i] };
        }, {});

        this.props.setBasket(newBasket);
        this.props.saveProductsToBasket(newBasket.map((product) => ({ id: product.product.id, count: product.amount })));
    };

    handleCloseBasket = () => {
        this.setNewBasket();
        this.props.closeBasketPopup();
    };

    deleteItem = (index) => () => {
        const newBasket = [
            ...remove(index, 1, this.props.basket)
        ];

        this.props.setBasket(newBasket);
        this.props.saveProductsToBasket(newBasket.map((product) => ({ id: product.product.id, count: product.amount })));
    };

    handleCountClick = (id, operation) => () => {
        const { productsMap } = this.state;
        const minusValue = productsMap[id] > 1 ? -1 : 0;

        this.setState({
            productsMap: {
                ...productsMap,
                [id]: productsMap[id] + (operation === 'plus' ? 1 : minusValue)
            }
        });
    };

    totalPrice = () => {
        const { basket } = this.props;
        const { productsMap } = this.state;

        return basket.reduce((acc, product, i) => {
            return acc + product.product.price * productsMap[i];
        }, 0);
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.basketVisible !== nextProps.basketVisible) {
            document.body.style.overflowY = nextProps.basketVisible ? 'hidden' : 'auto';
            this.setProductsMap();
        }
    }

    render () {
        const { basket, basketVisible } = this.props;
        const { productsMap } = this.state;

        return <div>
            {basketVisible && <div className={styles.root}>
                <div className={classNames(styles.popupContent, basketVisible && styles.popupContentAnimated)}>
                    <div>
                        <div className={styles.headerContainer}>
                            <div className={styles.header}>корзина</div>
                            <div className={styles.closeButton} onClick={this.handleCloseBasket}>+</div>
                        </div>
                        <div className={styles.amountTxt}>
                            <div>Количество</div>
                        </div>
                        <div className={styles.items}>
                            {basket.map((item, i) => productsMap[i] !== 0 &&
                                <div className={styles.item} key={i}>
                                    <div className={styles.itemImageWrapp}>
                                        <div className={styles.deleteItem} onClick={this.deleteItem(i)}>
                                            <img src='/src/apps/client/ui/components/PopupBasket/img/deleteIcon.png' alt='delete'/>
                                        </div>
                                        <div className={styles.itemImage}>
                                            <img className={styles.itemAvatar}
                                                src={item.product.avatar}
                                                alt='product'/>
                                        </div>
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h2 className={styles.itemName}>{item.product.name}</h2>
                                        <div className={styles.itemCategory}>{item.product.company}</div>
                                        <h2 className={styles.itemPrice}>{item.product.price} UAH</h2>
                                    </div>
                                    <div className={styles.itemAmount}>
                                        <div className={styles.amountButton} onClick={this.handleCountClick(i, 'minus')}>-</div>
                                        <div className={styles.countWrapp}>{productsMap[i]}</div>
                                        <div className={styles.amountButton} onClick={this.handleCountClick(i, 'plus')}>+</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.priceTotal}>Итог: {this.totalPrice()} грн</div>
                    </div>
                    <div className={styles.buttonsWrapp}>
                        <button
                            className={classNames(styles.buttonDefault, styles.continueShopping, styles.buttons)}
                            onClick={this.handleCloseBasket}>
                                продолжить покупки
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
