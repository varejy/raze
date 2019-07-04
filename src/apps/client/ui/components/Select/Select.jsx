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
        arrowClicked: false
    };

    static propTypes = {
        turnOnClickOutside: PropTypes.func,
        outsideClickEnabled: PropTypes.bool,
        options: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        turnOnClickOutside: noop,
        options: []
    };

    handleArrowClick = () => {
        const { arrowClicked } = this.state;
        const { outsideClickEnabled, turnOnClickOutside } = this.props;

        !outsideClickEnabled && turnOnClickOutside(this, this.handleCloseClick);

        if (!arrowClicked) {
            this.setState({ arrowClicked: true });
        } else {
            this.setState({ arrowClicked: false });
        }
    };

    handleCloseClick = () => {
        this.setState({ arrowClicked: false });
    };

    getActiveOption = () => {
        const { options } = this.props;
        const activeSort = find(sort => sort.id === this.state.activeOption, options);

        return !activeSort ? options[0] : activeSort;
    };

    renderSorting = () => {
        const { options } = this.props;
        const index = findIndex(sort => sort === this.getActiveOption(), options);

        return [
            ...remove(index, 1, options)
        ];
    };

    render () {
        const { arrowClicked } = this.state;
        const { onChange } = this.props;

        return <div className={styles.filterWrapp}>
            <ul className={classNames(styles.sortingOptions, {
                [styles.sortingOptionsOpen]: arrowClicked
            })}>
                <li className={classNames(styles.filterItem, styles.activeFilterItem)} onClick={this.handleArrowClick}>
                    <div className={styles.activeOption}>{this.getActiveOption().text}</div>
                    <div className={styles.arrowButton}>
                        <img className={classNames({
                            [styles.arrowReversed]: arrowClicked
                        })}
                        src='/src/apps/client/ui/components/Select/images/sortingArrow.png' alt='arrow'/>
                    </div>
                </li>
                { arrowClicked && this.renderSorting().map((option, i) =>
                    <li
                        key={i}
                        className={styles.filterItem}
                        onClick={() => {
                            this.handleCloseClick();
                            onChange(option.id);
                        }}>
                        {option.text}
                    </li>)}
            </ul>
        </div>;
    }
}

export default Select;
