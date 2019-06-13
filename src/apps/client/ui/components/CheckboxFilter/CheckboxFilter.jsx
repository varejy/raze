import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import filter from '@tinkoff/utils/array/filter';

import styles from './CheckboxFilter.css';

class CheckboxFilter extends Component {
    static propTypes = {
        title: PropTypes.string,
        options: PropTypes.array,
        products: PropTypes.array,
        setInputFilters: PropTypes.func
    };

    static defaultProps = {
        title: '',
        options: [],
        products: []
    };

    state = {
        optionsMap: {}
    }

    handleLabelChecked = (company) => () => {
        const { optionsMap } = this.state;
        const { products } = this.props;
        var filteredProducts = [];
        var activeCompany = [];

        this.setState({
            optionsMap: {
                ...optionsMap,
                [company]: !optionsMap[company]
            }
        });

        for (var key in optionsMap) {
            if (optionsMap[key] === true) {
                activeCompany.push(key);
            }
        }

        activeCompany.forEach((ActCompany) => {
            filteredProducts = filter(elem => elem.company === ActCompany, products);
        });

        if (filteredProducts === []) {
            this.props.setInputFilters(products);
        } else {
            this.props.setInputFilters(filteredProducts);
        }
    }

    render () {
        const { title, options } = this.props;
        const { optionsMap } = this.state;

        return <div className={styles.filter}>
            <h3 className={classNames(styles.filterName, styles.filterTxt)}>{title}</h3>
            <ul className={styles.ul}>
                {
                    options.map((company, i) => {
                        const value = optionsMap[company];

                        return (
                            <li className={styles.filterOption} key={i}>
                                <label className={classNames('filterCheckbox', styles.label)} onClick={this.handleLabelChecked(company, i)}>
                                    <input className={styles.input} type='checkbox' checked={value}/>
                                    <div className={classNames(styles.filterCheckbox, { [styles.filterCheckboxActive]: value })}></div>
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

export default CheckboxFilter;
