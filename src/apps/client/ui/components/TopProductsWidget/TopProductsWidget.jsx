import React, { Component } from 'react';
import { connect } from 'react-redux';

import Product from '../Product/Product';
import styles from './TopProductsWidget.css';

import find from '@tinkoff/utils/array/find';

const mapStateToProps = ({ application }) => {
    return {
        topProducts: application.topProducts,
        categories: application.categories
    };
};

class TopProductsWidget extends Component {
    constructor (props) {
        super(props);

        this.state = {
            products: this.props.topProducts
        }
    }

    render () {
        const { products } = this.state;
        const { categories } = this.props;
        return <div className={styles.root}>
            <div className={styles.title}>топ продаж</div>
            <div className={styles.productsWrapp}>
                {
                    products.map((product, i) => {
                        const category = find(category => category.id === product.categoryId)(categories);

                        return <Product key={i} category={category} product={product} />
                    })
                }
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(TopProductsWidget);
