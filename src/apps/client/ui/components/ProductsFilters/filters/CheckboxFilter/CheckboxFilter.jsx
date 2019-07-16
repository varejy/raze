import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import compose from '@tinkoff/utils/function/compose';
import keys from '@tinkoff/utils/object/keys';
import pickBy from '@tinkoff/utils/object/pickBy';
import propOr from '@tinkoff/utils/object/propOr';

import styles from './CheckboxFilter.css';

class CheckboxFilter extends Component {
    static propTypes = {
        filter: PropTypes.object.isRequired,
        onFilter: PropTypes.func.isRequired
    };

    state = {
        optionsMap: {}
    };

    handleLabelChecked = prop => () => {
        const { optionsMap } = this.state;

        const nextOptionsMap = {
            ...optionsMap,
            [prop]: !optionsMap[prop]
        };

        this.setState({
            optionsMap: nextOptionsMap
        });

        const activeProps = compose(
            keys,
            pickBy(Boolean)
        )(nextOptionsMap);

        this.props.onFilter(activeProps);
    };

    render () {
        const { filter } = this.props;
        const { optionsMap } = this.state;

        return <div className={styles.filter}>
            <h3 className={classNames(styles.filterName, styles.filterTxt)}>{filter.name}</h3>
            <ul className={styles.list}>
                {
                    filter.options.map((prop, i) => {
                        const value = propOr([prop], false, optionsMap);

                        return (
                            <li className={styles.filterOption} key={i}>
                                <label className={styles.label}>
                                    <input
                                        className={styles.input}
                                        onChange={this.handleLabelChecked(prop)}
                                        type='checkbox'
                                        checked={value}
                                    />
                                    <div className={classNames(styles.filterCheckbox, { [styles.filterCheckboxActive]: value })} />
                                    <span className={classNames(styles.filterOptionTxt, styles.filterTxt)}>
                                        {prop}
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
