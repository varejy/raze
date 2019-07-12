import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';

import styles from './MenuButton.css';

export default class MenuButton extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        isOpen: PropTypes.bool,
        menuVisible: PropTypes.bool.isRequired
    };

    static defaultProps = {
        onClick: noop,
        isOpen: false
    };

    state = {
        isOpen: this.props.isOpen
    };

    componentWillReceiveProps (nextProps) {
        if (this.props.isOpen !== nextProps.isOpen) {
            this.setState({ isOpen: nextProps.isOpen });
        }
        if (this.props.menuVisible !== nextProps.menuVisible) {
            this.setState({ isOpen: nextProps.menuVisible });
        }
    }

    toggleButton = () => {
        const isOpen = !this.state.isOpen;

        this.props.onClick(isOpen);

        this.setState({
            isOpen
        });
    };

    render () {
        const { isOpen } = this.state;
        const { menuVisible } = this.props;

        return <button
            onClick={this.toggleButton}
            className={classNames(styles.buttonDefault, styles.button, {
                [styles.opened]: isOpen,
                [styles.changedPosition]: menuVisible
            })}
        >
            <span className={classNames(styles.line, styles.top)} />
            <span className={classNames(styles.line, styles.middle)} />
            <span className={classNames(styles.line, styles.bottom)} />
        </button>;
    };
}
