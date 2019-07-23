import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactHelmet from 'react-helmet';

import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import getMeta from './getMeta';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Helmet extends Component {
    static propTypes = {
        location: PropTypes.object
    };

    static defaultProps = {
        langMap: {},
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
            <meta name='title' content={meta.title} />
        </ReactHelmet>;
    }
}

export default withRouter(connect(mapStateToProps)(Helmet));
