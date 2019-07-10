import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FormFieldRadioImageButtons.css';

import noop from '@tinkoff/utils/function/noop';
import propOr from '@tinkoff/utils/object/propOr';

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
            optionsMap: {}
        };
    }

    handleOptionClick = prop => event => {
        event.preventDefault();
        const { optionsMap } = this.state;
        const nextOptionsMap = {
            [prop]: !optionsMap[prop]
        };

        this.setState({
            optionsMap: nextOptionsMap
        }, () => this.props.onChange(nextOptionsMap));
    };

    render () {
        const { optionsMap } = this.state;
        const { title, options } = this.props.schema;

        return <section className={styles.delivery}>
            <div className={styles.title}>{title}</div>
            <div className={styles.options}>
                {
                    options.map((option, i) => {
                        const isChecked = propOr([i], false, optionsMap);

                        return (
                            <button
                                key={i}
                                onClick={this.handleOptionClick(i)}
                                className={classNames(styles.buttonDefault, styles.optionButton, { [styles.optionButtonActive]: isChecked })}
                            >
                                <img className={styles.optionImg} src={option} alt={option} />
                            </button>
                        );
                    })
                }
            </div>
        </section>;
    }
}

export default FormFieldDeliveryType;
