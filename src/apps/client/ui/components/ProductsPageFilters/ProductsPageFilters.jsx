import React, { Component } from 'react';
import PropTypes from 'prop-types';

import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import compose from '@tinkoff/utils/function/compose';

import ProductsPageFilter from '../ProductsPageFilter/ProductsPageFilter';

class ProductsPageFilters extends Component {
    constructor (props) {
        super(props);

        this.state = {
            products: this.props.products,
            options: []
        };
    }
    static propTypes = {
        products: PropTypes.array
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

    render () {
        const { products, options } = this.state;

        return <section>
            <div>
                <ProductsPageFilter key={products.id} title='Производители' options={options}/>
            </div>
        </section>;
    }
}
export default ProductsPageFilters;
