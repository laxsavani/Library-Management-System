const routes = require('express').Router();
const c = require('../controllers/fine.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/role.middleware');

routes.use((req, res, next) => {
    // #swagger.tags = ['Fine APIs']
    next();
});

routes.get('/', auth, rbac(['admin', 'librarian']), c.getAllFines);
routes.get('/my', auth, rbac(['student']), c.getMyFines);
routes.put('/mark-paid/:id', auth, rbac(['admin', 'librarian']), c.markFinePaid);

module.exports = routes;