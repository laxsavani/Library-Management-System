const { Book, Category, Review } = require('../models');
const cloudinary = require('../config/cloudinary');
const { buildSearchQuery } = require('../utils/searchFilter');

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });

        if (!books) {
            return res.status(404).json({
                success: false,
                message: "No Books Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Books Fetched Successfully",
            Books: books
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Fetching Books"
        });
    }
}

const searchBooks = async (req, res) => {
    try {
        const { where, order, limit, offset } = buildSearchQuery(req.query);
        const { count, rows } = await Book.findAndCountAll({
            where,
            order,
            limit,
            offset,
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
        });

        const page = parseInt(req.query.page) || 1;

        return res.status(200).json({
            success: true,
            message: "Books Searched Successfully",
            Books: rows,
            pagination: {
                page,
                totalPages: Math.ceil(count / limit),
                totalBooks: count,
                booksPerPage: limit
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Searching Books"
        });
    }
}

const getBookById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Book Id is required"
            });
        }

        const book = await Book.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: Review,
                    as: 'reviews',
                    attributes: ['rating', 'comment', 'student_id']
                }
            ]
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Book Fetched Successfully",
            Book: book
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Fetching Book"
        });
    }
}

const addBook = async (req, res) => {
    try {
        const { title, author, isbn, category_id, total_copies, avail_copies } = req.body;
        if (!title || !author) {
            return res.status(400).json({
                success: false,
                message: "Title and Author are required"
            });
        }

        let cover_image = null;
        let cover_public_id = null;

        if (req.file) {
            cover_image = req.file.path;
            cover_public_id = req.file.filename;
        }

        const book = await Book.create({
            title,
            author,
            isbn,
            category_id: category_id || null,
            total_copies: total_copies || 1,
            avail_copies: avail_copies || total_copies || 1,
            cover_image,
            cover_public_id,
        });

        return res.status(201).json({
            success: true,
            message: "Book Added Successfully",
            Book: book
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Adding Book"
        });
    }
}

const updateBook = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book Not Found"
            });
        }

        const { title, author, isbn, category_id, total_copies, avail_copies } = req.body;

        if (req.file) {
            if (book.cover_public_id) {
                await cloudinary.uploader.destroy(book.cover_public_id);
            }
            book.cover_image = req.file.path;
            book.cover_public_id = req.file.filename;
        }

        if (title) book.title = title;
        if (author) book.author = author;
        if (isbn) book.isbn = isbn;
        if (category_id) book.category_id = category_id;
        if (total_copies) book.total_copies = total_copies;
        if (avail_copies) book.avail_copies = avail_copies;

        await book.save();

        return res.status(200).json({
            success: true,
            message: "Book Updated Successfully",
            Book: book
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Updating Book"
        });
    }
}

const deleteBook = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book Not Found"
            });
        }

        if (book.cover_public_id) {
            await cloudinary.uploader.destroy(book.cover_public_id);
        }

        await book.destroy();

        return res.status(200).json({
            success: true,
            message: "Book Deleted Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Deleting Book",
            error: error.message
        });
    }
}

module.exports = {
    getAllBooks,
    searchBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook
}
