import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import styles from './Header.css';

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

class Header extends Component {
    static propTypes = {
        categories: PropTypes.array
    };

    static defaultProps = {
        categories: []
    };

    render () {
        const { categories } = this.props;

        return <div className={styles.headerContainer}>
            <div className={styles.headerTop}>
                <div className={styles.logo}>
                    <span className={styles.logoLeft}>raze</span>
                    <span className={styles.logoRight}>Your<br/>knife<br/><span className={styles.logoGreen}>world</span></span>
                </div>
                <div className={styles.searchForm}>
                    <input defaultValue='' className={styles.searchFormInput} placeholder='Поиск продуктов...'/>
                    <button className={styles.searchFormIcon}><img src='/src/apps/client/ui/components/Header/images/search.png' alt=''/></button>
                </div>
                <div className={styles.contactsWrapper}>
                    <div className={styles.contacts}>
                        <div className={styles.contactsLicense}>
                            <span>Лицензионное соглашение</span>
                        </div>
                        <div className={styles.tollEmail}>
                            <div className={styles.toll}>
                                <div className={styles.iconWrapper}>
                                    <img className={styles.iconPhone} src='/src/apps/client/ui/components/Header/images/iPhone.png' alt=''/>
                                    <img className={styles.colorElement} src='/src/apps/client/ui/components/Header/images/colorElement1.png' alt=''/>
                                </div>
                                <a href="tel:+38 (044) 232 13 14" className={styles.link}>+38 (044) 232 13 14</a>
                            </div>
                            <div className={styles.email}>
                                <div className={styles.iconWrapper}>
                                    <img className={styles.iconMail} src='/src/apps/client/ui/components/Header/images/mail.png' alt=''/>
                                    <img className={styles.colorElement} src='/src/apps/client/ui/components/Header/images/colorElement2.png' alt=''/>
                                </div>
                                <a href="mailto:info@oneblade.org" className={styles.link}>info@oneblade.org</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.headerBottom}>
                <div className={styles.menu}>
                    <ul className={styles.menuList}>
                        { categories.map((category, i) => <Link className={styles.menuListCategory} key={i} to={`/${category.path}`}>{category.name}</Link>) }
                    </ul>
                </div>
                <div className={styles.likesBasket}>
                    <div className={styles.bottomIconWrapper}>
                        <img className={styles.iconHeart} src='/src/apps/client/ui/components/Header/images/likeHeart.png' alt=''/>
                    </div>
                    <div className={styles.bottomIconWrapper}>
                        <img className={styles.iconBasket} src='/src/apps/client/ui/components/Header/images/basket.png' alt=''/>
                        <div className={styles.ordersCounter}><span className={styles.ordersNumber}>3</span></div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(Header);
