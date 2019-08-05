import React, { Component } from 'react';

import styles from './PageNotFound.css';

export default class PageNotFound extends Component {
    render () {
        return <div className={styles.pageNotFoundContainer}>
            <div className={styles.errorText}>Извините, но такой страницы не существует.</div>
        </div>;
    }
}
