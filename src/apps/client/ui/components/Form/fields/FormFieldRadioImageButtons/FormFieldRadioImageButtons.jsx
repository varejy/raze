import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FormFieldRadioImageButtons.css';

import noop from '@tinkoff/utils/function/noop';

class FormFieldDeliveryType extends Component {
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
        const { title, options } = this.props.schema;
        const { value } = this.props;
        const check = (prop) => value === prop;

        return <section className={styles.delivery}>
            <div className={styles.title}>{title}</div>
            <div className={styles.options}>
                {
                    options.map((option, i) => {
                        return (
                            <button
                                key={i}
                                onClick={this.handleOptionChange(option.id)}
                                className={classNames(styles.buttonDefault, styles.optionButton, { [styles.optionButtonActive]: check(option.id) })}
                            >
                                <img className={styles.optionImg} src={option.img} alt={option.id} />
                            </button>
                        );
                    })
                }
            </div>
        </section>;
    }
}

export default FormFieldDeliveryType;
