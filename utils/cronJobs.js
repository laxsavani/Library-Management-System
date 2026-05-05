const cron = require('node-cron');
const { Op } = require('sequelize');
const { BorrowRecord, Reservation, OtpToken, Book, User } = require('../models');
const { sendBorrowEmail, sendReservationCancelledEmail, sendMail } = require('./sendMail');
const { calculateFine } = require('./fineCalculator');
require('dotenv').config();

// * * * * *
// │ │ │ │ │
// │ │ │ │ └── Day of Week (0–7) → Sunday = 0 or 7
// │ │ │ └──── Month (1–12)
// │ │ └────── Day of Month (1–31)
// │ └──────── Hour (0–23)
// └────────── Minute (0–59)

const getTodayRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { today, tomorrow };
}

cron.schedule('* * * * *', async () => {
    try {
        console.log('⏰ [CRON] Running Due Date Reminder Job...');
    } catch (error) {
        console.error('❌ [CRON] Due Date Reminder Job Failed:', err.message);
    }
}, { timezone: 'Asia/Kolkata' });

//Cleanup Expired OTPs (Every 60 minutes)
cron.schedule('*/60 * * * *', async () => {
    console.log('🧹 [CRON] Running OTP Cleanup Job...');
    try {
        const now = new Date();

        const deleted = await OtpToken.destroy({
            where: {
                expires_at: { [Op.lt]: now },
                is_used: false,
            },
        });

        console.log(`✅ [CRON] OTP Cleanup Done. Deleted: ${deleted} expired OTP(s).`);
    } catch (error) {
        console.error('❌ [CRON] Due Date Reminder Job Failed:', err.message);
    }
})

//Due Date Reminder (Every day at 8:00 AM)
cron.schedule('0 8 * * *', async () => {
    console.log('⏰ [CRON] Running Due Date Reminder Job...');
    try {
        const { tomorrow } = getTodayRange();
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        const records = await BorrowRecord.findAll({
            where: {
                status: 'borrowed',
                due_date: {
                    [Op.gte]: tomorrow,
                    [Op.lt]: dayAfterTomorrow,
                },
            },
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Book, as: 'book', attributes: ['title'] },
            ],
        });

        if (records.length === 0) {
            console.log('✅ [CRON] No due date reminders to send today.');
            return;
        }

        for (const record of records) {
            await sendMail({
                to: record.student.email,
                subject: `⏰ Reminder: "${record.book.title}" is due tomorrow`,
                html: `
          <h2>📅 Book Due Tomorrow</h2>
          <p>Hi <strong>${record.student.name}</strong>,</p>
          <p>This is a reminder that your borrowed book:</p>
          <p>📗 <strong>${record.book.title}</strong></p>
          <p>is due tomorrow on <strong>${new Date(record.due_date).toDateString()}</strong>.</p>
          <p>Please return it on time to avoid a fine of ₹${process.env.FINE_PER_DAY || 5} per day.</p>
          <br/>
          <p>Thank you, Library Team 📚</p>
        `,
            });
            console.log(`📧 [CRON] Due reminder sent to ${record.student.email} for "${record.book.title}"`);
        }

        console.log(`✅ [CRON] Due Date Reminder Job Done. Sent: ${records.length} email(s).`);
    } catch (err) {
        console.error('❌ [CRON] Due Date Reminder Job Failed:', err.message);
    }
}, {
    timezone: 'Asia/Kolkata',
});

//Overdue Alert (Every day at 9:00 AM)
cron.schedule('0 9 * * *', async () => {
    console.log('⏰ [CRON] Running Overdue Alert Job...');
    try {
        const { today } = getTodayRange();

        const records = await BorrowRecord.findAll({
            where: {
                status: 'borrowed',
                due_date: { [Op.lt]: today },
            },
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Book, as: 'book', attributes: ['title'] },
            ],
        });

        if (records.length === 0) {
            console.log('✅ [CRON] No overdue books found today.');
            return;
        }

        for (const record of records) {
            const currentFine = calculateFine(record.due_date, new Date());
            const dueDate = new Date(record.due_date);
            const today2 = new Date();
            const daysLate = Math.ceil((today2 - dueDate) / (1000 * 60 * 60 * 24));

            await sendMail({
                to: record.student.email,
                subject: `⚠️ Overdue Book: "${record.book.title}"`,
                html: `
          <h2>⚠️ Overdue Book Alert</h2>
          <p>Hi <strong>${record.student.name}</strong>,</p>
          <p>Your borrowed book is overdue:</p>
          <p>📕 <strong>${record.book.title}</strong></p>
          <table style="border-collapse:collapse; margin:16px 0;">
            <tr>
              <td style="padding:6px 16px 6px 0;"><strong>Due Date:</strong></td>
              <td style="padding:6px 0;">${dueDate.toDateString()}</td>
            </tr>
            <tr>
              <td style="padding:6px 16px 6px 0;"><strong>Days Late:</strong></td>
              <td style="padding:6px 0; color:red;">${daysLate} day(s)</td>
            </tr>
            <tr>
              <td style="padding:6px 16px 6px 0;"><strong>Fine So Far:</strong></td>
              <td style="padding:6px 0; color:red;">₹${currentFine}</td>
            </tr>
          </table>
          <p>Please return the book immediately to avoid further fines.</p>
          <p>Fine will be collected at the library counter upon return.</p>
          <br/>
          <p>Thank you, Library Team 📚</p>
        `,
            });
            console.log(`📧 [CRON] Overdue alert sent to ${record.student.email} — ${daysLate} days late, fine ₹${currentFine}`);
        }

        console.log(`✅ [CRON] Overdue Alert Job Done. Sent: ${records.length} email(s).`);
    } catch (err) {
        console.error('❌ [CRON] Overdue Alert Job Failed:', err.message);
    }
}, {
    timezone: 'Asia/Kolkata',
});

