import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './ProductsPageFilter.css';

class ProductsPageFilter extends Component {
    static propTypes = {
        title: PropTypes.string,
        options: PropTypes.array,
        activeFilters: PropTypes.func
    };

    static defaultProps = {
        title: '',
        options: []
    };

    state = {
        optionsMap: {}
    }

    handleLabelChecked = (company) => () => {
        const { optionsMap } = this.state;
        const { options } = this.props;

        this.setState({
            optionsMap: {
                ...optionsMap,
                [company]: !optionsMap.company
            }
        });

        this.props.activeFilters(optionsMap, options);
    }

    render () {
        const { title, options } = this.props;
        const { optionsMap } = this.state;

        return <div className={styles.filter}>
            <h3 className={classNames(styles.filterName, styles.filterTxt)}>{title}</h3>
            <ul className={styles.ul}>
                {
                    options.map((company, i) => {
                        return (
                            <li className={styles.filterOption} key={i}>
                                <label className={classNames('filterCheckbox', styles.label)} onChange={this.handleLabelChecked(company, i)}>
                                    <input className={styles.filterCheckbox} type='checkbox' value={optionsMap[company]}/>
                                    <span
                                        className={classNames(styles.filterOptionTxt, styles.filterTxt)}>
                                        {company}
                                    </span>
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
