import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Product.css';

class Product extends Component {
    static propTypes = {
        product: PropTypes.object
    };

    static defaultProps = {
        product: {}
    };

    render () {
        const { product } = this.props;

        return <div className={styles.product}>
            <div className={styles.imageWrapper}>
                { product.discount && <div className={styles.discount}>SPECIAL PRICE</div>}
                <img className={styles.img} src={product.avatar} alt={product.avatar}/>
            </div>
            <div className={styles.infoWrapper}>
                <div className={styles.toolBar}>
                    <div className={classNames(styles.quickInspection, styles.toolBarItem)}>
                        <div className={classNames(styles.toolBarIcon, styles.eyeIcon)}/>
                        <div>Быстрый просмотр</div>
                    </div>
                    <div className={classNames(styles.heart, styles.toolBarItem)}>
                        <div className={classNames(styles.toolBarIcon, styles.heartIcon)}/>
                        <div>Избранное</div>
                    </div>
                    <div className={classNames(styles.basket, styles.toolBarItem)}>
                        <div className={classNames(styles.toolBarIcon, styles.basketIcon)}/>
                        <div>В корзину</div>
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.manufacturer}>{product.company}</div>
                    <div className={styles.name}>{product.name}</div>
                    <div className={styles.prices}>
                        <div className={styles.price}>{product.price}$</div>
                        <div className={styles.previousPrice}>24$</div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default Product;
