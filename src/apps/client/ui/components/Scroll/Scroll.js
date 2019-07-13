import React, { PureComponent } from 'react';
import pt from 'prop-types';
import classNames from 'classnames';

import getDeviceType from '../../../utils/getDeviceType';

// import { PortalContainer } from '@platform-ui/portal';
import ScrollBar from './ScrollBar';
import OffsetWrapper from './OffsetWrapper';
import ScrollContent, { SCROLLBAR_OFFSET } from './ScrollContent';
import { stopOuterScroll } from './utils';

import styles from './Scroll.css';

const BAR_OFFSET = 15;
const MIN_BAR_HEIGHT = 17;
const FADE_TIMEOUT = 300;

const noop = () => {};

const setTransform = ({ el, v, offset }) => {
    const value = `translate${v}(${offset}px)`;

    el.style.transform = value;
    el.style.MozTransform = value;
    el.style.OTransform = value;
    el.style.MsTransform = value;
    el.style.WebkitTransform = value;
};

export const SCROLLBAR_VISIBILITY = {
    ALWAYS: 'always',
    ONLY_ACTIVE: 'onlyActive',
    HIDDEN: 'hidden'
};

class Scroll extends PureComponent {
    static propTypes = {
        /**
         * callback события скролла
         */
        onScroll: pt.func,
        /**
         * Атрибут data-qa-type компонента
         */
        dataQaType: pt.string,
        /**
         * Режим отображения скроллбара
         */
        scrollbarVisibility: pt.oneOf([
            SCROLLBAR_VISIBILITY.ALWAYS,
            SCROLLBAR_VISIBILITY.ONLY_ACTIVE,
            SCROLLBAR_VISIBILITY.HIDDEN
        ]),
        /**
         * Проставляется непосредственно на <div> со скроллом (нужен для механизма восставления борда)
         */
        id: pt.string,
        /**
         * Кастомная позиция скролла
         */
        scrollTop: pt.number,
        /**
         * Кастомная позиция скролла
         */
        scrollLeft: pt.number,
        /**
         * Не дает скроллиться внешнему блоку, когда текущий доскроллился до предела
         */
        preventOuterScroll: pt.bool,
        children: pt.oneOfType([pt.element, pt.arrayOf(pt.element)]),
        /**
         * Принудительно использовать фолбечный вариант
         */
        fallback: pt.bool,
        /**
         * ref на блок со скроллом (нужно для управления его позицией скролла в борде с анимацией)
         */
        setContainer: pt.func,
        /**
         * Позволяет получить снаружи функцию для явного вызова пересчета высоту скроллбара
         */
        getUpdateFunc: pt.func,
        /**
         * Тема оформления скроллбара:
         * `default` – по умолчанию, темно-серая для светлых фонов
         * `light` – белая для тёмных фонов
         */
        theme: pt.oneOf(['default', 'light']),
        /**
         * Внутренний отступ сверху для контента, не влияющий на скроллбар
         */
        contentInnerOffsetTop: pt.number,
        /**
         * Внутренний отступ для снизу контента, не влияющий на скроллбар
         */
        contentInnerOffsetBottom: pt.number
    };

    static defaultProps = {
        onScroll: noop,
        preventOuterScroll: false,
        scrollbarVisibility: SCROLLBAR_VISIBILITY.ONLY_ACTIVE,
        setContainer: noop,
        fallback: false,
        getUpdateFunc: noop,
        theme: 'default',
        dataQaType: 'raze/scroll',
        contentInnerOffsetBottom: 0,
        contentInnerOffsetTop: 0
    };

    verticalOffset = 0; // eslint-disable-line
    horizontalOffset = 0;

    state = {
        verticalOffset: 0,
        clientRender: false
    };

    constructor (props) {
        super(props);

        props.getUpdateFunc(() => this.updateWithProportions());
        this.deviceType = getDeviceType();
    }

    componentWillMount () {
        this.setState({
            horizontalSize: 0,
            verticalSize: 0,
            horizontalShow: false,
            verticalShow: false,
            hovered: false,
            isVScrolling: false
        });

        this.horizontalProportion = 1;
        this.verticalProportion = 1;
    }

    componentDidMount () {
        this.updateWithProportions();
        this.setState({ clientRender: true }); // eslint-disable-line
    }

    componentWillReceiveProps (nextProps) {
        /* TODO: действительно ли всегда надо обновлять? */
        this.updateWithProportions(nextProps, this.props);
    }

    componentWillUnmount () {
        this.isUnmounting = true;
    }

