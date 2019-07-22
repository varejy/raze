import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import styles from './ByStubbs.css';

export default class ByStubbs extends Component {
    static propTypes = {
        campaign: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        underscoreColor: PropTypes.string,
        position: PropTypes.oneOf(['static', 'fixed']),
        align: PropTypes.oneOf(['left', 'center', 'right'])
    };

    static defaultProps = {
        position: 'fixed',
        align: 'right'
    };

    state = {
        hovered: false
    };

    toggleHover = () => {
        this.setState({ hovered: !this.state.hovered });
    };

    render () {
        const { campaign, position, align, underscoreColor, color } = this.props;
        const { hovered } = this.state;
        const isFixed = position === 'fixed';

        return <div className={classNames(styles.developed, {
            [styles[`developed__fixed`]]: isFixed,
            [styles[`developed__${align}`]]: isFixed
        })} style={{
            color
        }}>
            <div className={styles.desktopText}>Developed by</div>
            <div className={styles.mobileText}>By&#8194;</div>
            <a
                href={`https://stubbs.pro/?utm_source=prev_clients&utm_campaign=${campaign}`}
                target='_blank'
                className={styles.stubbs}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                style={hovered ? {
                    color,
                    borderBottom: `2px solid ${underscoreColor || color}`
                } : {
                    color
                }}
            >
                Stubbs
            </a>
        </div>;
    }
}
