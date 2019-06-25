import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import styles from './PopupBasket.css';
import setBasket from '../../../actions/setBasket';
import closePopup from '../../../actions/closePopup';

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

    handleClosePopup = () => {
        this.props.closePopup();
    };

    setProductsMap = () => {
        const productsMap = this.props.basket.reduce((counter, item, i) => {
            counter[i] = this.props.basket[i].amount;
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

    deleteItem = () => {
        this.setState({
            productCount: 0
        });
    };

    deletePrevious = (index) => () => {
        const { basket } = this.props;
        let basketModified = basket;
        basketModified.splice(index, 1);
        const newBasket = [
            ...basketModified
        ];

        this.props.setBasket(newBasket);
    };

    componentWillUnmount () {
        const { basket } = this.props;
        const previouslyAdded = basket.map((item, i) => {
            return { product: this.props.basket[i].product, amount: this.state.productsMap[i] };
        }, {});
        const newBasket = [
            { product: this.props.product, amount: this.state.productCount }, ...previouslyAdded
        ];

        this.props.setBasket(newBasket);
    };

    componentDidMount () {
        this.setProductsMap();
    };

    render () {
        const { product } = this.props;
        const { productCount } = this.state;

        return <section>
            <div className={styles.root}>
                <div className={styles.itemsWrapper}>
                    <div>
                        {productCount > 0 && <div className={styles.item}>
                            <div className={styles.wrapper}>
                                <div className={styles.itemImageWrapp}>
                                    <div className={styles.deleteItem} onClick={this.deleteItem}>
                                        <span className={styles.deleteItemIcon}/>
                                    </div>
                                    <img className={styles.itemImage} src={product.avatar} alt={product.avatar}/>
                                </div>
                                <div className={styles.itemInfo}>
                                    <h2 className={styles.itemName}>{product.name}</h2>
                                    <div className={styles.itemCategory}>{product.company}</div>
                                    <h2 className={styles.itemPrice}>{product.price} UAH</h2>
                                </div>
                            </div>
                            <div className={styles.itemAmount}>
                                <div className={styles.amountTxt}>Количество</div>
                                <div className={styles.amount}>
                                    <span className={styles.amountButton}
                                        onClick={this.handleCountClick('minus')}>-</span>
                                    <div className={styles.countWrapp}>{productCount}</div>
                                    <span className={styles.amountButton}
                                        onClick={this.handleCountClick('plus')}>+</span>
                                </div>
                            </div>
                        </div>}
                    </div>
                    {this.props.basket.length > 0 && <div className={styles.previouslyAdded}>
                        <h1 className={styles.previouslyAddedTitle}>ранее добавленные</h1>
                        {this.props.basket.map((item, i) =>
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
                                            <div className={styles.countWrapp}>{this.state.productsMap[i]}</div>
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
