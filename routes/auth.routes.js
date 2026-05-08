const routes = require('express').Router();
const c = require('../controllers/auth.controller');

const auth = require('../middlewares/auth.middleware');

routes.use((req, res, next) => {
    // #swagger.tags = ['Auth APIs']
    next();
});

routes.post('/register', c.register);
routes.post('/login', c.login);
routes.post('/forgot-password', c.forgotPassword);
routes.post('/verify-otp', c.verifyOtp);
routes.post('/reset-password', c.resetPassword);

routes.get('/me', auth, c.getMe);
routes.put('/profile', auth, c.updateProfile);

module.exports = routes;