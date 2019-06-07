import React, { Component } from 'react';

import filtersNav from './filtersNav';

import ProductsPageFilter from '../ProductsPageFilter/ProductsPageFilter';
import styles from './ProductsPageFilters.css';

class ProductsPageFilters extends Component {
    state = {
        filters: filtersNav
    };

    render () {
        const { filters } = this.state;
        return <section className={styles.filters}>
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
