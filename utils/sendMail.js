const transporter = require('../config/mailer');

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Mail sending failed:', error.message);
  }
};

// 1. Welcome email on register
const sendWelcomeEmail = (user) =>
  sendMail({
    to: user.email,
    subject: 'Welcome to the Library System',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #4a90e2, #6fb1fc); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">📚 Library System</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#4a90e2; margin-top:0;">Welcome, ${user.name}! 👋</h2>
            
            <p style="font-size:15px; line-height:1.6;">
              We're excited to have you join our library community!
            </p>

            <p style="font-size:15px; line-height:1.6;">
              Your account has been successfully created. You can now browse, reserve, and borrow books anytime.
            </p>

            <!-- Highlight Box -->
            <div style="background:#f1f7ff; padding:15px; border-radius:8px; margin:20px 0;">
              <p style="margin:0; font-size:14px;">
                📖 Explore a wide collection of books<br/>
                🔔 Get notifications for reservations<br/>
                ⏳ Track your borrow history easily
              </p>
            </div>

            <!-- Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#4a90e2; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                Visit Library
              </a>
            </div>

            <p style="font-size:14px; color:#777;">
              If you have any questions, feel free to contact us anytime.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 2. Borrow confirmation
const sendBorrowConfirmation = (user, book, dueDate) =>
  sendMail({
    to: user.email,
    subject: 'Book Borrow Confirmation',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #4a90e2, #6fb1fc); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">📚 Library System</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#4a90e2; margin-top:0;">Borrow Confirmation ✅</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              You have successfully borrowed the following book:
            </p>

            <!-- Book Details Card -->
            <div style="background:#f1f7ff; padding:15px; border-radius:8px; margin:20px 0;">
              <p style="margin:0; font-size:15px;">
                📖 <strong>${book.title}</strong><br/>
                ✍️ ${book.author}
              </p>
            </div>

            <!-- Due Date -->
            <div style="background:#fff4e5; padding:12px; border-radius:8px; margin-bottom:20px;">
              <p style="margin:0; font-size:14px; color:#d35400;">
                ⏳ <strong>Due Date:</strong> ${dueDate}
              </p>
            </div>

            <p style="font-size:14px; color:#555;">
              Please return the book on or before the due date to avoid any late fees.
            </p>

            <!-- Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#4a90e2; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                View My Books
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 3. Return confirmation
const sendReturnConfirmation = (user, book, fineGenerated, fineAmount) =>
  sendMail({
    to: user.email,
    subject: 'Book Return Confirmation',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #4a90e2, #6fb1fc); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">📚 Library System</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#4a90e2; margin-top:0;">Return Confirmation 📖</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              You have successfully returned the following book:
            </p>

            <!-- Book Details -->
            <div style="background:#f1f7ff; padding:15px; border-radius:8px; margin:20px 0;">
              <p style="margin:0; font-size:15px;">
                📖 <strong>${book.title}</strong>
              </p>
            </div>

            ${fineGenerated
        ? `
                  <!-- Fine Section -->
                  <div style="background:#fdecea; padding:15px; border-radius:8px; margin-bottom:20px;">
                    <p style="margin:0; font-size:14px; color:#e74c3c;">
                      ⚠️ <strong>Late Return Fine:</strong> ₹${fineAmount}
                    </p>
                  </div>

                  <p style="font-size:14px; color:#555;">
                    Please pay the fine at the library counter at your earliest convenience.
                  </p>
                `
        : `
                  <!-- Success Section -->
                  <div style="background:#eafaf1; padding:15px; border-radius:8px; margin-bottom:20px;">
                    <p style="margin:0; font-size:14px; color:#27ae60;">
                      ✅ No fine generated. Thank you for returning on time!
                    </p>
                  </div>
                `
      }

            <!-- Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#4a90e2; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                View My Account
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 4. Fine created notification
const sendFineCreatedEmail = (user, book, fineAmount) =>
  sendMail({
    to: user.email,
    subject: 'Fine Generated for Late Return',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #e74c3c, #ff7675); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">⚠️ Library Notice</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#e74c3c; margin-top:0;">Fine Generated</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              A fine has been generated due to the late return of the following book:
            </p>

            <!-- Book Details -->
            <div style="background:#fdf2f2; padding:15px; border-radius:8px; margin:20px 0;">
              <p style="margin:0; font-size:15px;">
                📖 <strong>${book.title}</strong>
              </p>
            </div>

            <!-- Fine Amount -->
            <div style="background:#fdecea; padding:15px; border-radius:8px; margin-bottom:20px; text-align:center;">
              <p style="margin:0; font-size:16px; color:#e74c3c;">
                💰 <strong>Fine Amount: ₹${fineAmount}</strong>
              </p>
            </div>

            <p style="font-size:14px; color:#555;">
              Please pay this fine at the library counter as soon as possible to avoid further penalties.
            </p>

            <!-- Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#e74c3c; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                Pay Fine
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 5. Fine paid confirmation
const sendFinePaidEmail = (user, fineAmount) =>
  sendMail({
    to: user.email,
    subject: 'Fine Payment Confirmed',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #27ae60, #2ecc71); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">✅ Payment Successful</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#27ae60; margin-top:0;">Fine Cleared</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              Your fine payment has been successfully processed. Thank you!
            </p>

            <!-- Fine Details -->
            <div style="background:#eafaf1; padding:15px; border-radius:8px; margin:20px 0; text-align:center;">
              <p style="margin:0; font-size:16px; color:#27ae60;">
                💰 <strong>Amount Paid: ₹${fineAmount}</strong>
              </p>
            </div>

            <p style="font-size:14px; color:#555;">
              Your account is now clear and you can continue borrowing books without any restrictions.
            </p>

            <!-- Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#27ae60; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                View Account
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 6. OTP email
const sendOtpEmail = (user, otp) =>
  sendMail({
    to: user.email,
    subject: 'Password Reset OTP',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #4a90e2, #6fb1fc); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">🔐 Security Verification</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333; text-align:center;">
            <h2 style="color:#4a90e2; margin-top:0;">Password Reset OTP</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              Use the OTP below to reset your password:
            </p>

            <!-- OTP Box -->
            <div style="margin:25px 0;">
              <span style="
                display:inline-block;
                padding:15px 25px;
                font-size:28px;
                font-weight:bold;
                letter-spacing:6px;
                background:#f1f7ff;
                border:2px dashed #4a90e2;
                border-radius:10px;
                color:#4a90e2;">
                ${otp}
              </span>
            </div>

            <!-- Expiry -->
            <p style="font-size:14px; color:#e67e22;">
              ⏳ Valid for <strong>${process.env.OTP_EXPIRE_MINUTES} minutes</strong>
            </p>

            <p style="font-size:13px; color:#777; margin-top:20px;">
              If you did not request this, please ignore this email or contact support.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 7. Password reset confirmation
const sendPasswordResetConfirmation = (user) =>
  sendMail({
    to: user.email,
    subject: 'Password Reset Successful',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #27ae60, #2ecc71); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">🔒 Security Update</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#27ae60; margin-top:0;">Password Changed Successfully</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              Your password has been successfully updated. You can now log in using your new password.
            </p>

            <!-- Info Box -->
            <div style="background:#eafaf1; padding:15px; border-radius:8px; margin:20px 0;">
              <p style="margin:0; font-size:14px; color:#27ae60;">
                ✅ Your account is secure and up to date.
              </p>
            </div>

            <!-- Warning Box -->
            <div style="background:#fdecea; padding:15px; border-radius:8px; margin-bottom:20px;">
              <p style="margin:0; font-size:14px; color:#e74c3c;">
                ⚠️ If you did NOT make this change, please contact the library immediately.
              </p>
            </div>

            <!-- Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#27ae60; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                Go to Login
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 8. Reservation confirmation
const sendReservationConfirmation = (user, book, expiresAt) =>
  sendMail({
    to: user.email,
    subject: 'Book Reservation Confirmed',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #8e44ad, #a569bd); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">📚 Reservation Confirmed</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#8e44ad; margin-top:0;">Your Book is Reserved 🎉</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              Your reservation has been successfully placed for the following book:
            </p>

            <!-- Book Details -->
            <div style="background:#f5eef8; padding:15px; border-radius:8px; margin:20px 0;">
              <p style="margin:0; font-size:15px;">
                📖 <strong>${book.title}</strong><br/>
                ✍️ ${book.author}
              </p>
            </div>

            <!-- Expiry Info -->
            <div style="background:#fff4e5; padding:12px; border-radius:8px; margin-bottom:20px;">
              <p style="margin:0; font-size:14px; color:#d35400;">
                ⏳ <strong>Reservation Expires:</strong> ${expiresAt}
              </p>
            </div>

            <p style="font-size:14px; color:#555;">
              You will be notified as soon as the book becomes available. Please make sure to collect it before the reservation expires.
            </p>

            <!-- Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#8e44ad; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                View Reservation
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 9. Book available notification (for reserved student)
const sendBookAvailableEmail = (user, book) =>
  sendMail({
    to: user.email,
    subject: 'Reserved Book Now Available',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #27ae60, #2ecc71); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">🎉 Good News!</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#27ae60; margin-top:0;">Your Book is Now Available 📖</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              The book you reserved is now available for borrowing:
            </p>

            <!-- Book Details -->
            <div style="background:#eafaf1; padding:15px; border-radius:8px; margin:20px 0;">
              <p style="margin:0; font-size:15px;">
                📖 <strong>${book.title}</strong><br/>
                ✍️ ${book.author}
              </p>
            </div>

            <p style="font-size:14px; color:#555;">
              Please visit the library soon to collect your book before your reservation expires.
            </p>

            <!-- Action Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#27ae60; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                Borrow Now
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 10. Reservation cancelled
const sendReservationCancelledEmail = (user, book) =>
  sendMail({
    to: user.email,
    subject: 'Reservation Cancelled',
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #e74c3c, #ff7675); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">❌ Reservation Cancelled</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#e74c3c; margin-top:0;">Reservation Update</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${user.name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              Your reservation for the following book has been cancelled:
            </p>

            <!-- Book Details -->
            <div style="background:#fdecea; padding:15px; border-radius:8px; margin:20px 0;">
              <p style="margin:0; font-size:15px;">
                📖 <strong>${book.title}</strong><br/>
                ✍️ ${book.author}
              </p>
            </div>

            <p style="font-size:14px; color:#555;">
              If you did not request this cancellation or believe this was a mistake, please contact the library immediately.
            </p>

            <!-- Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#e74c3c; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                Contact Library
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>`,
  });

// 11. Password reset 
const sendPasswordResetEmail = (to, name) =>
  sendMail({
    to,
    subject: `Password Reset Successful`,
    html: `<div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:linear-gradient(90deg, #27ae60, #2ecc71); padding:20px; text-align:center; color:#ffffff;">
            <h1 style="margin:0; font-size:24px;">🔒 Password Updated</h1>
          </div>

          <!-- Body -->
          <div style="padding:25px; color:#333;">
            <h2 style="color:#27ae60; margin-top:0;">Password Reset Successful</h2>

            <p style="font-size:15px; line-height:1.6;">
              Hi <strong>${name}</strong>,
            </p>

            <p style="font-size:15px; line-height:1.6;">
              Your password has been successfully reset. You can now log in using your new password.
            </p>

            <!-- Success Box -->
            <div style="background:#eafaf1; padding:15px; border-radius:8px; margin:20px 0;">
              <p style="margin:0; font-size:14px; color:#27ae60;">
                ✅ Your account is now secure and up to date.
              </p>
            </div>

            <!-- Warning Box -->
            <div style="background:#fdecea; padding:15px; border-radius:8px; margin-bottom:20px;">
              <p style="margin:0; font-size:14px; color:#e74c3c;">
                ⚠️ If you did NOT make this change, please contact support immediately.
              </p>
            </div>

            <!-- Button -->
            <div style="text-align:center; margin:25px 0;">
              <a href="#" style="background:#27ae60; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:6px; font-size:14px; display:inline-block;">
                Go to Login
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Library System. All rights reserved.
          </div>

        </div>
      </div>
    `,
  });

module.exports = {
  sendWelcomeEmail,
  sendBorrowConfirmation,
  sendReturnConfirmation,
  sendFineCreatedEmail,
  sendFinePaidEmail,
  sendOtpEmail,
  sendPasswordResetConfirmation,
  sendReservationConfirmation,
  sendBookAvailableEmail,
  sendReservationCancelledEmail,
  sendPasswordResetEmail
};