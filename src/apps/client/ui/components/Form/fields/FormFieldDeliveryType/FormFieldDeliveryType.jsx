import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FormFieldDeliveryType.css';

import noop from '@tinkoff/utils/function/noop';

class FormFieldDeliveryType extends Component {
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

    handleOptionClick = prop => event => {
        event.preventDefault();
        const nextOptionsMap = prop;

        this.setState({
            optionsMap: nextOptionsMap
        }, () => this.props.onChange(this.state.optionsMap));
    };

    render () {
        const { title, options, optionsMap } = this.state;
        const check = (event) => optionsMap === event;

        return <section className={styles.delivery}>
            <div className={styles.title}>{title}</div>

            <div className={styles.options}>
                {
                    options.map((option, i) => {
                        return (
                            <button
                                key={i}
                                onClick={this.handleOptionClick(option.id)}
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
