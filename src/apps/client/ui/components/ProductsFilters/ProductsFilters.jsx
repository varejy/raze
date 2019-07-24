import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CheckboxFilter from './filters/CheckboxFilter/CheckboxFilter';
import RangeFilter from './filters/RangeFilter/RangeFilter';
import styles from './ProductsFilters.css';

import compose from '@tinkoff/utils/function/compose';
import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import filterUtil from '@tinkoff/utils/array/filter';
import find from '@tinkoff/utils/array/find';
import reduceObj from '@tinkoff/utils/object/reduce';
import prop from '@tinkoff/utils/object/prop';
import includes from '@tinkoff/utils/array/includes';
import flatten from '@tinkoff/utils/array/flatten';
import getMinOfArray from '../../../utils/getMinOfArray';
import getMaxOfArray from '../../../utils/getMaxOfArray';
import classNames from 'classnames';

const DEFAULT_FILTERS = [
    {
        name: 'Компании',
        type: 'checkbox',
        options: [],
        id: 'company',
        prop: 'company'
    },
    {
        name: 'Цена',
        type: 'range',
        min: 0,
        max: 0,
        id: 'price',
        prop: 'price'
    }
];

class ProductsFilters extends Component {
    state = {
        filtersVisible: null
    };

    constructor (props) {
        super(props);

        this.state = {
            filters: flatten([
                this.getDefaultFilters(),
                this.getFilters()
            ])
        };
    }

    static propTypes = {
        onFilter: PropTypes.func.isRequired,
        products: PropTypes.array
    };

    static defaultProps = {
        products: [],
        media: {}
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.products !== this.props.products) {
            this.setState({
                filters: flatten([
                    this.getDefaultFilters(nextProps),
                    this.getFilters(nextProps)
                ])
            });
        }
    }

    getFilterValue = (product, filter) => {
        const productFilterValue = compose(
            prop('value'),
            find(productFilter => productFilter.id === filter.id)
        )(product.filters);

        return filter.prop ? product[filter.prop] : productFilterValue;
    };

    getDefaultFilters = (props = this.props) => {
        const { products } = props;

        return DEFAULT_FILTERS.reduce((filters, filter) => {
            switch (filter.type) {
            case 'checkbox':
                const options = compose(
                    uniq,
                    map(product => product.company)
                )(products);

                return options.length > 1 ? [
                    ...filters,
                    {
                        ...filter,
                        options
                    }
                ] : filters;
            case 'range':
                const prices = compose(
                    uniq,
                    map(product => product.discountPrice
                        ? product.discountPrice
                        : product.price
                    )
                )(products);

                const min = getMinOfArray(prices);
                const max = getMaxOfArray(prices);

                return min !== max ? [
                    ...filters,
                    {
                        ...filter,
                        min,
                        max
                    }
                ] : filters;
            default:
                return [];
            }
        }, []);
    };

    getFilters = (props = this.props) => {
        if (!props.category.filters) {
            return [];
        }

        return props.category.filters.reduce((filters, filter) => {
            const { products } = props;

            switch (filter.type) {
            case 'checkbox':
                const options = compose(
                    uniq,
                    filterUtil(elem => !!elem),
                    flatten,
                    map(product => product.filters.map(productFilter => filter.id === productFilter.id && productFilter.value))
                )(products);

                return options.length > 1 ? [
                    ...filters,
                    {
                        ...filter,
                        options
                    }
                ] : filters;
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

                return min !== max ? [
                    ...filters,
                    {
                        ...filter,
                        min,
                        max
                    }
                ] : filters;
            default:
                return filters;
            }
        }, []);
    };

    handleFilter = filter => values => {
        this.filtersMap[filter.id] = {
            filter,
            values
        };

        this.filter();
    };

    filter = () => {
        const { products } = this.props;
        const newFilteredProducts = reduceObj((filteredProducts, { filter, values }) => {
            switch (filter.type) {
            case 'checkbox':
                return !values.length
                    ? filteredProducts
                    : filterUtil(product => {
                        const value = this.getFilterValue(product, filter);

                        return includes(value, values);
                    }, filteredProducts);
            case 'range':
                return filterUtil(product => {
                    const value = this.getFilterValue(product, filter);

                    return values.min <= value && value <= values.max;
                }, filteredProducts);
            default:
                return filteredProducts;
            }
        }, products, this.filtersMap);

        this.props.onFilter(newFilteredProducts);
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

    handleFilterClick = () => {
        this.setState({ filtersVisible: !this.state.filtersVisible });
    };

    render () {
        const { filters, filtersVisible } = this.state;

        return <div>
            {filters.length > 0 && <div className={styles.filterButton} onClick={this.handleFilterClick}>
                {filtersVisible
                    ? <div className={styles.filtersWrapper}>
                        Спрятать фильтры
                        <div className={styles.cross}>+</div>
                    </div>
                    : <div className={styles.filtersWrapper}>
                        Показать фильтры
                        <img className={styles.arrow} src='/src/apps/client/ui/components/ProductsFilters/images/arrowIcon.png' alt='arrow'/>
                    </div>
                }
            </div>}
            <section className={classNames(styles.filtersContainer, {
                [styles.filtersInvisible]: !filtersVisible
            })}>
                {
                    filters.map((filter, i) => <div key={i}>
                        {this.renderFilter(filter)}
                    </div>)
                }
            </section>
        </div>;
    }
}
export default ProductsFilters;
