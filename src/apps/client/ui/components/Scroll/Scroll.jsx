import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { connect } from 'react-redux';

import drag from '../../hocs/drag/drag';

import calcScrollbarWidth from 'scrollbar-width';
import noop from '@tinkoff/utils/function/noop';

import styles from './Scroll.css';

const mapStateToProps = ({ application }) => {
    return {
        mediaHeight: application.media.height
    };
};

@drag
class Scroll extends Component {
    static propTypes = {
        onDrag: PropTypes.func,
        dragEndPosition: PropTypes.object,
        mediaHeight: PropTypes.number,
        children: PropTypes.node.isRequired,
        theme: PropTypes.oneOf(['white', 'black'])
    };

    static defaultProps = {
        onDrag: noop,
        theme: 'black'
    };

    state = {
        hovered: false,
        verticalShow: false,
        verticalOffset: 0
    };

    minHeightBar = 17;
    fadeTimeout = 300;
    verticalProportion = 1;

    componentDidMount () {
        this.scrollbarWidth = calcScrollbarWidth();
        this.updateProportions();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.dragEndPosition && this.props.dragEndPosition !== nextProps.dragEndPosition) {
            this.setDraggingDirection(false);
        }

        if (this.props.mediaHeight !== nextProps.mediaHeight) {
            this.updateProportions();
        }
    }

    componentWillUnmount () {
        this.isUnmounting = true;
        clearTimeout(this.vTimeoutId);
    }

    setScrollingTimeout () {
        clearTimeout(this.vTimeoutId);

        this.vTimeoutId = setTimeout(() => {
            !this.isUnmounting && this.setState({
                isVScrolling: false
            });
        }, this.fadeTimeout * 2);
    }

    updateProportions = () => {
        this.verticalProportion = this.content.clientHeight / this.content.scrollHeight;

        this.update();
    };

    update = () => {
        const scrolling = {};
        const wrapper = this.content;

        const verticalSize = this.container.clientHeight / wrapper.scrollHeight * this.container.clientHeight;

        const scrollPosition = wrapper.scrollTop * this.verticalProportion;

        if (verticalSize < this.minHeightBar) {
            const diffHeight = this.minHeightBar - verticalSize;
            const scrollPositionToAvailableScrollRatio = wrapper.scrollTop / (wrapper.scrollHeight - this.container.clientHeight);

            this.verticalOffset = scrollPosition - diffHeight * scrollPositionToAvailableScrollRatio;
        } else {
            this.verticalOffset = scrollPosition;
        }

        if (this.verticalBar && this.verticalOffset !== this.state.verticalOffset) {
            scrolling.isVScrolling = true;
            scrolling.verticalOffset = this.verticalOffset;
            this.setScrollingTimeout('vertical');
            this.setTransform({ el: this.verticalBar, v: 'Y', offset: this.verticalOffset });
        }

        this.setState({
            ...scrolling,
            verticalSize: Math.max(verticalSize, this.minHeightBar),
            verticalShow: this.verticalProportion < 1
        });
    };

    setTransform = ({ el, v, offset }) => {
        el.style.transform = `translate${v}(${offset}px)`;
        el.style.MozTransform = `translate${v}(${offset}px)`;
        el.style.OTransform = `translate${v}(${offset}px)`;
        el.style.MsTransform = `translate${v}(${offset}px)`;
        el.style.WebkitTransform = `translate${v}(${offset}px)`;
    };

    setDraggingDirection = (isVDragging) => this.setState({
        isVDragging
    });

    handleMouseDown = event => {
        this.setDraggingDirection(true);

        const startOffset = this.content.scrollTop * this.verticalProportion;
        const onDragProcess = (current, prev, start) => {
            this.content.scrollTop = (startOffset + current.y - start.y) / this.verticalProportion;
        };

        this.props.onDrag(event, onDragProcess);
    };

    handleMouseOver = () => {
        if (!this.state.hovered) {
            this.setState({ hovered: true });
        }
    };

    handleMouseLeave = () => {
        if (this.state.hovered) {
            this.setState({ hovered: false });
        }
    };

    setRef = name => element => {
        this[name] = element;
    };

    render () {
        const { theme } = this.props;
        const { verticalShow, hovered, verticalSize, isVScrolling, isVDragging } = this.state;

        return <div
            className={styles.scroll}
            onMouseOver={this.handleMouseOver}
            onMouseLeave={this.handleMouseLeave}
            ref={this.setRef('container')}
            style={verticalShow ? {
                width: `calc(100% - ${this.scrollbarWidth}px)`
            } : {}}
        >
            <div
                className={classNames(styles.scrollContent, {
                    [styles.scrollContentY]: this.verticalProportion < 1
                })}
                onScroll={this.update}
                ref={this.setRef('content')}
                onChange={() => { setTimeout(this.updateProportions, 0); }}
                style={verticalShow ? {
                    width: `calc(100% + ${this.scrollbarWidth}px)`
                } : {}}
            >
                {this.props.children}
            </div>

            {verticalShow && <div
                className={classNames(styles.scrollBar, {
                    [styles.scrollBarHovered]: hovered || isVScrolling || isVDragging
                })}
            >
                <div
                    className={classNames(styles.scrollBarCaret, {
                        [styles[`scrollBarCaret__${theme}`]]: theme,
                        [styles.scrollBarCaretHovered]: isVScrolling || isVDragging
                    })}
                    ref={this.setRef('verticalBar')}
                    style={{
                        height: `${verticalSize}px`
                    }}
                    onMouseDown={this.handleMouseDown}
                />
            </div>}
        </div>;
    }
}

export default connect(mapStateToProps)(Scroll);
