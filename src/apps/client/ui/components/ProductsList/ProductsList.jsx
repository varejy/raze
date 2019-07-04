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
        min: (product, nextProduct) => product.date - nextProduct.date,
        max: (product, nextProduct) => product.date + nextProduct.date
    },
    {
        text: 'От старых к новым',
        id: 'dateOld',
        min: (product, nextProduct) => nextProduct.date - product.date,
        max: (product, nextProduct) => nextProduct.date + product.date
    },
    {
        text: 'От дешевых к дорогим',
        id: 'priceMin',
        min: (product, nextProduct) => (product.discountPrice || product.price) - (nextProduct.discountPrice || nextProduct.price),
        max: (product, nextProduct) => (product.discountPrice || product.price) + (nextProduct.discountPrice || nextProduct.price)
    },
    {
        text: 'От дорогих к дешевым',
        id: 'priceMax',
        min: (product, nextProduct) => (nextProduct.discountPrice || nextProduct.price) - (product.discountPrice || product.price),
        max: (product, nextProduct) => (nextProduct.discountPrice || nextProduct.price) + (product.discountPrice || product.price)
    },
    {
        text: 'По популярности',
        id: 'view',
        min: (product, nextProduct) => product.views - nextProduct.views,
        max: (product, nextProduct) => product.views + nextProduct.views
    }
];

class ProductsList extends Component {
    constructor (props) {
        super(props);

        this.state = {
            products: props.products,
            activeOption: '',
            category: props.category,
            arrowClicked: false
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
            this.setState({ products: nextProps.products }, () => activeOption && this.handleActiveSortClick(activeOption)());
        }
    }

    handleActiveSortClick = activeOption => () => {
        const { products } = this.state;

        const sortOption = find(sort => sort.id === activeOption, SORTING_OPTIONS);

        this.setState({
            products: products.sort(sortOption.min),
            activeOption: activeOption,
            arrowClicked: !this.state.arrowClicked
        });
    };

    render () {
        const { category, products } = this.state;

        return <section className={styles.root}>
            <div className={styles.productsFilter}>
                <div className={styles.filter}>
                    <div className={styles.sortingHeader}>Сортировать:</div>
                    <Select
                        onChange = { this.handleActiveSortClick }
                        getActiveOption = { this.getActiveOption }
                        renderSorting = { this.renderSorting }
                        options = { SORTING_OPTIONS }
                        activeOption = { this.state.activeOption }
                        optionsVisibility = { this.state.arrowClicked }
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
