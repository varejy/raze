import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import styles from './PopupBasket.css';
import openPopup from '../../../actions/openPopup';
import setBasket from '../../../actions/setBasket';

const PREVIOUSLY_ADDED = [
    {
        name: 'Keen Blade',
        category: 'Knives',
        price: 1200,
        amount: 2
    },
    {
        name: 'Super Axe',
        category: 'Axes',
        price: 2200,
        amount: 1
    },
    {
        name: 'Super Slayer',
        category: 'Knives',
        price: 3200,
        amount: 3
    }

];

const mapStateToProps = ({ savedProducts }) => {
    return {
        basket: savedProducts.basket
    };
};

const mapDispatchToProps = (dispatch) => ({
    openPopup: payload => dispatch(openPopup(payload)),
    setBasket: payload => dispatch(setBasket(payload))
});

class PopupBasket extends Component {
    state = {
        productCount: 1
    };

    static propTypes = {
        product: PropTypes.object,
        basket: PropTypes.array.isRequired,
        setBasket: PropTypes.func.isRequired
    };

    static defaultProps = {
        product: {},
        basket: []
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

    componentWillUnmount () {
        const { basket } = this.props;
        const newBasket = [
            { product: this.props.product, amount: this.state.productCount }, ...basket
        ];

        this.props.setBasket(newBasket);
    }

    render () {
        const { product } = this.props;
        const { productCount } = this.state;

        return <section>
            <div className={styles.root}>
                <div className={styles.itemsWrapper}>
                    <div>
                        <div className={styles.item}>
                            <div className={styles.wrapper}>
                                <div className={styles.itemImageWrapp}>
                                    <div className={styles.deleteItem}>
                                        <span className={styles.deleteItemIcon}/>
                                    </div>
                                    <img className={styles.itemImage} src={product.avatar} alt={product.avatar}/>
                                </div>
                                <div className={styles.itemInfo}>
                                    <h2 className={styles.itemName}>{product.name}</h2>
                                    <div className={styles.itemCategory}>категория</div>
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
                        </div>
                    </div>
                    {PREVIOUSLY_ADDED.length > 0 && <div className={styles.previouslyAdded}>
                        <h1 className={styles.previouslyAddedTitle}>ранее добавленные</h1>
                        {PREVIOUSLY_ADDED.map((item, i) =>
                            <div className={styles.previouslyAddedItemWrapp} key={i}>
                                <div className={styles.item}>
                                    <div className={styles.wrapper}>
                                        <div className={styles.itemImageWrapp}>
                                            <div className={styles.deleteItem}>
                                                <span className={styles.deleteItemIcon}/>
                                            </div>
                                            <img className={styles.itemImage}
                                                src="/src/apps/client/ui/components/PopupBasket/img/BestKnife.jpg"
                                                alt="product"/>
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h2 className={styles.itemName}>{item.name}</h2>
                                            <div className={styles.itemCategory}>{item.category}</div>
                                            <h2 className={styles.itemPrice}>{item.price} UAH</h2>
                                        </div>
                                    </div>
                                    <div className={styles.itemAmount}>
                                        <div className={styles.amountTxt}>Количество</div>
                                        <div className={styles.amount}>
                                            <span className={styles.amountButton}>-</span>
                                            <div className={styles.countWrapp}>{item.amount}</div>
                                            <span className={styles.amountButton}>+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                    </div>}
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
        </section>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupBasket);
