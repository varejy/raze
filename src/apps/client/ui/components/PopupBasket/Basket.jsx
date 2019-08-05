import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import closeBasketPopup from '../../../actions/closeBasketPopup';
import { connect } from 'react-redux';
import setBasket from '../../../actions/setBasket';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';
import remove from '@tinkoff/utils/array/remove';
import Scroll from '../Scroll/Scroll';

import styles from './Basket.css';

import { Link } from 'react-router-dom';
import find from '@tinkoff/utils/array/find';

const mapStateToProps = ({ popup, savedProducts, application }) => {
    return {
        basketVisible: popup.basketVisible,
        basket: savedProducts.basket,
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    closeBasketPopup: (payload) => dispatch(closeBasketPopup(payload)),
    setBasket: payload => dispatch(setBasket(payload)),
    saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload))
});

class Basket extends Component {
    static propTypes = {
        closeBasketPopup: PropTypes.func.isRequired,
        basketVisible: PropTypes.bool.isRequired,
        basket: PropTypes.array.isRequired,
        setBasket: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired,
        categories: PropTypes.array
    };

    static defaultProps = {
        basketVisible: false,
        basket: [],
        categories: []
    };

    state = {
        productsMap: {}
    };

    setProductsMap = () => {
        const { basket } = this.props;
        const productsMap = basket.reduce((acc, productInfo, i) => {
            acc[i] = productInfo.count;
            return acc;
        }, {});

        this.setState({ productsMap });
    };

    setNewBasket = () => {
        const newBasket = this.props.basket.map((productInfo, i) => {
            return { product: productInfo.product, count: this.state.productsMap[i] };
        }, {});

        this.props.setBasket(newBasket);
        this.props.saveProductsToBasket(newBasket.map((productInfo) => ({ id: productInfo.product.id, count: productInfo.count })));
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
        this.props.saveProductsToBasket(newBasket.map((productInfo) => ({ id: productInfo.product.id, count: productInfo.count })));
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

        return basket.reduce((acc, productInfo, i) => {
            return acc + (productInfo.product.discountPrice || productInfo.product.price) * productsMap[i];
        }, 0);
    };

    componentDidMount () {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.basketVisible !== nextProps.basketVisible) {
            document.body.style.overflowY = nextProps.basketVisible ? 'hidden' : 'auto';
            this.setProductsMap();
        }
    }

    componentWillUnmount () {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.props.closeBasketPopup();
        }
    };

    getCategoryPath = categoryId => {
        const { categories } = this.props;

        return find(category => category.id === categoryId, categories).path;
    };

    render () {
        const { basket, basketVisible } = this.props;
        const { productsMap } = this.state;

        return <div className={classNames(styles.root, {
            [styles.rootVisible]: basketVisible
        })}>
            <div className={classNames(styles.backing, {
                [styles.backingVisible]: basketVisible
            })}/>
            <div className={classNames(styles.popupContent, {
                [styles.popupContentVisible]: basketVisible
            })}>
                <div>
                    <div className={styles.headerContainer}>
                        <div className={styles.header}>корзина</div>
                        <div className={styles.closeButton} onClick={this.handleCloseBasket}>+</div>
                    </div>
                    <div className={styles.amountTxt}>
                        <div>Количество</div>
                    </div>
                    <div className={styles.items}>
                        <Scroll theme='light'>
                            {basket.map((item, i) => productsMap[i] !== 0 &&
                                <div className={styles.item} key={i}>
                                    <div className={styles.deleteItem} onClick={this.deleteItem(i)}>
                                        <img src='/src/apps/client/ui/components/PopupBasket/img/deleteIcon.png'
                                            alt='delete' />
                                    </div>
                                    <Link className={styles.productLink} key={item.product.id}
                                        to={`/${this.getCategoryPath(item.product.categoryId)}/${item.product.id}`}>
                                        <div className={styles.itemImageWrapp}>
                                            <div className={styles.itemImage}>
                                                <img
                                                    className={styles.itemAvatar}
                                                    src={item.product.avatar}
                                                    alt='product'
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h2 className={styles.itemName}>{item.product.name}</h2>
                                            <div className={styles.itemCategory}>{item.product.company}</div>
                                            {
                                                item.product.discountPrice
                                                    ? <div className={styles.prices}>
                                                        <h3 className={styles.previousPrice}>{item.product.price} грн</h3>
                                                        <h2
                                                            className={classNames(styles.itemPrice, styles.priceDiscount)}>{item.product.discountPrice} грн
                                                        </h2>
                                                    </div>
                                                    : <h2 className={styles.itemPrice}>{item.product.price} грн</h2>
                                            }
                                        </div>
                                    </Link>
                                    <div className={styles.itemAmount}>
                                        <div className={styles.amountButton}
                                            onClick={this.handleCountClick(i, 'minus')}>-
                                        </div>
                                        <div className={styles.countWrapp}>{productsMap[i]}</div>
                                        <div className={styles.amountButton}
                                            onClick={this.handleCountClick(i, 'plus')}>+
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Scroll>
                    </div>
                    <div className={styles.priceBlock}>
                        <div className={styles.line} />
                        <div className={styles.priceTotal}>Итог: {this.totalPrice()} грн</div>
                    </div>
                    {
                        basket.length
                            ? <div className={styles.buttonsWrapp}>
                                <button
                                    className={classNames(styles.buttonDefault, styles.continueShopping, styles.buttons)}
                                    onClick={this.handleCloseBasket}>
                                    продолжить покупки
                                </button>
                                <Link className={styles.link} to='/order'>
                                    <button
                                        className={classNames(styles.buttonDefault, styles.ordering, styles.buttons)}
                                        onClick={this.handleCloseBasket}>оформление
                                    заказа
                                    </button>
                                </Link>
                            </div>
                            : <div className={styles.txt}>К сожалению, Вы не добавили в избранное товары.
                        Исправить ситуацию Вы можете выбрав товар в каталоге.</div>
                    }
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Basket);
