import React, { Component } from 'react';

import classNames from 'classnames';

import styles from './PopupBasket.css';

const PRODUCTS = [
    {
        name: 'Knife Alfa',
        category: 'Ножи',
        price: 1000,
        path: '/src/apps/client/ui/components/PopupBasket/img/BestKnife.jpg'
    },
    {
        name: 'Emerson Steel',
        category: 'Ножи',
        price: 1500,
        path: '/src/apps/client/ui/components/PopupBasket/img/BestKnife.jpg'
    },
    {
        name: 'Iron Axe',
        category: 'Топоры',
        price: 2000,
        path: '/src/apps/client/ui/components/PopupBasket/img/BestKnife.jpg'
    }
];

class PopupBasket extends Component {
    render () {
        return <div className={styles.root}>
            <div className={styles.popupContent}>
                <div>
                    <div className={styles.headerContainer}>
                        <div className={styles.header}>корзина</div>
                        <div className={styles.closeButton}>+</div>
                    </div>
                    <div className={styles.amountTxt}>
                        <div>Количество</div>
                    </div>
                    <div className={styles.items}>
                        {PRODUCTS.map((product, i) =>
                            <div className={styles.item} key={i}>
                                <div className={styles.itemImageWrapp}>
                                    <div className={styles.deleteItem}>
                                        <img src='/src/apps/client/ui/components/PopupBasket/img/deleteIcon.png'/>
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
                                    <span className={styles.amountButton}>-</span>
                                    <div className={styles.countWrapp}>2</div>
                                    <span className={styles.amountButton}>+</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.priceTotal}>Итог: 4800 грн</div>
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
        </div>;
    }
}

export default PopupBasket;
