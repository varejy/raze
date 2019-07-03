const STAR = {
    full: '/src/apps/client/ui/pages/ProductPage/images/starFull.png',
    half: '/src/apps/client/ui/pages/ProductPage/images/starHalfFull.png',
    empty: '/src/apps/client/ui/pages/ProductPage/images/starEmpty.png'
};

export default (ratingValue) => {
    const fullStars = Math.floor(ratingValue);
    let halfStars = 0;
    if (ratingValue % fullStars > 0) {
        halfStars = 1;
    }
    const emptyStars = 5 - fullStars - halfStars;
    let starsArray = [];
    for (let i = 0; i < fullStars; i++) {
        starsArray.push(STAR.full);
    }
    if (halfStars !== 0) {
        starsArray.push(STAR.half);
    }
    for (let i = 0; i < emptyStars; i++) {
        starsArray.push(STAR.empty);
    }
    return starsArray;
};
