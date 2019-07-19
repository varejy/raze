import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// import memoize from '../../../core/utils/memoize';
// import getScrollBarWidth from '@platform-ui/utils/getScrollBarWidth';
import getScrollBarWidth from '../../../utils/getScrollBarWidth';

import styles from './Scroll.css';

const isDefined = (val) => val !== undefined && val !== null;

// на маке scrollbarWidth = 0, но чтобы визуально скрыть скроллбар нужен дополнительный отступ
export const SCROLLBAR_OFFSET = 20;

const windowStyles = /* memoize( */ (vertical, horizontal, scrollbarWidth) =>
    isDefined(scrollbarWidth)
        ? {
            width: vertical && `calc(100% + ${scrollbarWidth}px)`,
            paddingRight: vertical && SCROLLBAR_OFFSET,
            marginRight: vertical && -scrollbarWidth - SCROLLBAR_OFFSET,
            height: horizontal && `calc(100% + ${scrollbarWidth}px)`,
            paddingBottom: horizontal && SCROLLBAR_OFFSET,
            marginBottom: horizontal && -scrollbarWidth - SCROLLBAR_OFFSET
        }
        : undefined; /* ) */

class ScrollContent extends PureComponent {
    static propTypes = {
        children: PropTypes.node,
        cobrowsingStyle: PropTypes.bool,
        contentRef: PropTypes.func.isRequired,
        id: PropTypes.string,
        onScroll: PropTypes.func.isRequired,
        onWheel: PropTypes.func.isRequired,
        scrollX: PropTypes.bool.isRequired,
        scrollY: PropTypes.bool.isRequired,
        offsetBottom: PropTypes.number,
        offsetTop: PropTypes.number
    };

    constructor (props) {
        super(props);

        this.mounting = true;
        this.state = {};

        getScrollBarWidth().then(
            (width) =>
                this.mounting &&
                this.setState({
                    scrollBarWidth: width
                })
        );
    }

    componentWillUnmount () {
        this.mounting = false;
    }

    render () {
        const { scrollY, scrollX, contentRef, onScroll, onWheel, id, children } = this.props;

        return (
            <div
                ref={contentRef}
                className={classNames({
                    [styles.content]: true,
                    [styles.content_scrollY]: scrollY,
                    [styles.content_scrollX]: scrollX
                })}
                id={id}
                style={windowStyles(scrollY, scrollX, this.state.scrollBarWidth)}
                onScroll={onScroll}
                onWheel={onWheel}
            >
                {children}
            </div>
        );
    }
}

export default ScrollContent;
