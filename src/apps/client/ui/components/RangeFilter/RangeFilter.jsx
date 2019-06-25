import React, { Component } from 'react';

import InputRange from 'react-input-range';

import styles from './RangeFilter.css';

class RangeFilter extends Component {
    state = {
        value: {
            min: 345,
            max: 594
        }
    }

    render () {
        return <section>
            <InputRange
                maxValue={2000}
                minValue={124}
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
                value={this.state.value}
                formatLabel={null}
                onChange={value => this.setState({ value })}/>
        </section>;
    }
}

export default RangeFilter;
