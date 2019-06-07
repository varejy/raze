import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Product.css';

class Product extends Component {
    static propTypes = {
        img: PropTypes.string,
        name: PropTypes.string,
        manufacturer: PropTypes.string,
        price: PropTypes.number,
        discount: PropTypes.bool,
        type: PropTypes.string
    };

    static defaultProps = {
        img: '',
        name: '',
        manufacturer: '',
        price: 0,
        discount: false,
        type: ''
    };
    render () {
        const { img, name, manufacturer, price, discount, type } = this.props;
        return <div className={styles.product} onMouseLeave={this.handleProductHover} onMouseEnter={this.handleProductEnter}>
            <div className={styles.imageWrapper}>
                {
                    discount ? <div className={styles.discount}>SPECIAL PRICE</div> : <span></span>
                }
                <img className={styles.img} src={img} alt={type}/>
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
                    <div className={styles.manufacturer}>{manufacturer}</div>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.price}>{price}$</div>
                </div>
            </div>
        </div>;
    }
}

export default Product;
