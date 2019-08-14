import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import styles from './PopupBasket.css';
import setBasket from '../../../actions/setBasket';
import closePopup from '../../../actions/closePopup';
import find from '@tinkoff/utils/array/find';
import remove from '@tinkoff/utils/array/remove';
import formatMoney from '../../../utils/formatMoney';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';
import CrossButton from '../CrossButton/CrossButton';

const mapStateToProps = ({ savedProducts }) => {
    return {
        basket: savedProducts.basket
    };
};

const mapDispatchToProps = (dispatch) => ({
    setBasket: payload => dispatch(setBasket(payload)),
    closePopup: payload => dispatch(closePopup(payload)),
    saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload))
});

class PopupBasket extends Component {
    state = {
        productCount: 1,
        productsMap: {}
    };

    static propTypes = {
        product: PropTypes.object,
        basket: PropTypes.array.isRequired,
        setBasket: PropTypes.func.isRequired,
        closePopup: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired
    };

    static defaultProps = {
        product: {},
        basket: []
    };

    setProductsMap = () => {
        const { basket } = this.props;
        const productsMap = basket.reduce((acc, product, i) => {
            acc[i] = product.count;
            return acc;
        }, {});

        this.setState({ productsMap });
    };

    handleCountClick = operation => () => {
        const { productCount } = this.state;

        operation === 'plus'
            ? this.setState({
                productCount: productCount + 1
            })
            : this.setState({
                productCount: productCount > 1 ? productCount - 1 : 1
            });
    };

    handlePreviouslyAddedCountClick = (id, operation) => () => {
        const { productsMap } = this.state;
        const minusValue = productsMap[id] > 1 ? -1 : 0;

        this.setState({
            productsMap: {
                ...productsMap,
                [id]: productsMap[id] + (operation === 'plus' ? 1 : minusValue)
            }
        });
    };

    deletePreviouslyAdded = (index) => () => {
        const newBasket = [
            ...remove(index, 1, this.props.basket)
        ];

        this.props.setBasket(newBasket);
        this.props.saveProductsToBasket(newBasket.map((product) => ({ id: product.product.id, count: product.count })));
    };

    handleDuplicates = () => {
        const { basket, product } = this.props;
        const isInBasket = find(item => product.id === item.product.id, basket);

        return !!isInBasket;
    };

    handleClosePopup = () => {
        const previouslyAdded = this.props.basket.map((product, i) => {
            return { product: product.product, count: this.state.productsMap[i] };
        }, {});

        const newBasket = !this.handleDuplicates() ? [
            { product: this.props.product, count: this.state.productCount }, ...previouslyAdded
        ] : [...previouslyAdded];

        this.props.setBasket(newBasket);
        this.props.saveProductsToBasket(newBasket.map((product) => ({ id: product.product.id, count: product.count })));
        this.props.closePopup();
    };

    componentDidMount () {
        this.setProductsMap();
    };

    render () {
        const { product, basket } = this.props;
        const { productCount, productsMap } = this.state;

        return <section>
            <div className={styles.root}>
                <div className={styles.cross} onClick={this.handleClosePopup}>
                    <CrossButton color='black'/>
                </div>
                <div className={styles.itemsWrapper}>
                    <div>
                        {productCount > 0 && <div className={styles.item}>
                            <div className={styles.wrapper}>
                                <div className={styles.itemImageWrapp}>
                                    <img className={styles.itemImage} src={product.avatar} alt={product.avatar}/>
                                </div>
                                <div className={styles.itemInfo}>
                                    <h2 className={styles.itemName}>{product.name}</h2>
                                    <div className={styles.itemCategory}>{product.company}</div>
                                    {
                                        product.discountPrice
                                            ? <div className={styles.prices}>
                                                <h2 className={styles.previousPrice}>{formatMoney(product.price)}</h2>
                                                <h2
                                                    className={classNames(styles.price, styles.priceDiscount)}>{formatMoney(product.discountPrice)}
                                                </h2>
                                            </div>
                                            : <h2 className={styles.itemPrice}>{formatMoney(product.price)}</h2>
                                    }
                                    {this.handleDuplicates() && <div className={styles.isInBasket}>*Этот товар уже в корзине</div>}
                                </div>
                            </div>
                            {!this.handleDuplicates() && <div className={styles.itemAmount}>
                                <div className={styles.amountTxt}>Количество</div>
                                <div className={styles.amount}>
                                    <span className={styles.amountButton}
                                        onClick={this.handleCountClick('minus')}>-</span>
                                    <div className={styles.countWrapp}>{productCount}</div>
                                    <span className={styles.amountButton}
                                        onClick={this.handleCountClick('plus')}>+</span>
                                </div>
                            </div>}
                        </div>}
                    </div>
                    {basket.length > 0 && <div className={styles.previouslyAdded}>
                        <h1 className={styles.previouslyAddedTitle}>ранее добавленные</h1>
                        {basket.map((item, i) =>
                            <div className={styles.previouslyAddedItemWrapp} key={i}>
                                <div className={styles.item}>
                                    <div className={styles.wrapper}>
                                        <div className={styles.itemImageWrapp}>
                                            <div className={styles.deleteItem} onClick={this.deletePreviouslyAdded(i)}>
                                                <span className={styles.deleteItemIcon}/>
                                            </div>
                                            <img className={styles.itemImage}
                                                src={item.product.avatar}
                                                alt={item.product.name}/>
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h2 className={styles.itemName}>{item.product.name}</h2>
                                            <div className={styles.itemCategory}>{item.product.company}</div>
                                            <h2 className={styles.itemPrice}>{formatMoney(item.product.price)}</h2>
                                        </div>
                                    </div>
                                    <div className={styles.itemAmount}>
                                        <div className={styles.amountTxt}>Количество</div>
                                        <div className={styles.amount}>
                                            <span className={styles.amountButton} onClick={this.handlePreviouslyAddedCountClick(i, 'minus')}>-</span>
                                            <div className={styles.countWrapp}>{productsMap[i]}</div>
                                            <span className={styles.amountButton} onClick={this.handlePreviouslyAddedCountClick(i, 'plus')}>+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                    </div>}
                </div>
                <div className={styles.buttonsWrapp}>
                    <button
                        className={classNames(styles.buttonDefault, styles.continueShopping, styles.buttons)} onClick={this.handleClosePopup}>продолжить
                        покупки
                    </button>
                    <Link to='/order'>
                        <button className={classNames(styles.buttonDefault, styles.ordering, styles.buttons)} onClick={this.handleClosePopup}>оформление
                                заказа
                        </button>
                    </Link>
                </div>
            </div>
        </section>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupBasket);
