const { where } = require('sequelize');
const { Reservation, Book, User } = require('../models');
const { sendReservationConfirmation, sendReservationCancelledEmail } = require('../utils/sendMail');

const createReservation = async (req, res) => {
    try {
        const { book_id } = req.body;
        const student_id = req.user.id;

        if (!book_id) {
            return res.status(400).json({
                success: false,
                message: "Book ID is required"
            })
        }

        const book = await Book.findOne({ where: { id: book_id } });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            })
        }

        if (book.avail_copies > 0) {
            return res.status(400).json({
                success: false,
                message: "Book is available, please borrow directly"
            })
        }

        const existing = await Reservation.findOne({
            where: { student_id, book_id, status: 'pending' }
        })

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending reservation for this book"
            })
        }

        const reserved_at = new Date();
        const expires_at = new Date(reserved_at.getTime() + 7 * 24 * 60 * 60 * 1000);

        const reservation = await Reservation.create({
            student_id,
            book_id,
            reserved_at,
            expires_at,
            status: 'pending'
        })

        const user = await User.findOne({ where: { id: student_id } })
        await sendReservationConfirmation(user, book, expires_at.toDateString())

        return res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            reservation
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author']
                },
            ],
            order: [['reserved_at', 'DESC']],
        });

        return res.status(200).json({
            success: true,
            reservations
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getMyReservations = async (req, res) => {
    try {
        const student_id = req.user.id
        const reservations = await Reservation.findAll({
            where: { student_id },
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author']
                },
            ],
            order: [['reserved_at', 'DESC']],
        });
        return res.status(200).json({
            success: true,
            reservations
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'student'
                },
                {
                    model: Book,
                    as: 'book'
                },
            ],
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            })
        }

        if (reservation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Only pending reservations can be cancelled"
            })
        }

        const isAdmin = req.userRoles && req.userRoles.includes('admin');
        const isLibrarian = req.userRoles && req.userRoles.includes('librarian');
        const isOwner = reservation.student_id === req.user.id;

        if (!isAdmin && !isLibrarian && !isOwner) {
            return res.status(403).json({
                success: false,
                message: "You can only cancel your own reservation"
            })
        }

        reservation.status = 'cancelled'
        reservation.save()

        await sendReservationCancelledEmail(reservation.student, reservation.book)

        return res.status(200).json({
            success: true,
            message: "Reservation cancelled successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const fulfilReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            })
        }

        if (reservation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Only pending reservations can be fulfilled"
            })
        }

        reservation.status = 'fulfilled'
        reservation.save()

        return res.status(200).json({
            success: true,
            message: "Reservation fulfilled successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createReservation,
    getAllReservations,
    getMyReservations,
    cancelReservation,
    fulfilReservation
}