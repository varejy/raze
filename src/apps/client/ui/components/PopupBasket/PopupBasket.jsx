import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import styles from './PopupBasket.css';

class PopupBasket extends Component {
    state = {
        productCount: 1
    };

    static propTypes = {
        product: PropTypes.object
    };

    static defaultProps = {
        product: {}
    }

    handleCountClick = button => () => {
        const { productCount } = this.state;

        button === 1
            ? this.setState({
                productCount: productCount + 1
            })
            : this.setState({
                productCount: productCount !== 0 ? productCount - 1 : 0
            });
    }

    render () {
        const { product } = this.props;
        const { productCount } = this.state;

        return <section>
            <div className={styles.root}>
                <div>
                    <div className={styles.item}>
                        <div className={styles.itemImageWrapp}>
                            <div className={styles.deleteItem}>
                                <span className={styles.deleteItemIcon}></span>
                            </div>
                            <img className={styles.itemImage} src={product.avatar} alt={product.avatar}/>
                        </div>
                        <div className={styles.itemInfo}>
                            <h2 className={styles.itemName}>{product.name}</h2>
                            <div className={styles.itemCategory}>категория</div>
                            <h2 className={styles.itemPrice}>{product.price} UAH</h2>
                        </div>
                        <div className={styles.itemAmount}>
                            <div className={styles.amountTxt}>Количество</div>
                            <div className={styles.amount}>
                                <span className={styles.amountButton} onClick={this.handleCountClick(-1)}>-</span>
                                <div className={styles.countWrapp}>{productCount}</div>
                                <span className={styles.amountButton} onClick={this.handleCountClick(1)}>+</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.previouslyAdded}>
                    <h1 className={styles.previouslyAddedTitle}>РАНЕЕ ДОБАВЛЕННЫЕ</h1>
                    <div className={styles.previouslyAddedItemWrapp}>
                        <div className={styles.item}>
                            <div className={styles.itemImageWrapp}>
                                <div className={styles.deleteItem}>
                                    <span className={styles.deleteItemIcon}></span>
                                </div>
                                <img className={styles.itemImage} src="/src/apps/client/ui/components/PopupBasket/img/BestKnife.jpg" alt="product"/>
                            </div>
                            <div className={styles.itemInfo}>
                                <h2 className={styles.itemName}>Название товара</h2>
                                <div className={styles.itemCategory}>категория</div>
                                <h2 className={styles.itemPrice}>1200 UAH</h2>
                            </div>
                            <div className={styles.itemAmount}>
                                <div className={styles.amountTxt}>Количество</div>
                                <div className={styles.amount}>
                                    <span className={styles.amountButton}>-</span>
                                    <div className={styles.countWrapp}>5</div>
                                    <span className={styles.amountButton}>+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.buttonsWrapp}>
                    <button className={classNames(styles.buttonDefault, styles.continueShopping, styles.buttons)}>продолжить покупки</button>
                    <button className={classNames(styles.buttonDefault, styles.ordering, styles.buttons)}>оформление заказа</button>
                </div>
            </div>
        </section>;
    }
}

export default PopupBasket;
