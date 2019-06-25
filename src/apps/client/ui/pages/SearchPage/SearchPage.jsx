import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Products from '../../components/Products/Products';

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

        this.state = {
            text: '',
            products: [],
            loading: true
        };
    }

    componentDidMount () {
        this.searchByText();
    }

    searchByText (props = this.props) {
        const { location: { search } } = props;
        const query = queryString.parse(search);

        this.setState({
            loading: true
        });

        this.props.searchByText(query.text)
            .then((products) => {
                this.setState({
                    text: query.text,
                    products,
                    loading: false
                });
            });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.location !== this.props.location) {
            this.searchByText(nextProps);
        }
    }

    render () {
        const { products, text, loading } = this.state;
        const { category } = this.props;

        if (loading) {
            return <div className={styles.loader}>
                <img src='/src/apps/client/ui/icons/loader.svg' alt='loader'/>
            </div>;
        }

        return <section className={styles.productsWrapp}>
            <div className={styles.productsElemWrapp}>
                <div className={styles.searchInfoWrapper}>
                    <div className={styles.searchInfo}>
                        <div className={styles.searchTxt}>Вы искали “{text}”</div>
                        <div className={styles.searchProductsCount}>
                            {
                                !products.length
                                    ? 'По этому запросу мы не нашли товаров'
                                    : `Найдено ${products.length} ${getWordCaseByNumber(products.length, ['товаров', 'товар', 'товара'])}`
                            }
                        </div>
                    </div>
                </div>
                {
                    !!products.length && <span className={styles.contentWrapp}>
                        <Products products={products} category={category}/>
                    </span>
                }
            </div>
        </section>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
