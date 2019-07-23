import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getWordCaseByNumber from '../../../utils/getWordCaseByNumber';

import { connect } from 'react-redux';
import setBasket from '../../../actions/setBasket';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';

import styles from './OrderPage.css';

const mapStateToProps = ({ savedProducts }) => {
    return {
        basket: savedProducts.basket
    };
};

const mapDispatchToProps = (dispatch) => ({
    setBasket: payload => dispatch(setBasket(payload)),
    saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload))
});

class OrderPage extends Component {
    static propTypes = {
        basket: PropTypes.array,
        setBasket: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired
    };

    static defaultProps = {
        basket: []
    };

    constructor (props) {
        super(props);

        this.state = {
            basket: [],
            order: {}
        };
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

    handleVisibleMessage = ({ status, values }) => {
        if (status === 'done') {
            this.props.setBasket([]);
            this.props.saveProductsToBasket([]);
        }

        this.setState({
            order: {
                status,
                values
            }
        });
    }

    render () {
        const basketStat = this.getBasketStat();
        const { order } = this.state;

        if (!basketStat.count && order.status !== 'done') {
            return <section className={styles.orderPage}><div className={styles.orderTitle}>ваша корзина пуста!</div></section>;
        }

        return <section className={styles.orderPage}>
            <div className={styles.orderTitle}>оформление заказа</div>
            <div
                className={classNames(styles.text)}
            >
                {basketStat.price} грн за {basketStat.count} {getWordCaseByNumber(basketStat.count, ['товаров', 'товар', 'товара'])}
            </div>
            <Order onVisibleMessage={this.handleVisibleMessage}/>
            {
                order.status === 'done' && <div className={styles.blurryWrapp}>
                    {
                        order.values.paymentType === 'cod'
                            ? <div className={styles.messageWrapp}>
                                <img className={styles.image} src="/src/apps/client/ui/components/Order/icons/ok.svg" alt="checked" />
                                <div className={styles.txt}>Ваш заказ успешно отправлен</div>
                            </div>
                            : <div className={styles.messageWrapp}>
                                <div className={classNames(styles.imageWrapp, styles.imageWrappCard)}>
                                    <img className={styles.imageCard} src="/src/apps/client/ui/components/Order/icons/credit-card.svg" alt="credit-card" />
                                </div>
                                <div className={styles.txt}>
                                    Ваш заказ будет отправлен отправлен после того как вы вышлете сумму на карту
                                </div>
                                <div className={styles.cardTxt}>5432 6324 6432 2346</div>
                            </div>
                    }
                </div>
            }
            {
                order.status === 'err' && <div className={styles.blurryWrapp}>
                    <div className={classNames(styles.messageWrapp, styles.errorMessage)}>
                        <div className={classNames(styles.imageWrapp, styles.imageWrappMarginB)}>
                            <img className={styles.imageError} src="/src/apps/client/ui/components/Order/icons/error.svg" alt="checked" />
                        </div>
                        <div className={styles.txt}>Ваш заказ не отправлен ! перезагрузите страницу и попробуйте снова</div>
                    </div>
                </div>
            }
        </section>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);
