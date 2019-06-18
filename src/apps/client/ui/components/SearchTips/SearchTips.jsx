import React, { Component } from 'react';
import PropTypes from 'prop-types';

import outsideClick from '../../hocs/outsideClick';

import noop from '@tinkoff/utils/function/noop';

import styles from './SearchTips.css';

@outsideClick
class SearchTips extends Component {
    static propTypes = {
        turnOnClickOutside: PropTypes.func,
        onNoneVisibleTips: PropTypes.func
    };

    static defaultProps = {
        turnOnClickOutside: noop
    };

    componentDidMount () {
        this.props.turnOnClickOutside(this, this.props.onNoneVisibleTips);
    }

    render () {
        return <section className={styles.root}>
            <div className={styles.contentWrapp}>
                <div className={styles.break}></div>
                <ul className={styles.adviceСontainer} onClick={this.props.onNoneVisibleTips}>
                    <li className={styles.tip}>knive</li>
                    <li className={styles.tip}>knive</li>
                    <li className={styles.tip}>knive</li>
                    <li className={styles.tip}>knive</li>
                    <li className={styles.tip}>knive</li>
                </ul>
            </div>
        </section>;
    }
}

export default SearchTips;
