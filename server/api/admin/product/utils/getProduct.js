export default function getProduct (body) {
    const { name, company, price, description, features, categoryId, hidden, id } = body;

    return {
        name,
        company,
        price: +price,
        description,
        features,
        categoryId,
        hidden,
        id
    };
}
