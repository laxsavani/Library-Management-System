# 📚 Library Management System (Backend)

A robust and scalable Library Management System built with **Node.js, Express, and MySQL (Sequelize)**. This backend supports Role-Based Access Control (RBAC), automated fine calculation, book reservations, and reviews.

---

## 🚀 Features

- **🔐 Authentication & RBAC**: Secure login/registration with JWT and role-based permissions (Admin, Librarian, Student).
- **📖 Book Management**: Full CRUD operations for books, including cover image uploads via Cloudinary.
- **🔄 Borrowing System**: Track borrowed books, due dates, and return status.
- **💰 Fine System**: Automated fine calculation for overdue books.
- **📅 Reservations**: Students can reserve books that are currently unavailable.
- **⭐ Reviews**: Students can rate and review books they have borrowed.
- **📧 Notifications**: Email notifications for registration, OTP verification, and reservations.
- **📄 API Documentation**: Fully documented with Swagger UI.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Security**: JWT, Bcrypt.js
- **File Storage**: Cloudinary (via Multer)
- **Mailing**: Nodemailer
- **API Docs**: Swagger

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [MySQL](https://www.mysql.com/)
- [Cloudinary Account](https://cloudinary.com/) (for image uploads)

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=library_db
   
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   
   FINE_PER_DAY=5
   
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_app_password
   MAIL_FROM="Library System <your_email@gmail.com>"
   
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   OTP_EXPIRE_MINUTES=10
   ```

4. **Database Setup:**
   ```bash
   # Create database manually in MySQL or via CLI
   npx sequelize-cli db:create
   
   # Run migrations
   npx sequelize-cli db:migrate
   
   # Seed initial data (Roles, etc.)
   npx sequelize-cli db:seed:all
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

---

## 📂 Project Structure

```text
├── config/             # Configuration files (DB, Cloudinary, Mailer)
├── controllers/        # Business logic for all modules
├── middlewares/        # Auth and RBAC middlewares
├── migrations/         # Sequelize database migrations
├── models/             # Sequelize database models
├── routes/             # API route definitions
├── seeders/            # Initial data seeds (Roles)
├── utils/              # Helper functions (Mail, OTP, Fine calc)
├── server.js           # Entry point
└── swagger-output.json # Generated API documentation
```

---

## 📖 API Documentation

Once the server is running, you can access the interactive API documentation at:
`http://localhost:5000/api-docs`

### Core Modules:
- **Auth**: `/api/auth`
- **Books**: `/api/books`
- **Borrow**: `/api/borrow`
- **Students**: `/api/students`
- **Fines**: `/api/fine`
- **Roles**: `/api/roles`
- **Reservations**: `/api/reservations`
- **Reviews**: `/api/reviews`
- **Categories**: `/api/categories`

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).