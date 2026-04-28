const { Fine, BorrowRecord, User, Book } = require('../models');
const { sendFinePaidEmail } = require('../utils/sendMail');

const getAllFines = async (req, res) => {
    try {
        const fines = await Fine.findAll({
            include: [
                { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
                {
                    model: BorrowRecord,
                    as: 'borrowRecord',
                    include: [{ model: Book, as: 'book', attributes: ['id', 'title'] }],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fines fetched successfully',
            data: fines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching fines',
            error: error.message
        });
    }
}

const getMyFines = async (req, res) => {
    try {
        const fines = await Fine.findAll({
            where: { student_id: req.user.id },
            include: [
                { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
                {
                    model: BorrowRecord,
                    as: 'borrowRecord',
                    include: [{ model: Book, as: 'book', attributes: ['id', 'title'] }],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fines fetched successfully',
            data: fines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching fines',
            error: error.message
        });
    }
}

const markFinePaid = async (req, res) => {
    try {
        const fine = await Fine.findByPk(req.params.id, {
            include: [
                { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
            ],
        });
        if (!fine) {
            return res.status(404).json({
                success: false,
                message: 'Fine not found',
            });
        }

        if (fine.status == 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Fine already paid',
            });
        }

        fine.status = 'paid';
        fine.paid_at = new Date();
        await fine.save();

        await sendFinePaidEmail(fine.student, fine.amount);

        res.status(200).json({
            success: true,
            message: 'Fine marked as paid successfully',
            data: fine
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error marking fine as paid',
            error: error.message
        });
    }
}

module.exports = {
    getAllFines,
    getMyFines,
    markFinePaid
}