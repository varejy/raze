import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Products from '../../components/Products/Products';
import NotProducts from '../../components/NotProducts/NotProducts';

import { connect } from 'react-redux';
import getProductsByCategory from '../../../services/client/getProductsByCategory';

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
    getProductsByCategory: payload => dispatch(getProductsByCategory(payload))
});

class ProductsPage extends Component {
    static propTypes = {
        getProductsByCategory: PropTypes.func.isRequired,
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

        this.state = this.getNewState();
    }

    componentDidMount () {
        this.getProducts();
    }

    componentWillReceiveProps (nextProps) {
        const { location: { pathname }, productsMap } = this.props;
        const { category } = this.state;

        if (nextProps.productsMap !== productsMap) {
            this.setState({ products: nextProps.productsMap[category.path] });
        }

        if (nextProps.location.pathname !== pathname) {
            this.setState(this.getNewState(nextProps), this.getProducts);
        }
    }

    getNewState = (props = this.props) => {
        const { location: { pathname }, categories, productsMap } = props;
        const category = find(route => matchPath(pathname, { path: `/${route.path}`, exact: true }), categories);

        this.notFoundPage = !category;

        const products = productsMap[category && category.path];

        return {
            loading: !this.notFoundPage && !products,
            products: products || [],
            category
        };
    };

    getProducts = () => {
        debugger;
        const { loading, category } = this.state;

        if (loading) {
            this.props.getProductsByCategory(category.path)
                .then(() => this.setState({ loading: false }));
        }
    };

    render () {
        const { loading, products, category } = this.state;

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
                { products.length ? <Products products={products} category={category}/> : <NotProducts/>}
            </div>
        </section>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductsPage));
