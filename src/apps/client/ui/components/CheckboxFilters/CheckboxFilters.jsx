import React, { Component } from 'react';
import PropTypes from 'prop-types';

import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import compose from '@tinkoff/utils/function/compose';
import includes from '@tinkoff/utils/array/includes';
import filter from '@tinkoff/utils/array/filter';

import CheckboxFilter from '../CheckboxFilter/CheckboxFilter';

class CheckboxFilters extends Component {
    constructor (props) {
        super(props);

        this.filterParams = {
            activeCompanies: []
        };

        this.state = {
            products: this.props.products,
            options: []
        };
    }
    static propTypes = {
        products: PropTypes.array,
        onFiltersChanged: PropTypes.func
    };

    static defaultProps = {
        products: []
    }

    componentDidMount () {
        const { products } = this.state;
        const options = compose(
            uniq,
            map(product => product.company)
        )(products);

        this.setState({
            options
        });
    }

    handleSaveActiveCompanies = (activeCompanies) => {
        this.filterParams.activeCompanies = activeCompanies;

        this.filterProducts();
    }

    filterProducts = () => {
        const { activeCompanies } = this.filterParams;

        const filteredProducts = filter(product => includes(product.company, activeCompanies), this.state.products);

        this.props.onFiltersChanged(filteredProducts);
    }

    render () {
        const { products, options } = this.state;

        return <section>
            <div>
                <CheckboxFilter
                    key={products.id}
                    onSaveActiveCompanies={this.handleSaveActiveCompanies}
                    title='Производители'
                    options={options}
                />
            </div>
        </section>;
    }
}
export default CheckboxFilters;
