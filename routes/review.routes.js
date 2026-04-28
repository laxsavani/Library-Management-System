const routes = require('express').Router();
const c = require('../controllers/review.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/role.middleware');

routes.use((req, res, next) => {
    // #swagger.tags = ['Review APIs']
    next();
});

routes.post('/', auth, rbac(['student']), c.submitReview);
routes.get('/book/:book_id', auth, rbac(['admin', 'librarian', 'student']), c.getReviewsByBook);
routes.get('/my', auth, rbac(['student']), c.getMyReviews);
routes.put('/:id', auth, rbac(['student']), c.updateReview);
routes.delete('/:id', auth, rbac(['admin', 'student']), c.deleteReview);

module.exports = routes;