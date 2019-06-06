import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './ProductsPageFilters.css';

class ProductsPageFilters extends Component {
    render () {
        return <section className={styles.filterWrapper}>
            <div className={styles.filterWrapp}>
                <div className={styles.filter}>
                    <h3 className={classNames(styles.filterName, styles.filterTxt)}>Производители</h3>
                    <ul>
                        <li className={styles.filterOption}>
                            <label className="filterCheckbox">
                                <input className={styles.filterCheckbox} type='checkbox'/>
                                <p className={classNames(styles.filterOptionTxt, styles.filterTxt)}>EMERSON</p>
                            </label>
                        </li>
                        <li className={styles.filterOption}>
                            <label className="filterCheckbox">
                                <input className={styles.filterCheckbox} type='checkbox'/>
                                <p className={classNames(styles.filterOptionTxt, styles.filterTxt)}>EMERSON</p>
                            </label>
                        </li>
                        <li className={styles.filterOption}>
                            <label className="filterCheckbox">
                                <input className={styles.filterCheckbox} type='checkbox'/>
                                <p className={classNames(styles.filterOptionTxt, styles.filterTxt)}>EMERSON</p>
                            </label>
                        </li>
                        <li className={styles.filterOption}>
                            <label className="filterCheckbox">
                                <input className={styles.filterCheckbox} type='checkbox'/>
                                <p className={classNames(styles.filterOptionTxt, styles.filterTxt)}>EMERSON</p>
                            </label>
                        </li>
                    </ul>
                </div>
                <div className={classNames(styles.filter, styles.filterTxt)}>
                    <h3 className={styles.filterName}>Производители</h3>
                    <ul>
                        <li className={styles.filterOption}>
                            <label className="filterCheckbox">
                                <input className={styles.filterCheckbox} type='checkbox'/>
                                <p className={classNames(styles.filterOptionTxt, styles.filterTxt)}>EMERSON</p>
                            </label>
                        </li>
                        <li className={styles.filterOption}>
                            <label className="filterCheckbox">
                                <input className={styles.filterCheckbox} type='checkbox'/>
                                <p className={classNames(styles.filterOptionTxt, styles.filterTxt)}>EMERSON</p>
                            </label>
                        </li>
                        <li className={styles.filterOption}>
                            <label className="filterCheckbox">
                                <input className={styles.filterCheckbox} type='checkbox'/>
                                <p className={classNames(styles.filterOptionTxt, styles.filterTxt)}>EMERSON</p>
                            </label>
                        </li>
                        <li className={styles.filterOption}>
                            <label className="filterCheckbox">
                                <input className={styles.filterCheckbox} type='checkbox'/>
                                <p className={classNames(styles.filterOptionTxt, styles.filterTxt)}>EMERSON</p>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </section>;
    }
}

export default ProductsPageFilters;
