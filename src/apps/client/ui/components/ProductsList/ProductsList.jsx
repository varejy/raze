import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import find from '@tinkoff/utils/array/find';

import Product from '../Product/Product';

import { Link, withRouter } from 'react-router-dom';

import styles from './ProductsList.css';

const SORTING_OPTIONS = [
    {
        text: 'Дате',
        id: 'date',
        min: (product, nextProduct) => product.date - nextProduct.date,
        max: (product, nextProduct) => product.date + nextProduct.date
    },
    {
        text: 'Цене',
        id: 'price',
        min: (product, nextProduct) => product.price - nextProduct.price,
        max: (product, nextProduct) => product.price + nextProduct.price
    },
    {
        text: 'Популярности',
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
            activeOption: ''
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
            activeOption: activeOption
        });
    }

    render () {
        const { products, activeOption } = this.state;

        return <section className={styles.root}>
            <div className={styles.productsFilter}>
                <div className={styles.filter}>
                    <div>Сортировать по:</div>
                    <div className={styles.filterWrapp}>
                        {
                            SORTING_OPTIONS.map((option, i) => {
                                const isActive = activeOption === option.id;

                                return (
                                    <div
                                        key={i}
                                        className={classNames(styles.filterItem, { [styles.filterItemActive]: isActive })}
                                        onClick={this.handleActiveSortClick(option.id)}>
                                        {option.text}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styles.productsWrapper}>
                {
                    products.map(product => {
                        return (
                            <Link className={styles.link} key={product.id} to={`/${this.props.category.path}/${product.id}`}>
                                <Product
                                    product={product}
                                />
                            </Link>
                        );
                    })
                }
            </div>
        </section>;
    }
}

export default withRouter(ProductsList);
