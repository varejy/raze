import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FormFieldRadioButtons.css';

import noop from '@tinkoff/utils/function/noop';

class FormFieldPaymentType extends Component {
    static propTypes = {
        schema: PropTypes.object,
        value: PropTypes.any,
        onChange: PropTypes.func
    };

    static defaultProps = {
        value: '',
        schema: {},
        onChange: noop
    };

    handleOptionChange = prop => () => {
        this.props.onChange(prop);
    };

    render () {
        const { name, title, options } = this.props.schema;
        const { value } = this.props;
        const check = (event) => value === event;

        return <section className={styles.payment}>
            <div>{title}</div>

            <div className={styles.options}>
                {
                    options.map((option, i) => {
                        return (
                            <div key={i}>
                                <label className={styles.option}>
                                    <input
                                        type="radio"
                                        name={name}
                                        className={classNames(styles.input, styles.radioButton)}
                                        value={option.value}
                                        onChange={this.handleOptionChange(i)}
                                        checked={check(option.id)}
                                    />
                                    <div className={classNames(styles.radioButton, { [styles.radioButtonActive]: check(option.id) })} />
                                    <div>{option.value}</div>
                                </label>
                            </div>
                        );
                    })
                }
            </div>
        </section>;
    }
}

export default FormFieldPaymentType;
