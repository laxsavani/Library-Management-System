const { Review, BorrowRecord, User, Book } = require('../models');

const submitReview = async (req, res) => {
    try {
        const { book_id, rating, comment } = req.body;
        const student_id = req.user.id;

        if (!book_id || !rating) {
            return res.status(400).json({
                success: false,
                message: "Please provide book_id and rating"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const hasBorrowed = await BorrowRecord.findOne({ where: { student_id, book_id } });

        if (!hasBorrowed) {
            return res.status(400).json({
                success: false,
                message: "You must have borrowed the book to review it"
            });
        }

        const existing = await Review.findOne({ where: { student_id, book_id } });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this book"
            });
        }

        const review = await Review.create({
            student_id,
            book_id,
            rating,
            comment
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getReviewsByBook = async (req, res) => {
    try {
        const { book_id } = req.params;
        const reviews = await Review.findAll({ where: { book_id } });
        const avgRating = await Review.aggregate('rating', 'AVG', { where: { book_id } });
        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            reviews,
            avgRating: avgRating || 0
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getMyReviews = async (req, res) => {
    try {
        const student_id = req.user.id;
        const reviews = await Review.findAll({
            where: { student_id },
            include: [
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author']
                }
            ],
            order: [['createdAt', 'DESC']],
        });
        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            reviews
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }
        if (review.student_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this review"
            });
        }

        const { rating, comment } = req.body;
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }
            review.rating = rating;
        }

        if (comment !== undefined) {
            review.comment = comment;
        }

        await review.save();

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }
        if (review.student_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'librarian') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this review"
            });
        }
        await review.destroy();
        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    submitReview,
    getReviewsByBook,
    getMyReviews,
    updateReview,
    deleteReview
}
