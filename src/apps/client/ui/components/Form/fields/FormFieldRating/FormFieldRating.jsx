import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './FormFieldRating.css';

import getStarsArray from '../../../../../utils/getStarsArray';

import noop from '@tinkoff/utils/function/noop';

class FormFieldRating extends Component {
    static propTypes = {
        value: PropTypes.number,
        onChange: PropTypes.func
    };

    static defaultProps = {
        value: 0,
        onChange: noop
    };

    handleRatingChange = value => () => {
        this.props.onChange(value + 1);
    }

    render () {
        return <section className={styles.starsWrapper}>
            <div className={styles.stars}>
                {getStarsArray(this.props.value).map((star, i) =>
                    <div
                        key={i}
                        onClick={this.handleRatingChange(i)}
                        className={styles.star}
                    >
                        <img src={star} alt='star' />
                    </div>
                )}
            </div>
        </section>;
    }
}

export default FormFieldRating;
