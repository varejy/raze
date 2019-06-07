import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './ProductsPageFilter.css';

class ProductsPageFilter extends Component {
    static propTypes = {
        title: PropTypes.string,
        options: PropTypes.array
    };

    static defaultProps = {
        title: '',
        options: []
    };
    render () {
        const { title, options } = this.props;
        return <div className={styles.filter}>
            <h3 className={classNames(styles.filterName, styles.filterTxt)}>{title}</h3>
            <ul className={styles.ul}>
                {
                    options.map((manufacturer, i) => {
                        return (
                            <li className={styles.filterOption} key={i}>
                                <label className={classNames('filterCheckbox', styles.label)}>
                                    <input className={styles.filterCheckbox} type='checkbox' />
                                    <span className={classNames(styles.filterOptionTxt, styles.filterTxt)}>{manufacturer}</span>
                                </label>
                            </li>
                        );
                    })
                }
            </ul>
        </div>;
    }
}

export default ProductsPageFilter;
