import React, { Component } from 'react';

import classNames from 'classnames';

import styles from './PopupBasket.css';

class PopupBasket extends Component {
    render () {
        return <section>
            <div className={styles.root}>
                <div>
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
                            <h2 className={styles.itemPrice}>1000 UAH</h2>
                        </div>
                        <div className={styles.itemAmount}>
                            <div className={styles.amountTxt}>Количество</div>
                            <div className={styles.amount}>
                                <span className={styles.amountButton}>-</span>
                                <div className={styles.countWrapp}>2</div>
                                <span className={styles.amountButton}>+</span>
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
                    <button className={classNames(styles.continueShopping, styles.buttons)}>ПРОДОЛЖИТЬ ПОКУПКИ</button>
                    <button className={classNames(styles.ordering, styles.buttons)}>ОФОРМЛЕНИЕ ЗАКАЗА</button>
                </div>
            </div>
        </section>;
    }
}

export default PopupBasket;
