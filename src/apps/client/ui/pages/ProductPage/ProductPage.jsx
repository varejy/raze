import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import getProductById from '../../../services/client/getProductById';

import { withRouter, matchPath } from 'react-router-dom';

import styles from './ProductPage.css';

const PRODUCT_PATH = '/:category/:id';

const mapStateToProps = ({ application }) => {
    return {
        productMap: application.productMap
    };
};

const mapDispatchToProps = (dispatch) => ({
    getProductById: payload => dispatch(getProductById(payload))
});

class ProductPage extends Component {
    static propTypes = {
        getProductById: PropTypes.func.isRequired,
        location: PropTypes.object,
        productMap: PropTypes.object
    };

    static defaultProps = {
        location: {},
        productMap: {}
    };

    constructor (...args) {
        super(...args);

        const { location: { pathname }, productMap } = this.props;
        const match = matchPath(pathname, { path: PRODUCT_PATH, exact: true });
        const product = productMap[match.params.id];

        if (product === null) {
            this.notFoundPage = true;
        }

        this.state = {
            loading: !this.notFoundPage && !product,
            product: product,
            productId: match.params.id
        };
    }

    componentDidMount () {
        const { loading, productId } = this.state;

        if (loading) {
            this.props.getProductById(productId)
                .then(() => this.setState({ loading: false }));
        }
    }

    componentWillReceiveProps (nextProps) {
        const { productId } = this.state;

        if (nextProps.productMap !== this.props.productMap) {
            this.setState({ product: nextProps.productMap[productId] });
        }
    }

    render () {
        const { loading, product } = this.state;

        // TODO: Сделать страницу Not Found
        if (this.notFoundPage) {
            return <div>404</div>;
        }

        if (loading) {
            return <div className={styles.loader}>
                <img src='/src/apps/client/ui/icons/loader.svg' alt='loader'/>
            </div>;
        }

        return <section>
            { product.name }
        </section>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductPage));
