import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import outsideClick from '../../hocs/outsideClick';

import noop from '@tinkoff/utils/function/noop';

import styles from './Search.css';

@outsideClick
class Search extends Component {
    static propTypes = {
        turnOnClickOutside: PropTypes.func
    };

    static defaultProps = {
        turnOnClickOutside: noop
    };

    state = {
        inputTxt: '',
        visibleTips: false
    }

    handleVisibleTipsNone = () => {
        this.setState({
            visibleTips: false
        });
    }

    handleInputChange = event => {
        const value = event.target.value;

        this.setState({
            inputTxt: value,
            visibleTips: !!value
        });

        !this.state.visibleTips && this.props.turnOnClickOutside(this, this.handleVisibleTipsNone);
    }

    render () {
        const { visibleTips, inputTxt } = this.state;

        return <section>
            <input
                value={inputTxt}
                onChange={this.handleInputChange}
                className={classNames(styles.searchFormInput, { [styles.searchFormInputActive]: visibleTips })}
                placeholder='Поиск продуктов...'
            />
            {
                visibleTips && <div className={styles.tipsRoot}>
                    <div className={styles.tipsWrapp}>
                        <div className={styles.break}></div>
                        <ul className={styles.adviceСontainer} onClick={this.handleVisibleTipsNone}>
                            <li className={styles.tip}>knive</li>
                            <li className={styles.tip}>knive</li>
                            <li className={styles.tip}>knive</li>
                            <li className={styles.tip}>knive</li>
                            <li className={styles.tip}>knive</li>
                        </ul>
                    </div>
                </div>
            }
            <button className={styles.searchFormIcon}><img src='/src/apps/client/ui/components/Header/images/search.png' alt='search.png'/></button>
        </section>;
    }
}

export default Search;
