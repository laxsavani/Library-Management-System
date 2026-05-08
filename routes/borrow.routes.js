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

routes.get('/my-active', auth, rbac(['student']), c.getMyActiveBorrows);
routes.get('/my-history', auth, rbac(['student']), c.getMyBorrowHistory);
routes.get('/overdue', auth, rbac(['admin', 'librarian']), c.getAllOverdueBooks);
routes.get('/stats', auth, rbac(['admin']), c.getBorrowStats);

module.exports = routes;