const routes = require('express').Router();
const c = require('../controllers/borrow.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/role.middleware');

routes.use((req, res, next) => {
    // #swagger.tags = ['Borrow APIs']
    next();
});

routes.post('/', auth, rbac(['student']), c.borrowBook);
routes.put('/return/:id', auth, rbac(['librarian', 'student']), c.returnBook);

module.exports = routes;