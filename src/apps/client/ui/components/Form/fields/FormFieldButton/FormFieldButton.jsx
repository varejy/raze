import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';

import styles from './FormFieldButton.css';

export default class FormFieldButton extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        schema: PropTypes.object,
        onClick: PropTypes.func
    };

    static defaultProps = {
        schema: {},
        onClick: noop
    };

    handleClick = event => {
        this.props.onClick(event);
    };

    setRef = name => element => {
        this[name] = element;
    };

    render () {
        const { name, schema } = this.props;

        return <div className={classNames(styles.buttonField, styles[`buttonField_position_${schema.position}`])}>
            <button
                name={name}
                className={classNames(styles.buttonDefault, styles.button, {
                    [styles.uppercase]: schema.uppercase
                })}
                onClick={this.handleClick}
                type={schema.type}
                ref={this.setRef('button')}
            >
                { schema.title }
            </button>
        </div>;
    }
}
