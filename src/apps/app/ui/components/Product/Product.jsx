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
                <div className={styles.discount}>{ product.discount && 'SPECIAL PRICE' }</div>
                <img className={styles.img} src={product.image} alt={product.type}/>
            </div>
            <div className={styles.infoWrapper}>
                <div className={styles.toolBar}>
                    <div className={classNames(styles.quickInspection, styles.toolBarItem)}>
                        <img className={styles.toolBarIcon} src="/src/apps/app/ui/components/Product/icons/eye.png" />
                        Быстрый просмотр
                    </div>
                    <div className={classNames(styles.heart, styles.toolBarItem)}>
                        <img className={styles.toolBarIcon} src="/src/apps/app/ui/components/Product/icons/heart.png" />
                        Избранное
                    </div>
                    <div className={classNames(styles.basket, styles.toolBarItem)}>
                        <img className={styles.toolBarIcon} src="/src/apps/app/ui/components/Product/icons/basketGreen.png" />
                        В корзину
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.manufacturer}>{product.manufacturer}</div>
                    <div className={styles.name}>{product.name}</div>
                    <div className={styles.price}>{product.price}$</div>
                </div>
            </div>
        </div>;
    }
}

export default Product;
