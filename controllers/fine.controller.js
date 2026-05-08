const { Fine, BorrowRecord, User, Book } = require('../models');
const { sendFinePaidEmail } = require('../utils/sendMail');
const { Op, fn, col } = require('sequelize');

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

const getMyTotalUnpaidFine = async (req, res) => {
    try {
        const total = await Fine.sum('amount', {
            where: { student_id: req.user.id, status: 'unpaid' }
        }) || 0;
        res.status(200).json({ success: true, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getAdminDebtors = async (req, res) => {
    try {
        const threshold = req.query.threshold || 0;
        const debtors = await Fine.findAll({
            attributes: [
                'student_id',
                [fn('SUM', col('amount')), 'total_debt']
            ],
            where: { status: 'unpaid' },
            include: [{ model: User, as: 'student', attributes: ['id', 'name', 'email'] }],
            group: ['student_id', 'student.id'],
            having: { total_debt: { [Op.gt]: threshold } }
        });
        res.status(200).json({ success: true, debtors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getAllFines,
    getMyFines,
    markFinePaid,
    getMyTotalUnpaidFine,
    getAdminDebtors
}