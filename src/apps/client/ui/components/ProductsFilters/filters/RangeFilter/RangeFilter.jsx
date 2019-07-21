import React, { Component } from 'react';
import PropTypes from 'prop-types';

import pick from '@tinkoff/utils/object/pick';

import InputRange from 'react-input-range';

import styles from './RangeFilter.css';

const STEP_DIFF = 100;
const BIG_STEP = 1;
const SMALL_STEP = 0.01;

class RangeFilter extends Component {
    static propTypes = {
        filter: PropTypes.object.isRequired,
        onFilter: PropTypes.func.isRequired
    };

    constructor (...args) {
        super(...args);

        const price = this.getDefaultPrice();

        this.state = {
            defaultValue: price,
            step: (price.max - price.min) < STEP_DIFF ? SMALL_STEP : BIG_STEP,
            value: price
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.filter !== this.props.filter) {
            const price = this.getDefaultPrice(nextProps);

            this.setState({
                defaultValue: price,
                step: (price.max - price.min) < STEP_DIFF ? SMALL_STEP : BIG_STEP,
                value: price
            });
        }
    }

    getDefaultPrice (props = this.props) {
        return {
            ...pick(['min', 'max'], props.filter)
        };
    }

    handleInputChange = value => {
        const { defaultValue: { min, max } } = this.state;

        if (value.min < min || value.max > max) {
            return;
        }

        this.setState({ value });
    }

    render () {
        const { defaultValue: { min, max }, value, step } = this.state;
        const { filter } = this.props;

        return <section className={styles.wrapp}>
            <div className={styles.title}>{filter.name}</div>
            <InputRange
                maxValue={+max}
                minValue={+min}
                classNames={{
                    inputRange: styles.inputRange,
                    minLabel: styles.minLabel,
                    maxLabel: styles.maxLabel,
                    labelContainer: styles.labelContainer,
                    valueLabel: styles.label,
                    track: styles.track,
                    activeTrack: styles.activeTrack,
                    sliderContainer: styles.sliderContainer,
                    slider: styles.slider
                }}
                step={step}
                value={value}
                onChange={this.handleInputChange}
                onChangeComplete={this.props.onFilter}
            />
        </section>;
    }
}

export default RangeFilter;
