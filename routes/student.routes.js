const routes = require('express').Router();
const c = require('../controllers/student.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/role.middleware');

routes.use((req, res, next) => {
    // #swagger.tags = ['Student APIs']
    next();
});

routes.get('/', auth, rbac(['admin', 'librarian']), c.getAllStudents);
routes.get('/:id', auth, rbac(['admin', 'librarian']), c.getStudentById);
routes.delete('/:id', auth, rbac(['admin']), c.deleteStudent);

module.exports = routes;