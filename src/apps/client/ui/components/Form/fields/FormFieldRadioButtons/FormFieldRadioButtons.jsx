import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FormFieldRadioButtons.css';

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
            optionsMap: {}
        };
    }

    handleOptionChange = prop => event => {
        event.preventDefault();
        const nextOptionsMap = prop;

        this.setState({
            optionsMap: nextOptionsMap
        }, () => this.props.onChange(nextOptionsMap));
    };

    render () {
        const { optionsMap } = this.state;
        const check = (event) => optionsMap === event;
        const { name, title, options } = this.props.schema;

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
