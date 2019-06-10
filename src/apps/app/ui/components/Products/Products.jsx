import React, { Component } from 'react';
import products from './products';
import styles from './Products.css';

import Product from '../Product/Product';

class Products extends Component {
    state = {
        products
    }

    render () {
        const { products } = this.state;
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
                                key={i}
                                product={product}
                            />
                        );
                    })
                }
            </div>
        </section>;
    }
}

export default Products;
