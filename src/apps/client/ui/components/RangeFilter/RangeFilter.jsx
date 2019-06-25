import React, { Component } from 'react';

import InputRange from 'react-input-range';

class RangeFilter extends Component {
    state = {
        value4: {
            min: 5,
            max: 10
        }
    }

    render () {
        return <section>
            <InputRange
                maxValue={20}
                minValue={0}
                formatLabel={value => `${value} kg`}
                value={this.state.value4}
                onChange={value => this.setState({ value4: value })}
                onChangeComplete={value => console.log(value)} />
        </section>;
    }
}

export default RangeFilter;