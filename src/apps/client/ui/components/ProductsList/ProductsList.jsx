import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Product from '../Product/Product';

import { Link, withRouter } from 'react-router-dom';

import styles from './ProductsList.css';

class ProductsList extends Component {
    static propTypes = {
        category: PropTypes.object.isRequired,
        products: PropTypes.array
    };

    static defaultProps = {
        products: []
    };

    render () {
        const { products, category } = this.props;

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
                    products.map((product) => {
                        return (
                            <Link className={styles.link} key={product.id} to={`/${category.path}/${product.id}`}>
                                <Product
                                    product={product}
                                />
                            </Link>
                        );
                    })
                }
            </div>
        </section>;
    }
}

export default withRouter(ProductsList);
