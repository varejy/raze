import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProductsPageFilters from '../../components/ProductsPageFilters/ProductsPageFilters';
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
            this.setState({ products: nextProps.productsMap[this.state.category.id] });
        }
    }

    render () {
        const { loading } = this.state;

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
                <ProductsPageFilters />
                <ProductsList />
            </div>
        </section>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductsPage));
