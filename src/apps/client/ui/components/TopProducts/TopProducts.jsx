import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Product from '../Product/Product';
import styles from './TopProducts.css';

import find from '@tinkoff/utils/array/find';

const mapStateToProps = ({ application }) => {
    return {
        topProducts: application.topProducts,
        categories: application.categories
    };
};

class TopProducts extends Component {
    static propTypes = {
        categories: PropTypes.array.isRequired,
        topProducts: PropTypes.array
    };

    static defaultProps = {
        topProducts: []
    };

    render () {
        const { categories, topProducts } = this.props;

        return <div className={styles.root}>
            <div className={styles.title}>топ продаж</div>
            <div className={styles.productsWrapp}>
                {
                    topProducts.map((product, i) => {
                        const category = find(category => category.id === product.categoryId)(categories);

                        return <Product key={i} category={category} product={product} />;
                    })
                }
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(TopProducts);
