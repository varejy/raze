import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CheckboxFilter from './filters/CheckboxFilter/CheckboxFilter';
import RangeFilter from './filters/RangeFilter/RangeFilter';
import styles from './ProductsFilters.css';

import compose from '@tinkoff/utils/function/compose';
import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import reduceObj from '@tinkoff/utils/object/reduce';
import filterUtil from '@tinkoff/utils/array/filter';
import includes from '@tinkoff/utils/array/includes';
import getMinOfArray from '../../../utils/getMinOfArray';
import getMaxOfArray from '../../../utils/getMaxOfArray';
import { connect } from 'react-redux';

const IS_FILTERS_OPEN_BUTTON_SCREEN_WIDTH = 1169;
const FILTERS = [
    {
        type: 'checkbox',
        prop: 'company',
        title: 'Производитель',
        id: '1'
    },
    {
        type: 'range',
        prop: 'price',
        title: 'Цена',
        id: '2'
    }
];
const mapStateToProps = ({ application }) => {
    return {
        media: application.media
    };
};

class ProductsFilters extends Component {
    state = {
        filtersVisible: false
    };

    constructor (props) {
        super(props);

        this.state = {
            filters: this.getFilters()
        };
        this.filtersMap = {};
    }

    static propTypes = {
        products: PropTypes.array,
        onFilter: PropTypes.func.isRequired,
        media: PropTypes.object.isRequired
    };

    static defaultProps = {
        products: [],
        media: {}
    };

    getFilters = (props = this.props) => {
        return FILTERS.map((filter) => {
            const { products } = props;

            switch (filter.type) {
            case 'checkbox':
                const options = compose(
                    uniq,
                    map(product => product[filter.prop])
                )(products);

                return {
                    ...filter,
                    options
                };
            case 'range':
                const propsArr = map(product => product[filter.prop], products);
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

    filter = () => {
        const { products } = this.props;

        let newFilteredProducts = reduceObj((filteredProducts, { filter, values }) => {
            switch (filter.type) {
            case 'checkbox':
                return !values.length ? filteredProducts : filterUtil(product => includes(product[filter.prop], values), filteredProducts);
            case 'range':
                return filterUtil(product => values.min <= product[filter.prop] && product[filter.prop] <= values.max, filteredProducts);
            default:
                return filteredProducts;
            }
        }, products, this.filtersMap);

        this.props.onFilter(newFilteredProducts);
    };

    handleFilter = filter => values => {
        this.filtersMap[filter.id] = {
            filter,
            values
        };

        this.filter();
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
        const { media } = this.props;
        const isFiltersButton = media.width <= IS_FILTERS_OPEN_BUTTON_SCREEN_WIDTH;

        return <div>
            {isFiltersButton &&
            <div className={styles.filterButton} onClick={this.handleFilterClick}>
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
            </div>
            }
            <section className={styles.filtersContainer}>
                {(!isFiltersButton || filtersVisible) &&
                    filters.map((filter, i) => <div key={i}>
                        {this.renderFilter(filter)}
                    </div>)
                }
            </section>
        </div>;
    }
}
export default connect(mapStateToProps)(ProductsFilters);
