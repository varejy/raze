import React, { Component } from 'react';
import styles from './AboutUsBanner.css';

class AboutUsBanner extends Component {
    render () {
        return <div className={styles.bannerContainer}>
            <div className={styles.banner}>
                <div className={styles.bannerHeader}><h2>о компании</h2></div>
                <div className={styles.bannerText}>
                    <div>With over a decade of experience, we have helped our clients all over the world to
                        create eye-catching and head-turning creative solutions.  We work together from our
                        three UK offices to create high quality work. </div>
                </div>
                <div className={styles.bannerButton}><button className={styles.readMoreButton}><div>читать далее</div></button></div>
            </div>
        </div>;
    }
}

export default AboutUsBanner;
