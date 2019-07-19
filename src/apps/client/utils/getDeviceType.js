let memo;

const calc = () => {
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser && typeof navigator !== 'undefined') {
        const tabletRegExp = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
        // eslint-disable-next-line max-len
        const phoneRegExp = /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/;
        const userAgentString = navigator.userAgent.toLowerCase();

        return userAgentString.match(tabletRegExp)
            ? 'tablet'
            : (userAgentString.match(phoneRegExp) && 'mobile') || 'desktop';
    }
};

const getDeviceType = () => {
    if (!memo) {
        memo = calc();
    }

    return memo;
};

export default getDeviceType;
