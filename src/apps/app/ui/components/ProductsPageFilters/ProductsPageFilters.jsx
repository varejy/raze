import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProductsPageFilter from '../ProductsPageFilter/ProductsPageFilter';

class ProductsPageFilters extends Component {
    static propTypes = {
        filtersNav: PropTypes.array.isRequired
    };

    static defaultProps = {
        filtersNav: []
    };
    render () {
        const { filtersNav } = this.props;
        return <section>
            <div>
                {
                    filtersNav.map((filter, i) => {
                        return (
                            <ProductsPageFilter key={i} title={filter.name} options={filter.options}/>
                        );
                    })
                }
            </div>
        </section>;
    }
}
const mapStateToProps = ({ filters }) => {
    return {
        filtersNav: filters.filtersNav
    };
};

export default connect(mapStateToProps)(ProductsPageFilters);
