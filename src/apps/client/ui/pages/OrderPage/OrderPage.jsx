import React, { Component } from 'react';
import Order from '../../components/Order/Order';

import styles from './OrderPage.css';

class OrderPage extends Component {
    render () {
        return <section className={styles.orderPage}>
            <div className={styles.orderTitle}>оформление заказа</div>
            <Order/>
        </section>;
    }
}

export default OrderPage;
