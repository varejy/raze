import React, { Component } from 'react';
import styles from './Header.css';

class Header extends Component {
    render () {
        return <div className={styles.header_container}>
            <div className={styles.header_top}>
                <div className={styles.logo}>
                    <span className={styles.logo_left}>raze</span>
                    <span className={styles.logo_right}>Your<br/>knife<br/><span className={styles.logo_green}>world</span></span>
                </div>
                <div className={styles.search_form}>
                    <input value='Поиск продуктов...'/>
                    <button className={styles.search_form_icon}><img src='../../../../../../client/images/Search.png' alt=''/></button>
                </div>
                <div className={styles.contacts_wrapper}>
                    <div className={styles.contacts}>
                        <div className={styles.contacts_license}>
                            <span>Лицензионное соглашение</span>
                        </div>
                        <div className={styles.toll_email}>
                            <div className={styles.toll}>
                                <div className={styles.icon_wrapper}>
                                    <img className={styles.icon_phone} src='../../../../../../client/images/iPhone.png' alt=''/>
                                    <img className={styles.color_element} src='../../../../../../client/images/color-element-1.png' alt=''/>
                                </div>
                                <span>+38 (044) 232 13 14</span>
                            </div>
                            <div className={styles.email}>
                                <div className={styles.icon_wrapper}>
                                    <img className={styles.icon_mail} src='../../../../../../client/images/Mail.png' alt=''/>
                                    <img className={styles.color_element} src='../../../../../../client/images/color-element-2.png' alt=''/>
                                </div>
                                <span>info@oneblade.org</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.header_bottom}>
                <div className={styles.menu}>
                    <ul>
                        <li>Ножи</li>
                        <li>Топоры</li>
                        <li>Точила</li>
                        <li>Аксессуары</li>
                    </ul>
                </div>
                <div className={styles.likes_basket}>
                    <div className={styles.bottom_icon_wrapper}>
                        <img className={styles.icon_heart} src='../../../../../../client/images/like-heart.png' alt=''/>
                    </div>
                    <div className={styles.bottom_icon_wrapper}>
                        <img className={styles.icon_basket} src='../../../../../../client/images/basket.png' alt=''/>
                        <div className={styles.orders_counter}><span>3</span></div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default Header;
