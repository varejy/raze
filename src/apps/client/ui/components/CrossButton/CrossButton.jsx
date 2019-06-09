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
        <span className={classNames(styles.line, styles.lineTop)}/>
        <span className={classNames(styles.line, styles.lineBottom)}/>
    </button>;
}

CrossButton.propTypes = {
    onClick: PropTypes.func
};

CrossButton.defaultProps = {
    onClick: noop
};
