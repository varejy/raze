import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';

import styles from './CrossButton.css';

export default function CrossButton (props) {
    return <button
        className={classNames(styles.buttonDefault, styles.button)}
        onClick={props.onClick}
    >
        <span className={classNames(styles.line, styles.lineTop, {
            [styles.lineBlack]: props.color === 'black',
            [styles.lineWhite]: props.color === 'white'
        })}/>
        <span className={classNames(styles.line, styles.lineBottom, {
            [styles.lineBlack]: props.color === 'black',
            [styles.lineWhite]: props.color === 'white'
        })}/>
    </button>;
}

CrossButton.propTypes = {
    onClick: PropTypes.func,
    color: PropTypes.string
};

CrossButton.defaultProps = {
    onClick: noop
};
