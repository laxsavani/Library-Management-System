const routes = require('express').Router();
const c = require('../controllers/categories.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/role.middleware');

routes.use((req, res, next) => {
    // #swagger.tags = ['Categories APIs']
    next();
});

routes.get('/', auth, rbac(['admin', 'librarian', 'student']), c.getAllCategories);
routes.get('/:id', auth, rbac(['admin', 'librarian', 'student']), c.getCategoryById);
routes.post('/', auth, rbac(['admin', 'librarian']), c.createCategory);
routes.put('/:id', auth, rbac(['admin', 'librarian']), c.updateCategory);
routes.delete('/:id', auth, rbac(['admin']), c.deleteCategory);

module.exports = routes;