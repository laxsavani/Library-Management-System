const routes = require('express').Router();
const c = require('../controllers/role.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/role.middleware');

routes.use((req, res, next) => {
    // #swagger.tags = ['Role APIs']
    next();
});

routes.get('/', auth, rbac(['admin']), c.getAllRoles);
routes.post('/assign', auth, rbac(['admin']), c.assignRole);

module.exports = routes;