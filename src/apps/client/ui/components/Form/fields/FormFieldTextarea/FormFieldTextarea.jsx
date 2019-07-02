import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';

import styles from './FormFieldTextarea.css';

const MAX_LENGTH = 3000;

export default class FormFieldTextarea extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        validationMessage: PropTypes.string,
        value: PropTypes.string,
        schema: PropTypes.object,
        isRequired: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        value: '',
        validationMessage: '',
        schema: {},
        isRequired: false,
        onChange: noop
    };

    state = {
        rows: this.props.schema.rows || 1,
        maxLength: this.props.schema.maxLength || MAX_LENGTH
    };

    componentDidMount () {
        this.setState({
            rows: this.getRows(this.state.value)
        });
    }

    componentDidUpdate (prevProps) {
        if (prevProps.value === this.props.value) {
            return;
        }

        this.setState({
            rows: this.getRows()
        });
    }

    getRows () {
        const txt = this.textarea;

        if (txt) {
            txt.rows = this.props.schema.rows || 1;

            do {
                if (txt.clientHeight !== txt.scrollHeight) {
                    txt.rows += 1;
                }
            } while (txt.clientHeight < txt.scrollHeight);

            return txt.rows;
        }
    }

    setRef = name => element => {
        this[name] = element;
    };

    handleChange = event => {
        this.props.onChange(event.target.value);
    };

    render () {
        const { value, name, schema, isRequired, validationMessage } = this.props;
        const { rows, maxLength } = this.state;

        return <div>
            <textarea
                ref={this.setRef('textarea')}
                name={name}
                value={value}
                className={classNames(styles.textarea, {
                    [styles.textareaInvalid]: !!validationMessage
                })}
                placeholder={isRequired ? `${schema.placeholder}*` : schema.placeholder}
                rows={rows}
                maxLength={maxLength}
                onChange={this.handleChange}
            />
        </div>;
    }
}
