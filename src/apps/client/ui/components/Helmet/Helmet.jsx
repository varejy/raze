import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactHelmet from 'react-helmet';

import { withRouter } from 'react-router-dom';
import getMeta from './getMeta';

class Helmet extends Component {
    static propTypes = {
        location: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    constructor (...args) {
        super(...args);

        const { location: { pathname } } = this.props;

        this.state = {
            meta: getMeta(pathname)
        };
    }

    componentWillReceiveProps (nextProps) {
        const { location: { pathname } } = nextProps;

        if (pathname !== this.props.location.pathname) {
            this.setState({
                meta: getMeta(pathname)
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

export default withRouter(Helmet);
