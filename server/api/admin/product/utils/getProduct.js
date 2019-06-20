export default function getProduct (body) {
    const { name, company, price, discountPrice, description, features, categoryId, tags, hidden, notAvailable, id } = body;

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
        id
    };
}
