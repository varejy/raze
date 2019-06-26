import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import styles from './PopupBasket.css';
import setBasket from '../../../actions/setBasket';
import closePopup from '../../../actions/closePopup';
import find from '@tinkoff/utils/array/find';

const mapStateToProps = ({ savedProducts }) => {
    return {
        basket: savedProducts.basket
    };
};

const mapDispatchToProps = (dispatch) => ({
    setBasket: payload => dispatch(setBasket(payload)),
    closePopup: payload => dispatch(closePopup(payload))
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
        closePopup: PropTypes.func.isRequired
    };

    static defaultProps = {
        product: {},
        basket: []
    };

    setProductsMap = () => {
        const { basket } = this.props;
        const productsMap = basket.reduce((counter, item, i) => {
            counter[i] = basket[i].amount;
            return counter;
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

    handlePreviousCountClick = (id, operation) => () => {
        const { productsMap } = this.state;
        const minusValue = productsMap[id] > 1 ? -1 : 0;

        this.setState({
            productsMap: {
                ...productsMap,
                [id]: productsMap[id] + (operation === 'plus' ? 1 : minusValue)
            }
        });
    };

    deletePrevious = (index) => () => {
        const { basket, setBasket } = this.props;
        let basketModified = basket;
        basketModified.splice(index, 1);
        const newBasket = [
            ...basketModified
        ];

        setBasket(newBasket);
    };

    handleDuplicates = () => {
        const { basket, product } = this.props;
        const isInBasket = find(item => product.id === item.product.id, basket);

        return !!isInBasket;
    };

    handleClosePopup = () => {
        const { basket, setBasket, product } = this.props;
        const { productsMap, productCount } = this.state;
        const previouslyAdded = basket.map((item, i) => {
            return { product: basket[i].product, amount: productsMap[i] };
        }, {});

        const newBasket = !this.handleDuplicates() ? [
            { product: product, amount: productCount }, ...previouslyAdded
        ] : [...previouslyAdded];

        setBasket(newBasket);
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
                                    <h2 className={styles.itemPrice}>{product.price} UAH</h2>
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
                                {item.amount > 0 && <div className={styles.item}>
                                    <div className={styles.wrapper}>
                                        <div className={styles.itemImageWrapp}>
                                            <div className={styles.deleteItem} onClick={this.deletePrevious(i)}>
                                                <span className={styles.deleteItemIcon}/>
                                            </div>
                                            <img className={styles.itemImage}
                                                src={item.product.avatar}
                                                alt={item.product.name}/>
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h2 className={styles.itemName}>{item.product.name}</h2>
                                            <div className={styles.itemCategory}>{item.product.company}</div>
                                            <h2 className={styles.itemPrice}>{item.product.price} UAH</h2>
                                        </div>
                                    </div>
                                    <div className={styles.itemAmount}>
                                        <div className={styles.amountTxt}>Количество</div>
                                        <div className={styles.amount}>
                                            <span className={styles.amountButton} onClick={this.handlePreviousCountClick(i, 'minus')}>-</span>
                                            <div className={styles.countWrapp}>{productsMap[i]}</div>
                                            <span className={styles.amountButton} onClick={this.handlePreviousCountClick(i, 'plus')}>+</span>
                                        </div>
                                    </div>
                                </div>}
                            </div>)}
                    </div>}
                </div>
                <div className={styles.buttonsWrapp}>
                    <button
                        className={classNames(styles.buttonDefault, styles.continueShopping, styles.buttons)} onClick={this.handleClosePopup}>продолжить
                        покупки
                    </button>
                    <button className={classNames(styles.buttonDefault, styles.ordering, styles.buttons)}>оформление
                        заказа
                    </button>
                </div>
            </div>
        </section>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupBasket);
