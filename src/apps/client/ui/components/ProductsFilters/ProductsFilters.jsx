import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CheckboxFilter from './filters/CheckboxFilter/CheckboxFilter';
import RangeFilter from './filters/RangeFilter/RangeFilter';

import compose from '@tinkoff/utils/function/compose';
import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import filterUtil from '@tinkoff/utils/array/filter';
import flatten from '@tinkoff/utils/array/flatten';
import getMinOfArray from '../../../utils/getMinOfArray';
import getMaxOfArray from '../../../utils/getMaxOfArray';

import styles from './ProductsFilters.css';

const DEFAULT_FILTERS = [
    {
        name: 'Компании',
        type: 'checkbox',
        options: []
    },
    {
        name: 'Цена',
        type: 'range',
        min: 0,
        max: 0
    }
];

class ProductsFilters extends Component {
    constructor (props) {
        super(props);

        this.state = {
            filters: flatten([
                this.defaultFilters(),
                this.getFilters()
            ])
        };
        this.filtersMap = {};
    }

    static propTypes = {
        products: PropTypes.array
    };

    static defaultProps = {
        products: []
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.products !== this.props.products) {
            this.setState({
                filters: flatten([
                    this.defaultFilters(nextProps),
                    this.getFilters(nextProps)
                ])
            });
        }
    }

    defaultFilters = (props = this.props) => {
        const { products } = props;

        return DEFAULT_FILTERS.map((filter) => {
            switch (filter.type) {
            case 'checkbox':
                let options = compose(
                    uniq,
                    map(product => product.company)
                )(products);

                return {
                    ...filter,
                    options
                };
            case 'range':
                const price = compose(
                    uniq,
                    filterUtil(elem => !!elem),
                    flatten,
                    map(product => product.discountPrice
                        ? product.discountPrice
                        : product.price
                    )
                )(products);

                const min = getMinOfArray(price);
                const max = getMaxOfArray(price);

                return {
                    ...filter,
                    min,
                    max
                };
            }
        });
    }

    getFilters = (props = this.props) => {
        return props.category.filters.map((filter, i) => {
            const { products } = props;

            switch (filter.type) {
            case 'checkbox':
                const options = compose(
                    uniq,
                    filterUtil(elem => !!elem),
                    flatten,
                    map(product => product.filters.map(productFilter => filter.id === productFilter.id && productFilter.value))
                )(products);

                return {
                    ...filter,
                    options
                };
            case 'range':
                const propsArr = compose(
                    uniq,
                    filterUtil(elem => !!elem),
                    flatten,
                    map(product => product.filters
                        .map(productFilter => filter.id === productFilter.id && productFilter.value)
                    )
                )(products);

                const min = getMinOfArray(propsArr);
                const max = getMaxOfArray(propsArr);

                return {
                    ...filter,
                    min,
                    max
                };
            }
        });
    };

    handleFilter = filter => values => {
        this.filtersMap[filter.id] = {
            filter,
            values
        };
    };

    renderFilter = filter => {
        switch (filter.type) {
        case 'checkbox':
            return <CheckboxFilter filter={filter} onFilter={this.handleFilter(filter)} />;
        case 'range':
            return <RangeFilter filter={filter} onFilter={this.handleFilter(filter)} />;
        }
        return null;
    };

    render () {
        const { filters } = this.state;

        return <section>
            { filters.map((filter, i) => <div className={styles.filter} key={i}>
                {this.renderFilter(filter)}
            </div>) }
        </section>;
    }
}
export default ProductsFilters;
