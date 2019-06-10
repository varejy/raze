import React, { Component } from 'react';
import styles from './Footer.css';

class Footer extends Component {
    render () {
        return <div className={styles.footerContainer}>
            <div className={styles.iconsContainer}>
                <div className={styles.icons}>
                    <a className={styles.socialLink} href='https://instagram.com' target='_blank'>
                        <img className={styles.instagramIcon} src='/src/apps/client/ui/components/Footer/images/instagram.png' alt=''/>
                    </a>
                    <a className={styles.socialLink} href='https://twitter.com' target='_blank'>
                        <img className={styles.twitterIcon} src='/src/apps/client/ui/components/Footer/images/twitter.png' alt=''/>
                    </a>
                    <a className={styles.socialLink} href='https://plus.google.com/' target='_blank'>
                        <img className={styles.googleIcon} src='/src/apps/client/ui/components/Footer/images/google+.png' alt=''/>
                    </a>
                    <a className={styles.socialLink} href='https://www.facebook.com/' target='_blank'>
                        <img className={styles.facebookIcon} src='/src/apps/client/ui/components/Footer/images/facebook.png' alt=''/>
                    </a>
                </div>
            </div>
        </div>;
    }
}

export default Footer;
