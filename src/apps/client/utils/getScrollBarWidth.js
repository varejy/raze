import getScrollBarWidth from 'scrollbar-width';

const promise = new Promise((resolve) => {
    const isBrowser = typeof window !== 'undefined';

    if (!isBrowser) {
        return resolve();
    }

    //  пока документ не загружен, ширина скроллбара возвращает null
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve(getScrollBarWidth()));
    } else {
        resolve(getScrollBarWidth());
    }
});

export default () => promise;
