import React, { PureComponent } from 'react';

import head from '@tinkoff/utils/array/head';

const DRAG_THRESHOLD = 4; // величина в px, необходимая чтобы отличить клик от дрега

const drag = WrappedComponent => {
    class Drag extends PureComponent {
        state = {
            dragStartPosition: null,
            dragEndPosition: null
        };

        dragPrevPosition = {};

        onDrag = (event, onDragProcess) => {
            const touch = event.touches && head(event.touches) || event;

            this.onDragProcess = onDragProcess;

            this.setState({
                dragStartPosition: {
                    x: touch.pageX,
                    y: touch.pageY,
                    clientX: touch.clientX,
                    clientY: touch.clientY
                }
            });

            this.onDragMouseDown();
        };

        onDragMouseDown () {
            document.addEventListener('mousemove', this.onDragMouseMove);
            document.addEventListener('touchmove', this.onDragMouseMove);
            document.addEventListener('mouseup', this.onDragMouseUp);
            document.addEventListener('touchend', this.onDragMouseUp);
        };

        onDragMouseMove = (event) => {
            if (!this.onDragProcess) {
                return;
            }

            event.preventDefault();

            const touch = event.touches && head(event.touches) || event;
            const currentPosition = {
                x: touch.pageX,
                y: touch.pageY,
                clientX: touch.clientX,
                clientY: touch.clientY
            };

            if (Math.abs(currentPosition.x - this.state.dragStartPosition.x) < DRAG_THRESHOLD &&
                Math.abs(currentPosition.y - this.state.dragStartPosition.y) < DRAG_THRESHOLD) {
                return;
            }

            if (this.dragPrevPosition.x !== currentPosition.x || this.dragPrevPosition.y !== currentPosition.y) {
                this.onDragProcess(currentPosition, this.dragPrevPosition, this.state.dragStartPosition, event);
                this.dragPrevPosition = currentPosition;
            }
        };

        onDragMouseUp = (event) => {
            event.stopPropagation();
            event.preventDefault();

            const touch = event.changedTouches && head(event.changedTouches) || event;

            this.setState({
                dragEndPosition: {
                    x: touch.pageX,
                    y: touch.pageY,
                    clientX: touch.clientX,
                    clientY: touch.clientY
                }
            }, () => {
                this.dragPrevPosition = {};
                this.onDragProcess = null;

                this.setState({
                    dragStartPosition: null,
                    dragEndPosition: null
                });
            });

            document.removeEventListener('mousemove', this.onDragMouseMove);
            document.removeEventListener('touchmove', this.onDragMouseMove);
            document.removeEventListener('mouseup', this.onDragMouseUp);
            document.removeEventListener('touchend', this.onDragMouseUp);
        };

        render () {
            const { dragStartPosition, dragEndPosition } = this.state;

            return <WrappedComponent
                {...this.props}
                onDrag={this.onDrag}
                dragStartPosition={dragStartPosition}
                dragEndPosition={dragEndPosition}
            />;
        }
    }

    return Drag;
};

export default drag;
