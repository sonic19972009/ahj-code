export default function validateProduct({ name, price }) {
    const errors = {};

    const normalizedName = String(name ?? '').trim();
    if (!normalizedName) {
        errors.name = 'Введите название';
    }

    const num = Number(price);

    if (!Number.isFinite(num) || num <= 0) {
        errors.price = 'Стоимость должна быть числом больше 0';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        normalized: {
            name: normalizedName,
            price: num,
        },
    };
}
