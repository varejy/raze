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
    }

    componentDidMount () {
        this.setProductsMap();
    }

    setProductsMap = () => {
        const { basket } = this.props;
        const productsMap = basket.reduce((acc, productInfo, i) => {
            acc[i] = productInfo.count;
            return acc;
        }, {});

        this.setState({ productsMap });
    };

    totalPrice = () => {
        const { basket } = this.props;
        const { productsMap } = this.state;

        return basket.reduce((acc, productInfo, i) => {
            return acc + productInfo.product.discountPrice || productInfo.product.price * productsMap[i];
        }, 0);
    };

    render () {
        const { basket } = this.props;

        return <section className={styles.orderPage}>
            <div className={styles.orderTitle}>оформление заказа</div>
            <div
                className={classNames(styles.text)}
            >
                {this.totalPrice()} грн за {basket.length} {getWordCaseByNumber(basket.length, ['товаров', 'товар', 'товара'])}
            </div>
            <Order/>
        </section>;
    }
}

export default connect(mapStateToProps, null)(OrderPage);