//Reservation Expiry Reminder (Every day at 10:00 AM)
cron.schedule('0 10 * * *', async () => {
    console.log('⏰ [CRON] Running Reservation Expiry Reminder Job...');
    try {
        const { tomorrow } = getTodayRange();
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        const reservations = await Reservation.findAll({
            where: {
                status: 'pending',
                expires_at: {
                    [Op.gte]: tomorrow,
                    [Op.lt]: dayAfterTomorrow,
                },
            },
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Book, as: 'book', attributes: ['title'] },
            ],
        });

        if (reservations.length === 0) {
            console.log('✅ [CRON] No reservation expiry reminders to send today.');
            return;
        }

        for (const res of reservations) {
            await sendMail({
                to: res.student.email,
                subject: `🔔 Reservation Expiring Tomorrow: "${res.book.title}"`,
                html: `
          <h2>🔔 Reservation Expiry Reminder</h2>
          <p>Hi <strong>${res.student.name}</strong>,</p>
          <p>Your reservation for the following book will <strong>expire tomorrow</strong>:</p>
          <p>📗 <strong>${res.book.title}</strong></p>
          <p>📅 <strong>Expires On:</strong> ${new Date(res.expires_at).toDateString()}</p>
          <p>Please visit the library before expiry to borrow the book.</p>
          <p>If not collected, your reservation will be automatically cancelled.</p>
          <br/>
          <p>Thank you, Library Team 📚</p>
        `,
            });
            console.log(`📧 [CRON] Expiry reminder sent to ${res.student.email} for "${res.book.title}"`);
        }

        console.log(`✅ [CRON] Reservation Expiry Reminder Job Done. Sent: ${reservations.length} email(s).`);
    } catch (err) {
        console.error('❌ [CRON] Reservation Expiry Reminder Job Failed:', err.message);
    }
}, {
    timezone: 'Asia/Kolkata',
});

//Auto-Cancel Expired Reservations (Every day at 12:00 AM)
cron.schedule('0 0 * * *', async () => {
    console.log('⏰ [CRON] Running Auto-Cancel Expired Reservations Job...');
    try {
        const now = new Date();

        const expiredReservations = await Reservation.findAll({
            where: {
                status: 'pending',
                expires_at: { [Op.lt]: now },
            },
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Book, as: 'book', attributes: ['title'] },
            ],
        });

        if (expiredReservations.length === 0) {
            console.log('✅ [CRON] No expired reservations to cancel.');
            return;
        }

        for (const res of expiredReservations) {
            // Update status to cancelled
            await res.update({ status: 'cancelled' });

            // Send cancellation email
            await sendReservationCancelledEmail(
                res.student.email,
                res.student.name,
                res.book.title
            );

            console.log(`🗑️ [CRON] Reservation auto-cancelled for ${res.student.email} — "${res.book.title}"`);
        }

        console.log(`✅ [CRON] Auto-Cancel Job Done. Cancelled: ${expiredReservations.length} reservation(s).`);
    } catch (err) {
        console.error('❌ [CRON] Auto-Cancel Expired Reservations Job Failed:', err.message);
    }
}, {
    timezone: 'Asia/Kolkata',
});

console.log('✅ All Cron Jobs Registered:');
console.log('📅 Due Date Reminder        → Every day at 8:00 AM');
console.log('⚠️  Overdue Alert            → Every day at 9:00 AM');
console.log('🔔 Reservation Expiry       → Every day at 10:00 AM');
console.log('🗑️  Auto-Cancel Reservations → Every day at 12:00 AM');
console.log('🧹 OTP Cleanup              → Every 60 minutes');