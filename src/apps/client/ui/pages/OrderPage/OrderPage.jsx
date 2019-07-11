import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getWordCaseByNumber from '../../../utils/getWordCaseByNumber';

import { connect } from 'react-redux';

import styles from './OrderPage.css';

const mapStateToProps = ({ savedProducts }) => {
    return {
        basket: savedProducts.basket
    };
};

class OrderPage extends Component {
    static propTypes = {
        basket: PropTypes.array
    };

    static defaultProps = {
        basket: []
    };

    constructor (props) {
        super(props);

        this.state = {
            productsMap: {}
        };

        this.productsCount = 0;
    }

    getProductsCount = (arr) => {
        const count = (oldElem, nextElem) => oldElem + nextElem;
        this.productsCount = arr.reduce(count);
    }

    componentDidMount = () => {
        this.setProductsMap();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.setProductsMap();
        }
    }

    setProductsMap = () => {
        const { basket } = this.props;
        const productsCount = [];
        const productsMap = basket.reduce((acc, productInfo, i) => {
            productsCount.push(productInfo.count);
            acc[i] = productInfo.count;
            return acc;
        }, {});

        this.setState({
            productsMap
        });
        this.getProductsCount(productsCount);
    };

    totalPrice = () => {
        const { basket } = this.props;
        const { productsMap } = this.state;

        return basket.reduce((acc, productInfo, i) => {
            return acc + (productInfo.product.discountPrice || productInfo.product.price) * productsMap[i];
        }, 0);
    };

    render () {
        const { productsCount } = this;

        return <section className={styles.orderPage}>
            <div className={styles.orderTitle}>оформление заказа</div>
            <div
                className={classNames(styles.text)}
            >
                {this.totalPrice()} грн за {productsCount} {getWordCaseByNumber(productsCount, ['товаров', 'товар', 'товара'])}
            </div>
            <Order/>
        </section>;
    }
}

export default connect(mapStateToProps, null)(OrderPage);
