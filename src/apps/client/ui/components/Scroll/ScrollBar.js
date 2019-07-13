import React, { PureComponent } from 'react';
import classNames from 'classnames';
import pt from 'prop-types';

// import drag from '../../hocs/drag/drag';
import Draggable from '../Draggable/Draggable.jsx';

import styles from './Scroll.css';

const noop = () => {};

const mainProperty = {
    vertical: 'height',
    horizontal: 'width'
};

class ScrollBar extends PureComponent {
    static propTypes = {
        visible: pt.bool,
        size: pt.number.isRequired,
        dragging: pt.bool,
        onMouseDown: pt.func,
        handleDragStart: pt.func,
        handleDragProcess: pt.func,
        handleDragEnd: pt.func,
        barRef: pt.func.isRequired,
        direction: pt.oneOf(['horizontal', 'vertical']).isRequired
    };

    static defaultProps = {
        visible: false,
        dragging: false,
        size: 0,
        onMouseDown: noop,
        onDragProcess: noop,
        onDragEnd: noop,
        barRef: noop
    };

    handleMouseDown = (event) => {
        const { onMouseDown, direction } = this.props;

        onMouseDown(event, direction);
    };

    render() {
        const { visible, barRef, size, dragging, direction } = this.props;

        return (
            <div
                className={classNames({
                    [styles.scrollBar]: true,
                    [styles.scrollBar_visible]: visible,
                    [styles.scrollBar_dragging]: dragging,
                    [styles[`scrollBar_direction_${direction}`]]: true
                })}
            >
                <Draggable
                    onDragStart={this.props.handleDragStart}
                    onDrag={this.props.handleDragProcess}
                    onDragEnd={this.props.handleDragEnd}
                    allowDefaultAction
                >
                    <div
                        className={styles.scrollCaret}
                        ref={barRef}
                        style={{
                            [mainProperty[direction]]: size
                        }}
                        onMouseDown={this.handleMouseDown}
                    />
                </Draggable>
            </div>
        );
    }
}

export default ScrollBar;
