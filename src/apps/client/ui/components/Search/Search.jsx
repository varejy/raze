import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import outsideClick from '../../hocs/outsideClick';

import noop from '@tinkoff/utils/function/noop';

import styles from './Search.css';

@outsideClick
class SearchTips extends Component {
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

    componentDidMount () {
        document.addEventListener('click', () => {
            this.props.turnOnClickOutside(this, this.handleVisibleTipsNone);
        }, false);
    }

    handleVisibleTipsNone = () => {
        this.setState({
            ...this.state,
            visibleTips: false
        });
    }

    handleInputChange = input => {
        const value = input.target.value;

        value
            ? this.setState({
                inputTxt: value,
                visibleTips: true
            })
            : this.setState({
                inputTxt: value,
                visibleTips: false
            });
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
            <button className={styles.searchFormIcon}><img src='/src/apps/client/ui/components/Header/images/search.png' alt=''/></button>
        </section>;
    }
}

export default SearchTips;
