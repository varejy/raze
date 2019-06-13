import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Product from '../Product/Product';

import styles from './ProductsList.css';

class ProductsList extends Component {
    static propTypes = {
        products: PropTypes.array
    };

    static defaultProps = {
        products: []
    }

    render () {
        const { products } = this.props;

        return <section className={styles.root}>
            <div className={styles.productsFilter}>
                <div className={styles.filter}>
                    <div>Сортировать по:</div>
                    <div className={styles.filterWrapp}>
                        <div className={styles.filterItem}>Цене</div>
                        <div className={styles.filterItem}>Дате</div>
                        <div className={styles.filterItem}>Качеству</div>
                    </div>
                </div>
            </div>
            <div className={styles.productsWrapper}>
                {
                    products.map((product, i) => {
                        return (
                            <Product
                                key={product.id}
                                product={product}
                            />
                        );
                    })
                }
            </div>
        </section>;
    }
}

export default ProductsList;
