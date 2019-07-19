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
        saveOrder: PropTypes.func,
        onVisibleMessage: PropTypes.func
    };

    static defaultProps = {
        saveOrder: noop,
        onVisibleMessage: noop
    };

    state = {
        sendStat: {
            status: '',
            paymentType: ''
        }
    }

    handleSendDone = paymentType => {
        this.setState({
            sendStat: {
                status: 'done',
                paymentType
            }
        });
    }

    handleSendErron = () => {
        this.setState({
            sendStat: {
                status: 'err',
                paymentType: ''
            }
        });
    }

    handleFormSubmit = (event) => {
        this.props.saveOrder(event)
            .then(() => {
                this.handleSendDone(event.paymentType);
                this.props.onVisibleMessage(this.state.sendStat);
            })
            .catch(() => {
                this.handleSendErron();
                this.props.onVisibleMessage(this.state.sendStat);
            });
    }

    render () {
        return <section className={styles.order}>
            <Form schema={getSchema()} onSubmit={this.handleFormSubmit}/>
        </section>;
    }
}

export default connect(null, mapDispatchToProps)(Order);
