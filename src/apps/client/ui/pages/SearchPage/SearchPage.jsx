import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductsList from '../../components/ProductsList/ProductsList';
import CheckboxFilters from '../../components/CheckboxFilters/CheckboxFilters';

import queryString from 'query-string';

import getWordCaseByNumber from '../../../utils/getWordCaseByNumber';

import { connect } from 'react-redux';
import searchByText from '../../../services/client/searchByText';

import styles from './SearchPage.css';

import noop from '@tinkoff/utils/function/noop';

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    searchByText: payload => dispatch(searchByText(payload))
});

class SearchPage extends Component {
    static propTypes = {
        searchByText: PropTypes.func.isRequired,
        category: PropTypes.object,
        location: PropTypes.object
    };

    static defaultProps = {
        location: {},
        category: {},
        searchByText: noop
    };

    constructor (...args) {
        super(...args);

        const { location: { search } } = this.props;
        const query = queryString.parse(search);

        this.props.searchByText(query.text).then((products) => {
            this.setState({
                products: products,
                filteredProducts: products
            });
        });

        this.state = {
            text: query.text,
            products: [],
            filteredProducts: []
        };
    }

    handleChangeFilters = (activeFilters) => {
        const { products } = this.state;

        activeFilters.length === 0
            ? this.setState({
                filteredProducts: products
            })
            : this.setState({
                filteredProducts: activeFilters
            });
    };

    render () {
        const { products, filteredProducts, text } = this.state;
        const { category } = this.props;

        return <section className={styles.productsWrapp}>
            <div className={styles.productsElemWrapp}>
                <div className={styles.searchInfoWrapper}>
                    <div className={styles.searchInfo}>
                        <div className={styles.searchTxt}>Вы искали “{text}”</div>
                        <div className={styles.searchProductsCount}>
                            Найдено {products.length} {getWordCaseByNumber(products.length, ['товаров', 'товар', 'товара'])}
                        </div>
                    </div>
                </div>
                <span className={styles.contentWrapp}>
                    <CheckboxFilters onFiltersChanged={this.handleChangeFilters} products={products}/>
                    <ProductsList products={filteredProducts} category={category}/>
                </span>
            </div>
        </section>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
