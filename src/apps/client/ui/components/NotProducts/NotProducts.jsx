import React, { Component } from 'react';

import styles from './NotProducts.css';

class NotProducts extends Component {
    render () {
        return <section className={styles.root}>
            <div className={styles.title}>В этой категории еще нет товаров</div>
        </section>;
    }
}

export default NotProducts;
