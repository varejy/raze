import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import compose from '@tinkoff/utils/function/compose';
import keys from '@tinkoff/utils/object/keys';
import pickBy from '@tinkoff/utils/object/pickBy';

import styles from './CheckboxFilter.css';

class CheckboxFilter extends Component {
    static propTypes = {
        title: PropTypes.string,
        options: PropTypes.array,
        onSaveActiveCompanies: PropTypes.func.isRequired
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

        const nextOptionsMap = {
            ...optionsMap,
            [company]: !optionsMap[company]
        };

        this.setState({
            optionsMap: nextOptionsMap
        });

        const activeCompanies = compose(
            keys,
            pickBy(Boolean)
        )(nextOptionsMap);

        this.props.onSaveActiveCompanies(activeCompanies);
    }

    render () {
        const { title, options } = this.props;
        const { optionsMap } = this.state;

        return <div className={styles.filter}>
            <h3 className={classNames(styles.filterName, styles.filterTxt)}>{title}</h3>
            <ul className={styles.list}>
                {
                    options.map((company, i) => {
                        const value = optionsMap[company];

                        return (
                            <li className={styles.filterOption} key={i}>
                                <label className={styles.label} onChange={this.handleLabelChecked(company)}>
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
