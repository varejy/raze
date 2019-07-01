import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Search from '../Search/Search';

import { Link, NavLink, withRouter } from 'react-router-dom';

import styles from './Header.css';
import openBasketPopup from '../../../actions/openBasketPopup';
import openLikedPopup from '../../../actions/openLikedPopup';
import openLicensePopup from '../../../actions/openLicensePopup';

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};
const mapDispatchToProps = (dispatch) => ({
    openBasketPopup: (payload) => dispatch(openBasketPopup(payload)),
    openLikedPopup: (payload) => dispatch(openLikedPopup(payload)),
    openLicensePopup: (payload) => dispatch(openLicensePopup(payload))
});

class Header extends Component {
    static propTypes = {
        categories: PropTypes.array,
        openBasketPopup: PropTypes.func.isRequired,
        openLikedPopup: PropTypes.func.isRequired,
        openLicensePopup: PropTypes.func.isRequired
    };

    static defaultProps = {
        categories: []
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

    render () {
        const { categories } = this.props;

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
                        <div className={styles.contactsLicense} onClick={this.handleOpenLicense}>
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
                    <div className={styles.bottomIconWrapper} onClick={this.handleOpenLiked}>
                        <img className={styles.iconHeart} src='/src/apps/client/ui/components/Header/images/likeHeart.png' alt=''/>
                    </div>
                    <div className={styles.bottomIconWrapper} onClick={this.handleOpenBasket}>
                        <img className={styles.iconBasket} src='/src/apps/client/ui/components/Header/images/basket.png' alt=''/>
                        <div className={styles.ordersCounter}><div className={styles.ordersNumber}>3</div></div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
