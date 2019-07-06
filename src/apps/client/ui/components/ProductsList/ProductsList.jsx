import React, { Component } from 'react';
import PropTypes from 'prop-types';

import find from '@tinkoff/utils/array/find';

import Product from '../Product/Product';
import Select from '../Select/Select';

import { withRouter } from 'react-router-dom';

import styles from './ProductsList.css';

const SORTING_OPTIONS = [
    {
        text: 'От новых к старым',
        id: 'dateNew',
        sort: (product, nextProduct) => nextProduct.date - product.date
    },
    {
        text: 'От старых к новым',
        id: 'dateOld',
        sort: (product, nextProduct) => product.date - nextProduct.date
    },
    {
        text: 'От дешевых к дорогим',
        id: 'priceMin',
        sort: (product, nextProduct) => (product.discountPrice || product.price) - (nextProduct.discountPrice || nextProduct.price)
    },
    {
        text: 'От дорогих к дешевым',
        id: 'priceMax',
        sort: (product, nextProduct) => (nextProduct.discountPrice || nextProduct.price) - (product.discountPrice || product.price)
    },
    {
        text: 'По популярности',
        id: 'view',
        min: (product, nextProduct) => nextProduct.views - product.views
    }
];

class ProductsList extends Component {
    constructor (props) {
        super(props);

        this.state = {
            products: props.products,
            activeOption: '',
            category: props.category
        };
    }

    static propTypes = {
        category: PropTypes.object.isRequired,
        products: PropTypes.array
    };

    static defaultProps = {
        products: []
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.products !== this.props.products) {
            const { activeOption } = this.state;

            this.setState({
                products: nextProps.products,
                category: nextProps.category
            }, () => activeOption && this.handleActiveSortClick(activeOption)());
        }
    }

    componentDidMount () {
        this.handleActiveSortClick(SORTING_OPTIONS[0].id)();
    }

    handleActiveSortClick = activeOption => () => {
        const { products } = this.state;
        const sortOption = find(sort => sort.id === activeOption, SORTING_OPTIONS);

        this.setState({
            products: products.sort(sortOption.sort),
            activeOption
        });
    };

    render () {
        const { category, products, activeOption } = this.state;

        return <section className={styles.root}>
            <div className={styles.productsFilter}>
                <div className={styles.filter}>
                    <div className={styles.sortingHeader}>Сортировать:</div>
                    <Select
                        onChange={this.handleActiveSortClick}
                        options={SORTING_OPTIONS}
                        activeOption={activeOption}
                    />
                </div>
            </div>
            <div className={styles.productsWrapper}>
                {
                    products.map((product, i) => {
                        return (
                            <Product
                                key={i}
                                product={product}
                                category={category}
                            />
                        );
                    })
                }
            </div>
        </section>;
    }
}

export default withRouter(ProductsList);