    getScrollBarVisibility = (direction) => {
        switch (this.props.scrollbarVisibility) {
        case SCROLLBAR_VISIBILITY.ONLY_ACTIVE:
            return (
                this.state.hovered ||
                    this.state.scrolling ||
                    (direction === 'vertical'
                        ? this.state.isVScrolling || this.state.isVDragging
                        : this.state.isHScrolling || this.state.isHDragging)
            );
        case SCROLLBAR_VISIBILITY.HIDDEN:
            return false;
        default:
            return true;
        }
    };

    onDragStart = () => {
        switch (this.direction) {
        case 'horizontal':
            this.startOffset = this.content.scrollLeft * this.horizontalProportion;
            break;

        case 'vertical':
            this.startOffset = this.content.scrollTop * this.verticalProportion;
            break;
        }
    };

    onDragProcess = ({ start, client }) => {
        switch (this.direction) {
        case 'horizontal':
            this.content.scrollLeft = (this.startOffset + client.x - start.client.x) / this.horizontalProportion;
            break;

        case 'vertical':
            this.content.scrollTop = (this.startOffset + client.y - start.client.y) / this.verticalProportion;
            break;
        }
    };

    onDragEnd = () => {
        this.direction = null;
        this.setDraggingDirection();
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

    handleMouseDown = (event, direction) => {
        this.direction = direction;
        this.setDraggingDirection();
    };

    handleWheel = (event) => {
        this.props.preventOuterScroll && this.state.verticalShow && stopOuterScroll(event);

        event.stopPropagation();

        if (!this.state.scrolling) {
            this.setState({
                scrolling: true
            });
        }

        clearTimeout(this.scollingId);

        this.scollingId = setTimeout(() => {
            this.setState({
                scrolling: false
            });
        }, FADE_TIMEOUT);
    };

    handleNativeContainerScroll = (event) => {
        this.props.onScroll(event, { scrollTop: event.target.scrollTop });
    };

    // eslint-disable-next-line max-statements
    update = (event) => {
        const content = this.content;

        this.horizontalOffset = content.scrollLeft * this.horizontalProportion;

        const offsetScaleRatio =
            (this.content.clientHeight + this.props.contentInnerOffsetTop + this.props.contentInnerOffsetBottom) /
            this.content.clientHeight;
        const verticalSize =
            (content.clientHeight / content.scrollHeight) * this.container.clientHeight -
            BAR_OFFSET * +(this.horizontalProportion < 1);
        const scrollPosition = content.scrollTop * this.verticalProportion * offsetScaleRatio;

        if (verticalSize < MIN_BAR_HEIGHT) {
            const diffHeight = MIN_BAR_HEIGHT - verticalSize;
            const scrollPositionToAvailableScrollRatio =
                content.scrollTop / (content.scrollHeight - this.container.clientHeight);

            this.verticalOffset = scrollPosition - diffHeight * scrollPositionToAvailableScrollRatio;
        } else {
            this.verticalOffset = scrollPosition;
        }

        if (this.horizontalOffset !== this.state.horizontalOffset && this.horizontalBar) {
            this.setState({
                isHScrolling: true,
                horizontalOffset: this.horizontalOffset
            });
            this.setScrollingTimeout('horizontal');
            setTransform({ el: this.horizontalBar, v: 'X', offset: this.horizontalOffset });
        }

        if (this.verticalOffset !== this.state.verticalOffset && this.verticalBar) {
            this.setState({
                isVScrolling: true,
                verticalOffset: this.verticalOffset
            });
            this.setScrollingTimeout('vertical');
            setTransform({ el: this.verticalBar, v: 'Y', offset: this.verticalOffset });
        }

        const horizontalSize =
            (content.clientWidth / content.scrollWidth) * this.container.clientWidth -
            BAR_OFFSET * +(this.verticalProportion < 1);

        this.setState({
            // при большом кол-ве эл-тов каретка может стать слишком маленькой поэтому у нее есть минимальный размер
            horizontalSize: Math.max(horizontalSize, MIN_BAR_HEIGHT),
            verticalSize: Math.max(verticalSize, MIN_BAR_HEIGHT),
            horizontalShow: this.horizontalProportion < 1,
            verticalShow: this.verticalProportion < 1
        });

        this.props.onScroll(event, { scrollTop: content.scrollTop });
    };

    setScrollingTimeout (direction) {
        const isVertical = direction === 'vertical';
        const timeoutId = isVertical ? 'vTimeoutId' : 'hTimeoutId';

        clearTimeout(this[timeoutId]);

        this[timeoutId] = setTimeout(() => {
            !this.isUnmounting &&
            this.setState({
                [isVertical ? 'isVScrolling' : 'isHScrolling']: false
            });
        }, FADE_TIMEOUT);
    }

    updateWithProportions ({ scrollTop, scrollLeft } = this.props, prevProps = {}) {
        // TODO: понять зачем requestAnimationFrame
        requestAnimationFrame(() => {
            const content = this.content;

            if (!content) {
                return;
            }

            // Плюс 20 пикселей, потому что после рендера будет добавлено padding-right: 20px что сделает посчитанные пропорции неактуальными
            this.horizontalProportion = (content.clientWidth + SCROLLBAR_OFFSET) / content.scrollWidth;
            this.verticalProportion = content.clientHeight / content.scrollHeight;

            if (scrollTop !== prevProps.scrollTop && scrollTop !== null) {
                this.content.scrollTop = scrollTop;
            }

            if (scrollLeft !== prevProps.scrollLeft && scrollLeft !== null) {
                this.content.scrollLeft = scrollLeft;
            }

            this.update();
        });
    }

    setDraggingDirection () {
        this.setState({
            isHDragging: /horizontal/.test(this.direction),
            isVDragging: /vertical/.test(this.direction)
        });
    }

    setRef = (ref) => (element) => {
        this[ref] = element;
    };

    contentRef = (node) => {
        this.props.setContainer(node);
        this.content = node;
    };

    renderContent () {
        const { id, children, contentInnerOffsetTop, contentInnerOffsetBottom } = this.props;

        return (
            <OffsetWrapper offsetBottom={contentInnerOffsetBottom} offsetTop={contentInnerOffsetTop}>
                <ScrollContent
                    scrollY={this.verticalProportion < 1}
                    scrollX={this.horizontalProportion < 1}
                    contentRef={this.contentRef}
                    onScroll={this.update}
                    id={id}
                    onWheel={this.handleWheel}
                >
                    <div>
                        <div></div>
                        {children}
                    </div>
                </ScrollContent>
            </OffsetWrapper>
        );
    }

    renderScrollBar = (direction) =>
        this.state[`${direction}Show`] && (
            <ScrollBar
                direction={direction}
                visible={this.getScrollBarVisibility(direction)}
                dragging={this.state[direction === 'vertical' ? 'isVDragging' : 'isHDragging']}
                size={this.state[`${direction}Size`]}
                barRef={this.setRef(`${direction}Bar`)}
                onMouseDown={this.handleMouseDown}
                handleDragStart={this.onDragStart}
                handleDragProcess={this.onDragProcess}
                handleDragEnd={this.onDragEnd}
            />
        );

    renderNativeContainer () {
        const { id, dataQaType, contentInnerOffsetTop, contentInnerOffsetBottom } = this.props;
        const { clientRender } = this.state;

        return (
            <div
                ref={this.setRef('container')}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                data-qa-type={dataQaType}
            >
                <OffsetWrapper offsetBottom={contentInnerOffsetBottom} offsetTop={contentInnerOffsetTop}>
                    <div
                        id={id}
                        ref={this.contentRef}
                        onMouseOver={this.handleMouseOver}
                        onMouseLeave={this.handleMouseLeave}
                        className={classNames({
                            [styles.nativeScrollContainer]: true,
                            [styles.nativeScrollContainer_hidden]: !clientRender
                        })}
                        onScroll={this.handleNativeContainerScroll}
                        onWheel={this.handleWheel}
                    >
                        <div>{this.props.children}</div>
                    </div>
                </OffsetWrapper>
            </div>
        );
    }

    render () {
        const { theme, dataQaType } = this.props;
        const { clientRender } = this.state;

        // на сервере и на клиенте в мобилах рисуем нативный скролл
        return !clientRender ||
        ((this.deviceType === 'tablet' || this.deviceType === 'mobile') && !this.props.fallback) ? (
                this.renderNativeContainer()
            ) : (
                <div
                    ref={this.setRef('container')}
                    data-qa-type={dataQaType}
                    onMouseOver={this.handleMouseOver}
                    onMouseLeave={this.handleMouseLeave}
                    className={classNames(styles.scroll, styles[`scroll_theme_${theme}`])}
                >
                    {this.renderContent()}
                    {this.renderScrollBar('horizontal')}
                    {this.renderScrollBar('vertical')}
                </div>
            );
    }
}

export default Scroll;
