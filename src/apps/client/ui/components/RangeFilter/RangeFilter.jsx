import React, { Component } from 'react';
import PropTypes from 'prop-types';

import noop from '@tinkoff/utils/function/noop';
import map from '@tinkoff/utils/array/map';
import filter from '@tinkoff/utils/array/filter';

import InputRange from 'react-input-range';

import styles from './RangeFilter.css';

class RangeFilter extends Component {
    static propTypes = {
        products: PropTypes.array,
        onFiltersChanged: PropTypes.func
    };

    static defaultProps = {
        products: [],
        onFiltersChanged: noop
    };

    state = {
        defaultValue: this.getDefaultPrice(),
        value: this.getPrice()
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.products !== this.props.products) {
            this.setState({
                defaultValue: this.getDefaultPrice(nextProps.products),
                value: {
                    max: this.state.value.max >= Math.max.apply(null, map(product => product.price)(nextProps.products))
                        ? Math.max.apply(null, map(product => product.price)(nextProps.products))
                        : this.state.value.max,
                    min: this.state.value.min <= Math.min.apply(null, map(product => product.price)(nextProps.products))
                        ? Math.min.apply(null, map(product => product.price)(nextProps.products))
                        : this.state.value.min
                }
            });
        }
    }

    getDefaultPrice (products = this.props.products) {
        return {
            min: Math.min.apply(null, map(product => product.price)(products)),
            max: Math.max.apply(null, map(product => product.price)(products))
        };
    }

    getPrice () {
        const { products } = this.props;

        return {
            min: Math.min.apply(null, map(product => product.price)(products)),
            max: Math.max.apply(null, map(product => product.price)(products))
        };
    }

    filterProducts = () => {
        const { value: { min, max } } = this.state;

        const filteredProducts = filter(product => product.price >= min && product.price <= max, this.props.products);

        this.props.onFiltersChanged(filteredProducts, 'RangeFilter');
    };

    handleInputChange = value => this.setState({ value });

    render () {
        const { defaultValue: { min, max }, value } = this.state;

        return <section className={styles.wrapp}>
            <div className={styles.title}>Цена</div>
            <InputRange
                maxValue={max}
                minValue={min}
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
                value={value}
                formatLabel={null}
                onChange={value => this.handleInputChange(value)}
                onChangeComplete={this.filterProducts}/>
        </section>;
    }
}

export default RangeFilter;
