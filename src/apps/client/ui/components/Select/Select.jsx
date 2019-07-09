import React, { Component } from 'react';
import styles from './Select.css';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import noop from '@tinkoff/utils/function/noop';
import outsideClick from '../../hocs/outsideClick';
import find from '@tinkoff/utils/array/find';
import findIndex from '@tinkoff/utils/array/findIndex';
import remove from '@tinkoff/utils/array/remove';

@outsideClick
class Select extends Component {
    state = {
        isOpened: false
    };

    static propTypes = {
        turnOnClickOutside: PropTypes.func,
        outsideClickEnabled: PropTypes.bool,
        options: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        activeOption: PropTypes.string.isRequired
    };

    static defaultProps = {
        turnOnClickOutside: noop,
        options: [],
        activeOption: ''
    };

    handleOpen = () => {
        const { isOpened } = this.state;
        const { outsideClickEnabled, turnOnClickOutside } = this.props;

        !outsideClickEnabled && turnOnClickOutside(this, this.handleCloseClick);

        this.setState({ isOpened: !isOpened });
    };

    handleCloseClick = () => {
        this.setState({ isOpened: false });
    };

    getActiveOption = () => {
        const { options, activeOption } = this.props;
        const activeSort = find(sort => sort.id === activeOption, options);

        return !activeSort ? options[0] : activeSort;
    };

    getNotActiveOptions = () => {
        const { options } = this.props;
        const index = findIndex(sort => sort === this.getActiveOption(), options);

        return [
            ...remove(index, 1, options)
        ];
    };

    handleNotActiveOptionsClick = (option) => () => {
        const { onChange } = this.props;

        onChange(option)();
        this.handleCloseClick();
    };

    render () {
        const { isOpened } = this.state;

        return <div className={styles.filterWrapp}>
            <ul className={classNames(styles.sortingOptions, {
                [styles.sortingOptionsOpen]: isOpened
            })}>
                <li className={classNames(styles.filterItem, styles.activeFilterItem)} onClick={this.handleOpen}>
                    <div className={styles.activeOption}>
                        {this.getActiveOption().text}
                        <div className={styles.arrowButton}>
                            <img className={classNames({
                                [styles.arrowReversed]: isOpened
                            })}
                            src='/src/apps/client/ui/components/Select/images/arrowIcon.png' alt='arrow'/>
                        </div>
                    </div>
                </li>
                { isOpened && this.getNotActiveOptions().map((option, i) =>
                    <li
                        key={i}
                        className={styles.filterItem}
                        onClick={this.handleNotActiveOptionsClick(`${option.id}`)}>
                        {option.text}
                    </li>)}
            </ul>
        </div>;
    }
}

export default Select;
