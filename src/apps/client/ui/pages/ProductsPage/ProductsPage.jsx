import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CheckboxFilters from '../../components/CheckboxFilters/CheckboxFilters';
import ProductsList from '../../components/ProductsList/ProductsList';

import { connect } from 'react-redux';
import getProductsByCategoryId from '../../../services/client/getProductsByCategoryId';

import { withRouter, matchPath } from 'react-router-dom';
import find from '@tinkoff/utils/array/find';

import styles from './ProductsPage.css';

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories,
        productsMap: application.productsMap
    };
};

const mapDispatchToProps = (dispatch) => ({
    getProductsByCategoryId: payload => dispatch(getProductsByCategoryId(payload))
});

class ProductsPage extends Component {
    static propTypes = {
        getProductsByCategoryId: PropTypes.func.isRequired,
        location: PropTypes.object,
        productsMap: PropTypes.object,
        categories: PropTypes.array
    };

    static defaultProps = {
        location: {},
        productsMap: {},
        categories: []
    };

    constructor (...args) {
        super(...args);

        const { location: { pathname }, categories, productsMap } = this.props;
        const category = find(route => matchPath(pathname, { path: `/${route.path}`, exact: true }), categories);

        if (!category) {
            this.notFoundPage = true;
        }

        const products = productsMap[category.id];

        this.state = {
            loading: !this.notFoundPage && !products,
            products: products || [],
            filteredProducts: products || [],
            category
        };
    }

    componentDidMount () {
        const { loading, category } = this.state;

        if (loading) {
            this.props.getProductsByCategoryId(category.id)
                .then(() => this.setState({ loading: false }));
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.productsMap !== this.props.productsMap) {
            this.setState({ filteredProducts: nextProps.productsMap[this.state.category.id], products: nextProps.productsMap[this.state.category.id] });
        }
    }

    handleChangeFilters = (activeFilters) => {
        const { products } = this.state;

        if (activeFilters.length === 0) {
            this.setState({
                filteredProducts: products
            });
        } else if (activeFilters.length !== 0) {
            this.setState({
                filteredProducts: activeFilters
            });
        }
    };

    handleSortProfucts = activeSort => {
        const { filteredProducts } = this.state;

        if (activeSort.length !== 0) {
            this.setState({
                filteredProducts: activeSort
            });
        } else {
            this.setState({
                filteredProducts: filteredProducts
            });
        }
    }

    render () {
        const { loading, products, filteredProducts } = this.state;

        // TODO: Сделать страницу Not Found
        if (this.notFoundPage) {
            return <div>404</div>;
        }

        if (loading) {
            return <div className={styles.loader}>
                <img src='/src/apps/client/ui/icons/loader.svg' alt='loader'/>
            </div>;
        }

        return <section className={styles.productsWrapp}>
            <div className={styles.productsElemWrapp}>
                <CheckboxFilters onFiltersChanged={this.handleChangeFilters} products={products}/>
                <ProductsList onSortProducts={this.handleSortProfucts} products={filteredProducts}/>
            </div>
        </section>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductsPage));
