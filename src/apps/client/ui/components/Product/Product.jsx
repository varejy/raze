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
                <img className={styles.img} src={product.image} alt={product.type}/>
            </div>
            <div className={styles.infoWrapper}>
                <div className={styles.toolBar}>
                    <div className={classNames(styles.quickInspection, styles.toolBarItem)}>
                        <img className={styles.toolBarIcon}
                            src='/src/apps/client/ui/components/Product/icons/eyeGreen.png'
                            alt='quick inspection' />
                        <div>Быстрый просмотр</div>
                    </div>
                    <div className={classNames(styles.heart, styles.toolBarItem)}>
                        <img className={styles.toolBarIcon}
                            src='/src/apps/client/ui/components/Product/icons/heartGreen.png'
                            alt='like' />
                        <div>Избранное</div>
                    </div>
                    <div className={classNames(styles.basket, styles.toolBarItem)}>
                        <img className={styles.toolBarIcon}
                            src='/src/apps/client/ui/components/Product/icons/basketGreen.png'
                            alt='basket' />
                        <div>В корзину</div>
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.manufacturer}>{product.manufacturer}</div>
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
