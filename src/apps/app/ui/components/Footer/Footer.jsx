import React, { Component } from 'react';
import styles from './Footer.css';

class Footer extends Component {
    render () {
        return <div className={styles.footerContainer}>
            <div className={styles.iconsContainer}>
                <div className={styles.icons}>
                    <img className={styles.instagramIcon} src='/src/apps/app/ui/components/Footer/images/instagram.png' alt=''/>
                    <img className={styles.twitterIcon} src='/src/apps/app/ui/components/Footer/images/twitter.png' alt=''/>
                    <img className={styles.googleIcon} src='/src/apps/app/ui/components/Footer/images/google+.png' alt=''/>
                    <img className={styles.facebookIcon} src='/src/apps/app/ui/components/Footer/images/facebook.png' alt=''/>
                </div>
            </div>
        </div>;
    }
}

export default Footer;
