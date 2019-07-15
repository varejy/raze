import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from '../Form/Form';
import getSchema from './orderFormSchema';

import { connect } from 'react-redux';
import saveOrder from '../../../services/client/saveOrder';

import noop from '@tinkoff/utils/function/noop';

import styles from './Order.css';

const mapDispatchToProps = (dispatch) => ({
    saveOrder: (...payload) => dispatch(saveOrder(...payload))
});

class Order extends Component {
    static propTypes = {
        saveOrder: PropTypes.func
    };

    static defaultProps = {
        saveOrder: noop
    };

    handleFormSubmit = (event) => {
        this.props.saveOrder(event);
    }

    render () {
        return <section className={styles.order}>
            <Form schema={getSchema()} onSubmit={this.handleFormSubmit}/>
        </section>;
    }
}

export default connect(null, mapDispatchToProps)(Order);
