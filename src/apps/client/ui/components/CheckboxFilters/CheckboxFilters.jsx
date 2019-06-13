import React, { Component } from 'react';
import PropTypes from 'prop-types';

import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import compose from '@tinkoff/utils/function/compose';

import CheckboxFilter from '../CheckboxFilter/CheckboxFilter';

class CheckboxFilters extends Component {
    constructor (props) {
        super(props);

        this.state = {
            products: this.props.products,
            options: []
        };
    }
    static propTypes = {
        products: PropTypes.array,
        setInputFilters: PropTypes.func
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
                <CheckboxFilter key={products.id} setInputFilters={this.props.setInputFilters} products={products} title='Производители' options={options}/>
            </div>
        </section>;
    }
}
export default CheckboxFilters;
