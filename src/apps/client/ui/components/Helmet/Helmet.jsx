import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactHelmet from 'react-helmet';

import { connect } from 'react-redux';

import { matchPath, withRouter } from 'react-router-dom';
import getMeta from './utils/getMetaByUrl';
import find from '@tinkoff/utils/array/find';

const PRODUCT_PATH = '/:category/:id';

const META_DATA = {
    main: { title: 'main', description: 'main' },
    search: { title: 'search', description: 'search' },
    order: { title: 'order', description: 'order' },
    products: { title: 'products', description: 'products' },
    product: { title: 'product', description: 'product' }
};

const mapStateToProps = ({ application }) => {
    return {
        productMap: application.productMap,
        categories: application.categories
    };
};

class Helmet extends Component {
    static propTypes = {
        location: PropTypes.object,
        productMap: PropTypes.object,
        categories: PropTypes.array
    };

    static defaultProps = {
        location: {},
        productMap: {},
        categories: []
    };

    constructor (...args) {
        super(...args);

        const { location: { pathname } } = this.props;

        this.state = {
            meta: getMeta(pathname, META_DATA)
        };
    }

    getProduct = (props) => {
        const { location: { pathname }, productMap } = props;
        const match = matchPath(pathname, { path: PRODUCT_PATH, exact: true });

        return match ? productMap[match.params.id] : undefined;
    };

    componentWillReceiveProps (nextProps) {
        const product = this.getProduct(nextProps);
        const { location: { pathname } } = nextProps;
        const category = find(route => matchPath(pathname, { path: `/${route.path}`, exact: true }), nextProps.categories);

        let NEW_META_DATA;
        if (product !== undefined) {
            NEW_META_DATA = { product: { title: product.metaTitle, description: product.metaDescription } };
        } else if (category) {
            NEW_META_DATA = { products: { title: category.name, description: category.name } };
        } else {
            NEW_META_DATA = META_DATA;
        }

        if (this.props !== nextProps) {
            this.setState({
                meta: getMeta(pathname, NEW_META_DATA)
            });
        }
    }

    render () {
        const { meta } = this.state;

        return <ReactHelmet>
            <title>{meta.title}</title>
            <meta name='description' content={meta.description} />
        </ReactHelmet>;
    }
}

export default withRouter(connect(mapStateToProps)(Helmet));
