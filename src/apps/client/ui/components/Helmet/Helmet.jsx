import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactHelmet from 'react-helmet';

import { connect } from 'react-redux';

import { matchPath, withRouter } from 'react-router-dom';
import getMeta from './getMeta';
import find from '@tinkoff/utils/array/find';

const PRODUCT_PATH = '/:category/:id';

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
        const category = find(route => matchPath(pathname, { path: `/${route.path}`, exact: true }), this.props.categories);
        const product = this.getProduct(this.props);

        this.state = {
            meta: getMeta(pathname, product, category)
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

        if (this.props !== nextProps) {
            this.setState({
                meta: getMeta(pathname, product, category)
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
