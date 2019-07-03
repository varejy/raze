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

class ProductsFilters extends Component {
    constructor (props) {
        super(props);

        this.state = {
            filters: this.getFilters()
        };
        this.filtersMap = {};
    }

    static propTypes = {
        products: PropTypes.array,
        onFilter: PropTypes.func.isRequired
    };

    static defaultProps = {
        products: []
    };

    getFilters = (props = this.props) => {
        return props.category.filters.map((filter) => {
            const { products } = props;

            switch (filter.type) {
            case 'Checkbox':
                const options = compose(
                    filterUtil(elem => !!elem),
                    flatten,
                    uniq,
                    map(product => product.filters.map(productFilter => filter.id === productFilter.id && productFilter.value))
                )(products);

                return {
                    ...filter,
                    options
                };
            case 'Range':
                const propsArr = compose(
                    filterUtil(elem => !!elem),
                    flatten,
                    uniq,
                    map(product => product.filters.map(productFilter => filter.id === productFilter.id && product.price))
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
        case 'Checkbox':
            return <CheckboxFilter filter={filter} onFilter={this.handleFilter(filter)} />;
        case 'Range':
            return <RangeFilter filter={filter} onFilter={this.handleFilter(filter)} />;
        }
        return null;
    };

    render () {
        const { filters } = this.state;

        return <section>
            { filters.map((filter, i) => <div key={i}>
                {this.renderFilter(filter)}
            </div>) }
        </section>;
    }
}
export default ProductsFilters;
