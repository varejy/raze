import React, { Component } from 'react';
import ProductsPageFilters from '../../components/ProductsPageFilters/ProductsPageFilters';
import Products from '../../components/Products/Products';
import styles from './ProductsPage.css';

class ProductsPage extends Component {
    render () {
        return <section className={styles.productsWrapp}>
            <div>{/* Header */}</div>
            <div className={styles.productsElemWrapp}>
                <ProductsPageFilters />
                <Products />
            </div>
            <div>{/* Footer */}</div>
        </section>;
    }
}

export default ProductsPage;
