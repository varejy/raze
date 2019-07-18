import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { connect } from 'react-redux';

import Search from '../Search/Search';

import { Link, NavLink, withRouter } from 'react-router-dom';

import styles from './Header.css';
import openBasketPopup from '../../../actions/openBasketPopup';
import openLikedPopup from '../../../actions/openLikedPopup';
import openLicensePopup from '../../../actions/openLicensePopup';
import MenuButton from '../MenuButton/MenuButton';

const SCREEN_WIDTH_BURGER_MENU = 900;
const mapStateToProps = ({ application, savedProducts }) => {
    return {
        categories: application.categories,
        media: application.media,
        basket: savedProducts.basket,
        liked: savedProducts.liked
    };
};
const mapDispatchToProps = (dispatch) => ({
    openBasketPopup: (payload) => dispatch(openBasketPopup(payload)),
    openLikedPopup: (payload) => dispatch(openLikedPopup(payload)),
    openLicensePopup: (payload) => dispatch(openLicensePopup(payload))
});

class Header extends Component {
    state = {
        menuVisible: false,
        searchVisible: false
    };

    static propTypes = {
        categories: PropTypes.array,
        openBasketPopup: PropTypes.func.isRequired,
        openLikedPopup: PropTypes.func.isRequired,
        openLicensePopup: PropTypes.func.isRequired,
        basket: PropTypes.array,
        liked: PropTypes.array,
        media: PropTypes.object.isRequired
    };

    static defaultProps = {
        categories: [],
        basket: [],
        liked: [],
        media: {}
    };

    handleOpenBasket = () => {
        this.props.openBasketPopup();
    };

    handleOpenLiked = () => {
        this.props.openLikedPopup();
    };

    handleOpenLicense = () => {
        this.props.openLicensePopup();
    };

    calculateBasketAmount = () => {
        const { basket } = this.props;

        return basket.reduce((acc, basketItem) => {
            return acc + basketItem.count;
        }, 0);
    };

    handleBurgerMenuClick = () => {
        this.setState({ menuVisible: !this.state.menuVisible });
    };

    handleBurgerCategoryClick = () => {
        this.setState({ menuVisible: false });
    };

    handleOpenSearch = () => {
        this.setState({ searchVisible: !this.state.searchVisible });
    };

    render () {
        const { categories, media } = this.props;
        const { menuVisible, searchVisible } = this.state;
        const basketAmount = this.calculateBasketAmount();
        const likedAmount = this.props.liked.length;
        const isBurgerMenuShowed = media.width <= SCREEN_WIDTH_BURGER_MENU;

        return <div className={styles.headerContainer}>
            <div className={styles.headerTop}>
                <Link className={styles.logo} to='/'>
                    <div className={styles.logoLeft}>raze</div>
                    <div className={styles.logoRight}>Your<br/>knife<br/><div className={styles.logoGreen}>world</div></div>
                </Link>
                {(searchVisible || !isBurgerMenuShowed) &&
                <div className={styles.searchForm}>
                    <Search
                        isMobileVersion = {isBurgerMenuShowed}
                        handleCloseSearch = {this.handleOpenSearch}
                    />
                </div>
                }
                {(isBurgerMenuShowed || menuVisible) &&
                <MenuButton
                    menuVisible = {menuVisible}
                    onClick={this.handleBurgerMenuClick}/>
                }
                {menuVisible && <div className={styles.deliveryPayment} onClick={() => { this.handleBurgerCategoryClick(); this.handleOpenLicense(); }}>
                    <div className={styles.infoLink}>Доставка и оплата</div>
                </div>}
                <div className={classNames(styles.contactsWrapper, {
                    [styles.contactsHidden]: isBurgerMenuShowed,
                    [styles.burgerContacts]: menuVisible
                })}>
                    <div className={styles.contacts}>
                        {!menuVisible && <div
                            className={styles.contactsLicense}
                            onClick={this.handleOpenLicense}>
                            <div>Доставка и оплата</div>
                        </div>}
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
            <div className={classNames(styles.headerBottom)}>
                <div className={classNames(styles.menu, {
                    [styles.burgerMenu]: menuVisible,
                    [styles.menuHidden]: isBurgerMenuShowed,
                    [styles.menuVisible]: menuVisible
                })}>
                    <ul className={styles.menuList}>
                        { categories.map((category, i) =>
                            <NavLink className={styles.menuListCategory}
                                activeClassName={styles.menuListCategoryActive}
                                onClick={this.handleBurgerCategoryClick}
                                key={i} to={`/${category.path}`}>{category.name}
                            </NavLink>) }
                    </ul>
                </div>
                {(!searchVisible || !isBurgerMenuShowed) &&
                <div className={styles.likesBasket}>
                    <div onClick={this.handleOpenLiked} className={classNames(
                        styles.bottomIconWrapper, {
                            [styles.ordersCounterBig]: likedAmount > 9,
                            [styles.ordersCounterHuge]: likedAmount > 99,
                            [styles.ordersCounterHugePlus]: likedAmount > 999
                        })}
                    >
                        <img className={styles.iconHeart}
                            src='/src/apps/client/ui/components/Header/images/likeHeart.png' alt='like'/>
                        {likedAmount > 0 &&
                        <div className={classNames(styles.ordersCounter, styles.likedAmount)}>
                            <div className={styles.ordersNumber}>{likedAmount < 1000 ? likedAmount : '999+'}</div>
                        </div>}
                    </div>
                    <div className={classNames(
                        styles.bottomIconWrapper, {
                            [styles.ordersCounterBig]: basketAmount > 9,
                            [styles.ordersCounterHuge]: basketAmount > 99,
                            [styles.ordersCounterHugePlus]: basketAmount > 999
                        })}
                    onClick={this.handleOpenBasket}
                    >
                        <img className={styles.iconBasket} src='/src/apps/client/ui/components/Header/images/basket.png'
                            alt='basket'/>
                        {basketAmount > 0 &&
                        <div className={classNames(styles.ordersCounter, styles.basketAmount)}>
                            <div className={styles.ordersNumber}>{basketAmount < 1000 ? basketAmount : '999+'}</div>
                        </div>}
                    </div>
                    {isBurgerMenuShowed && <div className={styles.bottomIconWrapper} onClick={this.handleOpenSearch}>
                        <img className={styles.iconSearch} src='/src/apps/client/ui/components/Header/images/search.png'
                            alt='search'/>
                    </div>}
                </div>
                }
            </div>
        </div>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
