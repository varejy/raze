import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactHelmet from 'react-helmet';

import { connect } from 'react-redux';

import { matchPath, withRouter } from 'react-router-dom';
import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';

const PRODUCT_PATH = '/:category/:id';
const CATEGORY_PATH = '/:category';
const STATIC_ROUTES = [
    { id: 'main', path: '/', exact: true },
    { id: 'search', path: '/search', exact: true },
    { id: 'order', path: '/order', exact: true }
];
const STATIC_ROUTES_META = {
    main: {
        title: 'main',
        description: 'main',
        keywords: 'mainKeywords'
    },
    search: {
        title: 'search',
        description: 'search',
        keywords: 'searchKeywords'
    },
    order: {
        title: 'order',
        description: 'order',
        keywords: 'orderKeywords'
    }
};
const NOT_FOUND_META = {
    title: '404',
    description: '404',
    keywords: '404'
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

        this.state = {
            meta: this.getMeta()
        };
    }

    getMeta = (props = this.props) => {
        const { location: { pathname }, productMap, categories } = props;
        const meta = propOr('meta', {}, this.state);
        const productPage = matchPath(pathname, { path: PRODUCT_PATH, exact: true });
        const categoryPage = matchPath(pathname, { path: CATEGORY_PATH, exact: true });
        const staticRouteMatch = find(route => matchPath(pathname, route), STATIC_ROUTES);

        if (staticRouteMatch) {
            return STATIC_ROUTES_META[staticRouteMatch.id];
        }

        if (productPage) {
            const product = productMap[productPage.params.id];

            if (product) {
                return {
                    title: product.metaTitle,
                    description: product.metaDescription,
                    keywords: product.keywords
                };
            }

            return meta;
        }

        if (categoryPage) {
            const category = find(route => matchPath(pathname, { path: `/${route.path}`, exact: true }), categories);

            if (category) {
                return {
                    title: category.metaTitle,
                    description: category.metaDescription,
                    keywords: category.keywords
                };
            }

            return meta;
        }

        return NOT_FOUND_META;
    };

    componentWillReceiveProps (nextProps) {
        const { location: { pathname }, productMap } = nextProps;

        if (this.props.location.pathname !== pathname || this.props.productMap !== productMap) {
            this.setState({
                meta: this.getMeta(nextProps)
            });
        }
    }

    render () {
        const { meta } = this.state;
        console.log(meta);

        return <ReactHelmet>
            <title>{meta.title}</title>
            <meta name='description' content={meta.description} />
        </ReactHelmet>;
    }
}

export default withRouter(connect(mapStateToProps)(Helmet));
