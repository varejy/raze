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
            basket: []
        };

        this.productsCount = 0;
    }

    componentDidMount = () => {
        this.setState({ basket: this.props.basket });
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.basket !== nextProps.basket) {
            this.setState({ basket: nextProps.basket });
        }
    }

    getBasketStat = () => {
        const { basket } = this.state;
        return basket.reduce((acc, productInfo, i) => {
            return {
                count: productInfo.count + acc.count,
                price: ((productInfo.product.discountPrice || productInfo.product.price) * productInfo.count) + acc.price
            };
        }, { count: 0, price: 0 });
    };

    render () {
        const values = this.getBasketStat();

        if (!values.count) {
            return <section className={styles.orderPage}><div className={styles.orderTitle}>ваша корзина пуста!</div></section>;
        }

        return <section className={styles.orderPage}>
            <div className={styles.orderTitle}>оформление заказа</div>
            <div
                className={classNames(styles.text)}
            >
                {values.price} грн за {values.count} {getWordCaseByNumber(values.count, ['товаров', 'товар', 'товара'])}
            </div>
            <Order/>
        </section>;
    }
}

export default connect(mapStateToProps)(OrderPage);
