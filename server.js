const express = require('express')
const bodyparser = require('body-parser')
const db = require('./models')
require('dotenv').config()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/books', require('./routes/book.routes.js'));
app.use('/api/borrow', require('./routes/borrow.routes.js'));
app.use('/api/students', require('./routes/student.routes.js'));
app.use('/api/fine', require('./routes/fine.routes.js'));
app.use('/api/roles', require('./routes/role.routes.js'));
app.use('/api/reservations', require('./routes/reservation.routes.js'));
app.use('/api/reviews', require('./routes/review.routes.js'));
app.use('/api/categories', require('./routes/categories.routes.js'));  

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

db.sequelize.authenticate().then(() => {
    console.log('Database connected ✅')
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}✅`)
    })
}).catch(err => {
    console.log(err)
})  