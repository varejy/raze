import React, { Component } from 'react';

import classNames from 'classnames';

import styles from './Basket.css';
import closeBasketPopup from '../../../actions/closeBasketPopup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import setBasket from '../../../actions/setBasket';

const mapStateToProps = ({ popup, savedProducts }) => {
    return {
        basketVisible: popup.basketVisible,
        basket: savedProducts.basket
    };
};

const mapDispatchToProps = (dispatch) => ({
    closeBasketPopup: (payload) => dispatch(closeBasketPopup(payload)),
    setBasket: payload => dispatch(setBasket(payload))
});

class Basket extends Component {
    state = {
        productsMap: {}
    };

    static propTypes = {
        closeBasketPopup: PropTypes.func.isRequired,
        basketVisible: PropTypes.bool.isRequired,
        basket: PropTypes.array.isRequired
    };

    static defaultProps = {
        basketVisible: false,
        basket: []
    };

    setProductsMap = () => {
        const productsMap = this.props.basket.reduce((acc, id, i) => {
            acc[i] = this.props.basket.amount;
            return acc;
        }, {});
        this.setState({ productsMap });
    };

    componentDidMount () {
        this.setProductsMap();
    }

    handleCloseBasket = () => {
        this.props.closeBasketPopup();
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.basketVisible !== nextProps.basketVisible) {
            document.body.style.overflowY = nextProps.basketVisible ? 'hidden' : 'auto';
        }
    }

    componentWillUnmount () {
    }

    deleteItem = (id) => () => {
        const { productsMap } = this.state;

        this.setState({
            productsMap: {
                ...productsMap,
                [id]: 0
            }
        });
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
        return this.props.basket.reduce((counter, item) => {
            return counter + item.product.price * item.amount;
        }, 0);
    };

    render () {
        return <div>
            {this.props.basketVisible && <div className={styles.root}>
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
                            {this.props.basket.map((item, i) => this.state.productsMap[i] !== 0 &&
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
                                        <div className={styles.amountButton} onClick={this.handleCountClick(item.product.id, 'minus')}>-</div>
                                        <div className={styles.countWrapp}>{item.amount}</div>
                                        <div className={styles.amountButton} onClick={this.handleCountClick(item.product.id, 'plus')}>+</div>
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
