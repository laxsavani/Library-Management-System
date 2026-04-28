const routes = require('express').Router();
const c = require('../controllers/reservation.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/role.middleware');

routes.use((req, res, next) => {
    // #swagger.tags = ['Reservation APIs']
    next();
});

routes.post('/', auth, rbac(['student']), c.createReservation);
routes.get('/', auth, rbac(['admin', 'librarian']), c.getAllReservations);
routes.get('/my', auth, rbac(['student']), c.getMyReservations);
routes.put('/cancel/:id', auth, rbac(['admin', 'librarian', 'student']), c.cancelReservation);
routes.put('/fulfil/:id', auth, rbac(['admin', 'librarian']), c.fulfilReservation);

module.exports = routes;