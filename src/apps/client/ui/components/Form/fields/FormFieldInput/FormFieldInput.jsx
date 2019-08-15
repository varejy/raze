import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';

import styles from './FormFieldInput.css';

const MAX_LENGTH = 1000;

export default class FormFieldInput extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
        validationMessage: PropTypes.string,
        schema: PropTypes.object,
        isRequired: PropTypes.bool,
        onChange: PropTypes.func,
        onBlur: PropTypes.func
    };

    static defaultProps = {
        value: '',
        validationMessage: '',
        schema: {},
        isRequired: false,
        onChange: noop,
        onBlur: noop
    };

    state = {
        maxLength: this.props.schema.maxLength || MAX_LENGTH
    };

    handleChange = event => {
        this.props.onChange(event.target.value);
    };

    handleBlur = () => {
        this.props.onBlur();
    };

    render () {
        const { value, name, schema, isRequired, validationMessage } = this.props;
        const { maxLength } = this.state;
        const type = schema.type || 'text';

        return <div>
            <input
                name={name}
                value={value}
                placeholder={isRequired ? `${schema.placeholder}*` : schema.placeholder}
                className={classNames(styles.input, {
                    [styles.inputInvalid]: !!validationMessage,
                    [styles.smallVersion]: schema.theme === 'smallVersion'
                })}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                maxLength={maxLength}
                type={type}
                autoComplete='off'
            />
        </div>;
    }
}
