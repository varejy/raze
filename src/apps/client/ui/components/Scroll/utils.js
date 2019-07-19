export const stopOuterScroll = (event) => {
    const { currentTarget: target, deltaY } = event;

    // если происходит скролл на величину большую расстояния на границы блока,
    // то явно скроллим к границе, чтобы предотвратить скролл внешнего контейнера
    if (deltaY < 0) {
        if (target.scrollTop < -deltaY) {
            target.scrollTop = 0;
        }
    } else {
        const maxScroll = target.scrollHeight - target.offsetHeight;

        if (maxScroll - target.scrollTop < deltaY) {
            target.scrollTop = maxScroll;
        }
    }
};
