const routes = require('express').Router();
const c = require('../controllers/book.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

routes.use((req, res, next) => {
    // #swagger.tags = ['Books APIs']
    next();
});

routes.get('/', auth, rbac(['admin', 'librarian', 'student']), c.getAllBooks);
routes.get('/search', auth, rbac(['admin', 'librarian', 'student']), c.searchBooks);
routes.get('/:id', auth, rbac(['admin', 'librarian', 'student']), c.getBookById);

routes.post('/', auth, rbac(['admin', 'librarian']), upload.single('cover_image'), c.addBook);
routes.put('/:id', auth, rbac(['admin', 'librarian']), upload.single('cover_image'), c.updateBook);

routes.delete('/:id', auth, rbac(['admin']), c.deleteBook);

module.exports = routes;