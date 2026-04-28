const { Category, Book } = require('../models');

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
            status: true,
            message: 'Category deleted successfully ✅',
            data: category
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}