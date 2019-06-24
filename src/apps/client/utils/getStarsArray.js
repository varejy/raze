export default (star, ratingValue) => {
    const fullStars = Math.floor(ratingValue);
    let halfStars = 0;
    if (ratingValue % fullStars > 0) {
        halfStars = 1;
    }
    const emptyStars = 5 - fullStars - halfStars;
    let starsArray = [];
    for (let i = 0; i < fullStars; i++) {
        starsArray.push(star.full);
    }
    if (halfStars !== 0) {
        starsArray.push(star.half);
    }
    for (let i = 0; i < emptyStars; i++) {
        starsArray.push(star.empty);
    }
    return starsArray;
};
