import React, { Component } from 'react';
import styles from './Footer.css';

class Footer extends Component {
    render () {
        return <div className={styles.footer_container}>
            <div className={styles.icons_container}>
                <div className={styles.icons}>
                    <img className={styles.instagram_icon} src='../../../../../../client/images/instagram.png' alt=''/>
                    <img className={styles.twitter_icon} src='../../../../../../client/images/twitter.png' alt=''/>
                    <img className={styles.google_icon} src='../../../../../../client/images/google+.png' alt=''/>
                    <img className={styles.facebook_icon} src='../../../../../../client/images/facebook.png' alt=''/>
                </div>
            </div>
        </div>;
    }
}

export default Footer;
