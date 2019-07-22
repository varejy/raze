import React, { Component } from 'react';

import styles from './License.css';
import closeLicensePopup from '../../../actions/closeLicensePopup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Scroll from '../Scroll/Scroll';
import classNames from 'classnames';

const mapStateToProps = ({ popup }) => {
    return {
        licenseVisible: popup.licenseVisible
    };
};

const mapDispatchToProps = (dispatch) => ({
    closeLicensePopup: (payload) => dispatch(closeLicensePopup(payload))
});

class License extends Component {
    static propTypes = {
        closeLicensePopup: PropTypes.func.isRequired,
        licenseVisible: PropTypes.bool.isRequired
    };

    static defaultProps = {
        licenseVisible: false
    };

    handleCloseLicense = () => {
        this.props.closeLicensePopup();
    };

    componentDidMount () {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.licenseVisible !== nextProps.licenseVisible) {
            document.body.style.overflowY = nextProps.licenseVisible ? 'hidden' : 'auto';
        }
    };

    componentWillUnmount () {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.props.closeLicensePopup();
        }
    };

    render () {
        const { licenseVisible } = this.props;

        return <div className={classNames(styles.root, {
            [styles.rootVisible]: licenseVisible
        })}>
            <div className={classNames(styles.backing, {
                [styles.backingVisible]: licenseVisible
            })}/>
            <div className={classNames(styles.popupContent, {
                [styles.popupContentVisible]: licenseVisible
            })}>
                <div>
                    <div className={styles.headerContainer}>
                        <div className={styles.header}>доставка и оплата</div>
                        <div className={styles.closeButton} onClick={this.handleCloseLicense}>+</div>
                    </div>
                    <div>
                        <Scroll>
                            <div className={styles.licenseText}>
                                <div className={styles.licenseTextTitle}>Доставка</div>
                                <p className={styles.licenseTextParagraph}>Доставка товара осуществляется курьерскими службами “Новая Почта” и “Укр почта”,
                                    в зависимости от предпочтения клиента.</p>
                                <p className={styles.licenseTextParagraph}>После отправки товара, на телефон, указанный при оформлении заказа,
                                    Вы получите смс с номером накладной.</p>
                                <p className={styles.licenseTextParagraph}>Стоимость доставки рассчитывается согласно тарифам курьерской службы.</p>
                                <p className={classNames(styles.licenseTextParagraph, styles.licenseTextItalics)}>
                                    <span className={styles.licenseTextBold}>Бесплатная доставка</span> осуществляется при заказе свыше 1 500 гривен и
                                    полной предоплате товара (оплата на карту или на сайте).
                                </p>
                                <div className={styles.licenseTextTitle}>Оплата</div>
                                <p className={styles.licenseTextParagraph}>Оплата товара производится в национальной валюте. Вне зависимости от типа товара,
                                    наш менеджер Вам перезвонит и уточнит правильность заполненных данных и выбранный тип оплаты.</p>
                                <p className={styles.licenseTextParagraph}>1. <span className={styles.licenseTextBold}>Наложенный платеж.</span>&#8194;
                                    Если Вы хотите оплатить товар после получения, выберите вариант отправки наложенным платежом.</p>
                                <p className={styles.licenseTextParagraph}>2. <span className={styles.licenseTextBold}>Оплата на карту.</span>&#8194;
                                    При заказе товара, Вы можете выбрать данный способ оплаты, номер карты будет
                                    указан после оформления товара. Обязательно учитывайте комиссию. Товар будет отправлен после полной оплаты товара.</p>
                            </div>
                        </Scroll>

                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(License);
