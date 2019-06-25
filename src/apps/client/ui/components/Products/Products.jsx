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

    handleChangeFilters = (activeFilters) => {
        const { products } = this.state;

        activeFilters.length
            ? this.setState({
                filteredProducts: products
            })
            : this.setState({
                filteredProducts: activeFilters
            });
    };

    render () {
        const { category, products, filteredProducts } = this.state;

        return <section className={styles.contentWrapp}>
            <div className={styles.filtersWrapp}>
                <CheckboxFilters onFiltersChanged={this.handleChangeFilters} products={products} />
                <RangeFilter/>
            </div>
            <ProductsList products={filteredProducts} category={category} />
        </section>;
    }
}

export default Products;
