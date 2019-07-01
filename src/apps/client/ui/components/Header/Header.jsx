import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Search from '../Search/Search';

import { Link, NavLink, withRouter } from 'react-router-dom';

import styles from './Header.css';
import openBasketPopup from '../../../actions/openBasketPopup';
import classNames from 'classnames';

const mapStateToProps = ({ application, savedProducts }) => {
    return {
        categories: application.categories,
        basket: savedProducts.basket,
        liked: savedProducts.liked
    };
};
const mapDispatchToProps = (dispatch) => ({
    openBasketPopup: (payload) => dispatch(openBasketPopup(payload))
});

class Header extends Component {
    static propTypes = {
        categories: PropTypes.array,
        openBasketPopup: PropTypes.func.isRequired,
        basket: PropTypes.array.isRequired,
        liked: PropTypes.array.isRequired
    };

    static defaultProps = {
        categories: [],
        basket: [],
        liked: []
    };

    handleOpenBasket = () => {
        this.props.openBasketPopup();
    };

    render () {
        const { categories } = this.props;
        const basketAmount = this.props.basket.length;
        const likedAmount = this.props.liked.length;

        return <div className={styles.headerContainer}>
            <div className={styles.headerTop}>
                <Link className={styles.logo} to='/'>
                    <div className={styles.logoLeft}>raze</div>
                    <div className={styles.logoRight}>Your<br/>knife<br/><div className={styles.logoGreen}>world</div></div>
                </Link>
                <div className={styles.searchForm}>
                    <Search />
                </div>
                <div className={styles.contactsWrapper}>
                    <div className={styles.contacts}>
                        <div className={styles.contactsLicense}>
                            <div>Лицензионное соглашение</div>
                        </div>
                        <div className={styles.tollEmail}>
                            <div className={styles.toll}>
                                <a href="tel:+38 (044) 232 13 14" className={styles.link}>
                                    <div className={styles.iconWrapper}>
                                        <img className={styles.iconPhone} src='/src/apps/client/ui/components/Header/images/iPhone.png' alt=''/>
                                        <img className={styles.colorElement} src='/src/apps/client/ui/components/Header/images/colorElement1.png' alt=''/>
                                    </div>
                                    <div>+38 (044) 232 13 14</div>
                                </a>
                            </div>
                            <div className={styles.email}>
                                <a href="mailto:info@oneblade.org" className={styles.link}>
                                    <div className={styles.iconWrapper}>
                                        <img className={styles.iconMail} src='/src/apps/client/ui/components/Header/images/mail.png' alt=''/>
                                        <img className={styles.colorElement} src='/src/apps/client/ui/components/Header/images/colorElement2.png' alt=''/>
                                    </div>
                                    <div>info@oneblade.org</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.headerBottom}>
                <div className={styles.menu}>
                    <ul className={styles.menuList}>
                        { categories.map((category, i) =>
                            <NavLink className={styles.menuListCategory}
                                activeClassName={styles.menuListCategoryActive}
                                key={i} to={`/${category.path}`}>{category.name}
                            </NavLink>) }
                    </ul>
                </div>
                <div className={styles.likesBasket}>
                    <div className={classNames(
                        styles.bottomIconWrapper,
                        likedAmount > 9 && styles.ordersCounterBig,
                        likedAmount > 99 && styles.ordersCounterHuge,
                        likedAmount > 999 && styles.ordersCounterHugePlus
                    )}
                    >
                        <img className={styles.iconHeart} src='/src/apps/client/ui/components/Header/images/likeHeart.png' alt=''/>
                        {likedAmount > 0 &&
                        <div className={classNames(styles.ordersCounter, styles.likedAmount)}>
                            <div className={styles.ordersNumber}>{likedAmount < 1000 ? likedAmount : '999+' }</div>
                        </div>}
                    </div>
                    <div className={classNames(
                        styles.bottomIconWrapper,
                        basketAmount > 9 && styles.ordersCounterBig,
                        basketAmount > 99 && styles.ordersCounterHuge,
                        basketAmount > 999 && styles.ordersCounterHugePlus
                    )}
                    onClick={this.handleOpenBasket}
                    >
                        <img className={styles.iconBasket} src='/src/apps/client/ui/components/Header/images/basket.png' alt=''/>
                        {basketAmount > 0 &&
                        <div className={classNames(styles.ordersCounter, styles.basketAmount)}>
                            <div className={styles.ordersNumber}>{basketAmount < 1000 ? basketAmount : '999+' }</div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
