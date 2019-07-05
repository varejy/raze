import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProductsList from '../../components/ProductsList/ProductsList';
import ProductsFilters from '../../components/ProductsFilters/ProductsFilters';

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
                filteredProducts: nextProps.products,
                category: nextProps.category
            });
        }
    }

    handleFilter = filteredProducts => {
        this.setState({
            filteredProducts
        });
    };

    render () {
        const { category, products, filteredProducts } = this.state;

        return <section className={styles.contentWrapp}>
            <ProductsFilters products={products} onFilter={this.handleFilter} />
            <ProductsList products={filteredProducts} category={category} />
        </section>;
    }
}

export default Products;
