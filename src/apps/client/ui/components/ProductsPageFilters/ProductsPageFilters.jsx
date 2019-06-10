import React, { Component } from 'react';

import filtersNav from './filtersNav';

import ProductsPageFilter from '../ProductsPageFilter/ProductsPageFilter';

class ProductsPageFilters extends Component {
    state = {
        filters: filtersNav
    };

    render () {
        const { filters } = this.state;

        return <section>
            <div>
                {
                    filters.map((filter, i) => {
                        return (
                            <ProductsPageFilter key={i} title={filter.name} options={filter.options}/>
                        );
                    })
                }
            </div>
        </section>;
    }
}
export default ProductsPageFilters;
