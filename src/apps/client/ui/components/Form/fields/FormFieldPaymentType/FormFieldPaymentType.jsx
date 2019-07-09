import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FormFieldPaymentType.css';

import noop from '@tinkoff/utils/function/noop';

class FormFieldPaymentType extends Component {
    static propTypes = {
        schema: PropTypes.object,
        onChange: PropTypes.func
    };

    static defaultProps = {
        schema: {},
        onChange: noop
    };

    constructor (props) {
        super(props);

        this.state = {
            title: props.schema.title,
            options: props.schema.options,
            optionsMap: ''
        };
    }

    handleOptionChange = prop => () => {
        const nextOptionsMap = prop;

        this.setState({
            optionsMap: nextOptionsMap
        }, () => this.props.onChange(this.state.optionsMap));
    };

    render () {
        const { title, options, optionsMap } = this.state;
        const check = (event) => optionsMap === event;

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
                                        name="payment"
                                        className={classNames(styles.input, styles.radioButton)}
                                        value={option.value}
                                        onChange={this.handleOptionChange(option.id)}
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
