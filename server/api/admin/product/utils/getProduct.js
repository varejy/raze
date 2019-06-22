export default function getProduct (body) {
    const { name, company, price, discountPrice, description, features, categoryId, tags, hidden, notAvailable, id, date, views } = body;

    return {
        name,
        company,
        price,
        discountPrice,
        description,
        features,
        categoryId,
        tags,
        notAvailable,
        hidden,
        date,
        views,
        id
    };
}
