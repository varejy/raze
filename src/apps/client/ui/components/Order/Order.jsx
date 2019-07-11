import React, { Component } from 'react';
import Form from '../Form/Form';
import getSchema from './orderFormSchema';

import styles from './Order.css';

class Order extends Component {
    render () {
        return <section className={styles.order}>
            <Form schema={getSchema()}/>
        </section>;
    }
}

export default Order;
