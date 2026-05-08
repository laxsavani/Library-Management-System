const { Category, Book, BorrowRecord } = require('../models');
const { Op, fn, col } = require('sequelize');

const getAllCategories = async (req, res) => {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.status(200).json({
        status: true,
        message: 'Categories fetched successfully ✅',
        data: categories
    })
}

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [
                {
                    model: Book,
                    as: 'books'
                }
            ],
        });

        if (!category) {
            return res.status(404).json({
                status: false,
                message: 'Category not found'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Category fetched successfully ✅',
            data: category
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const createCategory = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                status: false,
                message: 'Category name is required'
            });
        }

        const existing = await Category.findOne({
            where: {
                name: name
            }
        });

        if (existing) {
            return res.status(400).json({
                status: false,
                message: 'Category already exists'
            });
        }

        const category = await Category.create({
            name,
            description
        });

        return res.status(200).json({
            status: true,
            message: 'Category created successfully ✅',
            data: category
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                status: false,
                message: 'Category not found'
            });
        }

        const { name, description } = req.body;

        if (name) {
            category.name = name
        }

        if (description !== undefined) {
            category.description = description
        }

        await category.save();

        return res.status(200).json({
            status: true,
            message: 'Category updated successfully ✅',
            data: category
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                status: false,
                message: 'Category not found'
            });
        }

        await category.destroy();

        return res.status(200).json({
            success: true,
            message: "Category Deleted Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Deleting Category",
            error: error.message
        });
    }
}

const getCategoryDistribution = async (req, res) => {
    try {
        const stats = await Category.findAll({
            attributes: [
                'id', 'name',
                [fn('COUNT', col('books.id')), 'bookCount']
            ],
            include: [{ model: Book, as: 'books', attributes: [] }],
            group: ['Category.id'],
        });
        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getMostBorrowedCategories = async (req, res) => {
    try {
        const stats = await Category.findAll({
            attributes: [
                'id', 'name',
                [fn('COUNT', col('books->borrowRecords.id')), 'borrowCount']
            ],
            include: [{
                model: Book,
                as: 'books',
                attributes: [],
                include: [{ model: BorrowRecord, as: 'borrowRecords', attributes: [] }]
            }],
            group: ['Category.id'],
            order: [[fn('COUNT', col('books->borrowRecords.id')), 'DESC']],
            limit: 5
        });
        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryDistribution,
    getMostBorrowedCategories
}