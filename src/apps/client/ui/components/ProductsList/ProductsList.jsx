import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Product from '../Product/Product';

import styles from './ProductsList.css';

const SORTING_OPTIONS = ['Дате', 'Цене', 'Популярности'];

class ProductsList extends Component {
    static propTypes = {
        products: PropTypes.array,
        onSortProducts: PropTypes.func
    };

    static defaultProps = {
        products: []
    }

    state = {
        activeOption: ''
    }

    handleActiveSort = activeOption => {
        const { products } = this.props;
        const nativeProducts = products;
        const activeOptionTxt = activeOption.target.innerText;
        const MinSortPrice = (product, nextProduct) => product.price - nextProduct.price;
        const MaxSortPrice = (product, nextProduct) => product.price + nextProduct.price;
        const MinSortDate = (product, nextProduct) => product.date - nextProduct.date;
        const MaxSortDate = (product, nextProduct) => product.date + nextProduct.date;
        const MinSortPopularity = (product, nextProduct) => {
            return product.popularity - nextProduct.popularity;
        };
        const MaxSortPopularity = (product, nextProduct) => {
            return product.popularity + nextProduct.popularity;
        };
        const MinSortViews = (product, nextProduct) => product.views - nextProduct.views;
        const MaxSortViews = (product, nextProduct) => product.views + nextProduct.views;

        this.setState({ activeOption: activeOptionTxt });

        if (activeOptionTxt === 'Цене') {
            /*
                MinSortPrice
                MaxSortPrice
            */
            const sortPrice = nativeProducts.sort(/* MinSortPrice || MaxSortPrice */);

            this.props.onSortProducts(sortPrice);
        } else if (activeOptionTxt === 'Дате') {
            /*
                MinSortDate
                MaxSortDate
            */
            const sortDate = nativeProducts.sort(/* MinSortDate || MaxSortDate */);

            this.props.onSortProducts(sortDate);
        } else if (activeOptionTxt === 'Популярности') {
            /*
                MinSortPopularity
                MaxSortPopularity
            */
            const sortPopularity = nativeProducts.sort(/* MinSortPopularity || MaxSortPopularity */);

            this.props.onSortProducts(sortPopularity);
        }
    }

    render () {
        const { products } = this.props;
        const { activeOption } = this.state;
        const sortingOptions = SORTING_OPTIONS;

        return <section className={styles.root}>
            <div className={styles.productsFilter}>
                <div className={styles.filter}>
                    <div>Сортировать по:</div>
                    <div className={styles.filterWrapp}>
                        {
                            sortingOptions.map((option, i) => {
                                const isActive = activeOption === option;

                                return (
                                    <div
                                        key={i}
                                        className={classNames(styles.filterItem, { [styles.filterItemActive]: isActive })}
                                        onClick={this.handleActiveSort}>
                                        {option}
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
