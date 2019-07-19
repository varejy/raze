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
            basket: [],
            sendStat: {}
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

    handleVisibleMessage = state => {
        this.setState({
            sendStat: state
        });
    }

    render () {
        const values = this.getBasketStat();
        const { sendStat } = this.state;

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
            <Order onVisibleMessage={this.handleVisibleMessage}/>
            {
                sendStat.status === 'done'
                    ? sendStat.paymentType === 'cod'
                        ? <div className={styles.blurryWrapp}>
                            <div className={styles.messageWrapp}>
                                <img className={styles.image} src="/src/apps/client/ui/components/Order/icons/ok.svg" alt="checked" />
                                <div className={styles.txt}>Ваш заказ успешно отправлен</div>
                            </div>
                        </div>
                        : <div className={styles.blurryWrapp}>
                            <div className={styles.messageWrapp}>
                                <div className={classNames(styles.imageWrapp, styles.imageWrappCard)}>
                                    <img className={styles.imageCard} src="/src/apps/client/ui/components/Order/icons/credit-card.svg" alt="credit-card" />
                                </div>
                                <div className={styles.txt}>
                                    Ваш заказ будет отправлен отправлен после того как вы вышлете сумму на карту
                                </div>
                                <div className={styles.cardTxt}>5432 6324 6432 2346</div>
                            </div>
                        </div>
                    : sendStat.status === 'err' && <div className={styles.blurryWrapp}>
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

export default connect(mapStateToProps)(OrderPage);
