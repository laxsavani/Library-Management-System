const { BorrowRecord, Book, User, Fine, Reservation } = require('../models');
const { calculateFine } = require('../utils/fineCalculator');
const { sendBorrowConfirmation, sendReturnConfirmation, sendFineCreatedEmail, sendBookAvailableEmail } = require('../utils/sendMail');

const borrowBook = async (req, res) => {
    try {
        const { book_id, return_date, due_date } = req.body;
        const student_id = req.user.id;

        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('-');
            return new Date(`${year}-${month}-${day}`);
        };

        if (!book_id || !due_date || !return_date) {
            return res.status(400).json({
                success: false,
                message: 'Book ID, due date, and return date are required'
            })
        }

        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            })
        }

        if (book.avail_copies <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Book is not available'
            })
        }

        const record = await BorrowRecord.create({
            student_id,
            book_id,
            borrow_date: new Date(),
            due_date: parseDate(due_date),
            return_date: parseDate(return_date),
            status: 'borrowed'
        })

        book.avail_copies -= 1;
        await book.save();

        const user = await User.findByPk(student_id);
        await sendBorrowConfirmation(user, book, record.due_date);

        return res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            borrowRecord: record
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const returnBook = async (req, res) => {
    try {
        const id = req.params.id;
        const record = await BorrowRecord.findByPk(id);
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found'
            })
        }

        if (record.status === 'returned') {
            return res.status(400).json({
                success: false,
                message: 'Book is already returned'
            })
        }

        const returnDate = new Date();
        record.return_date = returnDate;
        record.status = 'returned';
        await record.save();

        const book = await Book.findByPk(record.book_id);
        book.avail_copies += 1;
        await book.save();

        const fineAmount = calculateFine(record.due_date, returnDate)
        let fineGenerated = false

        if (fineAmount > 0) {
            await Fine.create({
                borrow_record_id: record.id,
                student_id: record.student_id,
                amount: fineAmount,
                status: 'unpaid',
            });
            fineGenerated = true;
            const student = await User.findByPk(record.student_id);
            await sendFineCreatedEmail(student, book, fineAmount);
        }

        const student = await User.findByPk(record.student_id);
        await sendReturnConfirmation(student, book, fineGenerated, fineAmount);

        const pendingReservation = await Reservation.findOne({
            where: { book_id: record.book_id, status: 'pending' },
            order: [['reserved_at', 'ASC']],
        });

        if (pendingReservation) {
            const reservedStudent = await User.findByPk(pendingReservation.student_id);
            await sendBookAvailableEmail(reservedStudent, book);
        }

        return res.status(200).json({
            success: true,
            message: 'Book returned successfully',
            fineGenerated,
            fineAmount: fineGenerated ? fineAmount : 0,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    borrowBook,
    returnBook
}