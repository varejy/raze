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
import split from '@tinkoff/utils/string/split';
import reduceObj from '@tinkoff/utils/object/reduce';
import reduce from '@tinkoff/utils/array/reduce';
import prop from '@tinkoff/utils/object/prop';
import object from '@tinkoff/utils/is/object';
import includes from '@tinkoff/utils/array/includes';
import flatten from '@tinkoff/utils/array/flatten';
import any from '@tinkoff/utils/array/any';
import getMinOfArray from '../../../utils/getMinOfArray';
import getMaxOfArray from '../../../utils/getMaxOfArray';
import classNames from 'classnames';

import queryString from 'query-string';

import { withRouter } from 'react-router-dom';

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
            ]),
            reload: false
        };
        this.filtersMap = {};

        this.getQueryParametrs();
    }

    static propTypes = {
        onFilter: PropTypes.func.isRequired,
        products: PropTypes.array,
        location: PropTypes.object,
        history: PropTypes.object
    };

    static defaultProps = {
        products: [],
        location: {},
        history: {}
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.products !== this.props.products) {
            this.setState({
                filters: flatten([
                    this.getDefaultFilters(nextProps),
                    this.getFilters(nextProps)
                ])
            });
        } else if (nextProps.location.search !== this.props.location.search) {
            this.setState({
                filters: flatten([
                    this.getDefaultFilters(nextProps),
                    this.getFilters(nextProps)
                ]),
                reload: true
            }, () => { this.setState({ reload: false }); });
            this.filtersMap = {};
            this.getQueryParametrs(nextProps);
        }
    }

    getQueryParametrs = (props = this.props) => {
        const { filters } = this.state;
        const { location: { search } } = props;
        const query = queryString.parse(search);

        for (const key in query) {
            filters.forEach(filter => {
                if (filter.id === key) {
                    const values = split(',', query[key]);

                    if (filter.type === 'checkbox') {
                        const findValues = reduce((acc, option) => {
                            if (includes(option, values)) {
                                return [...acc, option];
                            }
                            return acc;
                        }, [], filter.options);
                        this.filtersMap[filter.id] = {
                            filter,
                            values: findValues
                        };
                    } else {
                        this.filtersMap[filter.id] = {
                            filter,
                            values: {
                                min: +values[0],
                                max: +values[1]
                            }
                        };
                    }
                }
            });
        }
        this.filter();
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
                const optionsInProduct = compose(
                    uniq,
                    filterUtil(elem => !!elem),
                    flatten,
                    map(product => product.filters.map(productFilter => filter.id === productFilter.id && productFilter.value))
                )(products);
                const options = filterUtil(option => any(optionInProduct => option === optionInProduct, optionsInProduct), filter.options);

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

                if (propsArr.length < 2) {
                    return filters;
                }

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
        const { location, history } = this.props;
        const { filtersMap } = this;

        this.filtersMap[filter.id] = {
            filter,
            values
        };

        const queries = reduceObj((acc, filter) => {
            return {
                ...acc,
                [filter.filter.id]: filter.filter.type === 'checkbox'
                    ? reduce((acc, value) => {
                        return acc + ',' + value;
                    }, '', filter.values).substring(1)
                    : `${filter.values.min},${filter.values.max}`
            };
        }, {}, filtersMap);

        const stringifyedQueries = queryString.stringify(queries, { encodeURIComponent: uri => uri });

        history.push(`${location.pathname}?${stringifyedQueries}`);

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
        const queryFilter = this.filtersMap[filter.id];

        switch (filter.type) {
        case 'checkbox':
            if (object(queryFilter)) {
                const newValues = queryFilter.values.reduce((acc, value) => {
                    return {
                        ...acc,
                        [value]: !acc[value]
                    };
                }, []);
                return <CheckboxFilter filter={filter} queryFilter={newValues} onFilter={this.handleFilter(filter)} />;
            } else {
                return <CheckboxFilter filter={filter} onFilter={this.handleFilter(filter)} />;
            }
        case 'range':
            if (object(queryFilter)) {
                return <RangeFilter filter={filter} queryValues={queryFilter} onFilter={this.handleFilter(filter)} />;
            } else {
                return <RangeFilter filter={filter} onFilter={this.handleFilter(filter)} />;
            }
        }
        return null;
    };

    handleFilterClick = () => {
        this.setState({ filtersVisible: !this.state.filtersVisible });
    };

    render () {
        const { filters, filtersVisible, reload } = this.state;

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
                    !reload && filters.map((filter, i) => <div key={i}>
                        {this.renderFilter(filter)}
                    </div>)
                }
            </section>
        </div>;
    }
}
export default withRouter(ProductsFilters);
