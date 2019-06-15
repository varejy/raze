import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Product from '../Product/Product';

import styles from './ProductsList.css';

const SORTING_OPTIONS = [
    {
        text: 'Дате',
        id: 0
    },
    {
        text: 'Цене',
        id: 1
    },
    {
        text: 'Популярности',
        id: 2
    }
];

class ProductsList extends Component {
    constructor (props) {
        super(props);

        this.state = {
            products: props.products,
            activeOption: ''
        };
    }

    static propTypes = {
        products: PropTypes.array
    };

    static defaultProps = {
        products: []
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.products !== this.props.products) {
            this.setState({ products: nextProps.products });
            this.handleActiveSortClick(this.state.activeOption);
        }
    }

    handleActiveSortClick = activeOption => () => {
        const { products } = this.state;
        const minSortPrice = (product, nextProduct) => product.price - nextProduct.price;
        const maxSortPrice = (product, nextProduct) => product.price + nextProduct.price;
        const minSortDate = (product, nextProduct) => product.date - nextProduct.date;
        const maxSortDate = (product, nextProduct) => product.date + nextProduct.date;
        const minSortPopularity = (product, nextProduct) => {
            return product.popularity - nextProduct.popularity;
        };
        const maxSortPopularity = (product, nextProduct) => {
            return product.popularity + nextProduct.popularity;
        };
        const minSortViews = (product, nextProduct) => product.views - nextProduct.views;
        const maxSortViews = (product, nextProduct) => product.views + nextProduct.views;

        this.setState({ activeOption: activeOption });

        if (activeOption === 0) {
            /*
                minSortDate
                maxSortDate
            */

            this.setState({ products: products.sort(/* minSortDate || maxSortDate */) });
        } else if (activeOption === 1) {
            /*
                minSortPrice
                maxSortPrice
            */

            this.setState({ products: products.sort(/* minSortPrice || maxSortPrice */) });
        } else if (activeOption === 2) {
            /*
                minSortPopularity
                maxSortPopularity
            */
            this.setState({ products: products.sort(/* minSortPopularity || maxSortPopularity */) });
        }
    }

    render () {
        const { products, activeOption } = this.state;

        return <section className={styles.root}>
            <div className={styles.productsFilter}>
                <div className={styles.filter}>
                    <div>Сортировать по:</div>
                    <div className={styles.filterWrapp}>
                        {
                            SORTING_OPTIONS.map((option, i) => {
                                const isActive = activeOption === option.id;

                                return (
                                    <div
                                        key={i}
                                        className={classNames(styles.filterItem, { [styles.filterItemActive]: isActive })}
                                        onClick={this.handleActiveSortClick(option.id)}>
                                        {option.text}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styles.productsWrapper}>
                {
                    products.map(product => {
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
