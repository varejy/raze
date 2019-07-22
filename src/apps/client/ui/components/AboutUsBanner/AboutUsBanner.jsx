import React, { Component } from 'react';
import styles from './AboutUsBanner.css';

class AboutUsBanner extends Component {
    render () {
        return <div className={styles.bannerContainer}>
            <div className={styles.banner}>
                <div className={styles.bannerHeader}><h2>о компании</h2></div>
                <div className={styles.bannerText}>
                    <div>Компания Raze специализируется на&nbsp;продаже ножей, аксессуаров и&nbsp;средств самообороны.
                        Мы&nbsp;продаем только оригинальную продукцию, стараясь дать нашему Клиенту лучший сервис по&nbsp;низкой цене.
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default AboutUsBanner;
