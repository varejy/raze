import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProductsList from '../../components/ProductsList/ProductsList';
import CheckboxFilters from '../../components/CheckboxFilters/CheckboxFilters';
import RangeFilter from '../../components/RangeFilter/RangeFilter';

import styles from './Products.css';

class Products extends Component {
    static propTypes = {
        products: PropTypes.array.isRequired,
        category: PropTypes.object
    };

    static defaultProps = {
        products: [],
        category: {}
    };

    constructor (props) {
        super(props);

        this.state = {
            products: this.props.products,
            filteredProducts: this.props.products,
            priceFilteredProducts: this.props.products,
            category: this.props.category
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.products !== this.state.products) {
            this.setState({
                products: nextProps.products,
                filteredProducts: nextProps.products
            });
        }
    }

    handleChangeFilters = (activeFilters, marking) => {
        const { products } = this.state;

        !activeFilters.length
            ? this.setState({
                priceFilteredProducts: products,
                filteredProducts: products
            })
            : marking === 'RangeFilter'
                ? this.setState({
                    priceFilteredProducts: activeFilters
                })
                : this.setState({
                    filteredProducts: activeFilters,
                    priceFilteredProducts: activeFilters
                });
    };

    render () {
        const { category, products, filteredProducts, priceFilteredProducts } = this.state;

        return <section className={styles.contentWrapp}>
            <div className={styles.filtersWrapp}>
                <CheckboxFilters onFiltersChanged={this.handleChangeFilters} products={products} />
                <RangeFilter onFiltersChanged={this.handleChangeFilters} products={filteredProducts}/>
            </div>
            <ProductsList products={priceFilteredProducts} category={category} />
        </section>;
    }
}

export default Products;
