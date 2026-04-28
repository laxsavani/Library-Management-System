const { Op } = require('sequelize');

const buildSearchQuery = ({ q, category_id, author, avail, sort, page = 1, limit = 10 }) => {
    const where = {};
    const order = [];
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (q) {
        where[Op.or] = [
            { title: { [Op.like]: `%${q}%` } },
            { author: { [Op.like]: `%${q}%` } },
        ];
    }

    if (category_id) {
        where.category_id = parseInt(category_id);
    }

    if (author) {
        where.author = { [Op.like]: `%${author}%` };
    }

    if (avail === 'true') {
        where.avail_copies = { [Op.gt]: 0 };
    }

    if (sort === 'title') {
        order.push(['title', 'ASC']);
    }
    else if (sort === 'author') {
        order.push(['author', 'ASC']);
    }
    else if (sort === 'newest') {
        order.push(['createdAt', 'DESC']);
    }
    else {
        order.push(['createdAt', 'DESC']);
    }

    return {
        where,
        order,
        limit: parseInt(limit),
        offset,
    };
};

module.exports = { buildSearchQuery };