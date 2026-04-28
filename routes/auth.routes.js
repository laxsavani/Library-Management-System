const routes = require('express').Router();
const c = require('../controllers/auth.controller');

routes.use((req, res, next) => {
    // #swagger.tags = ['Auth APIs']
    next();
});

routes.post('/register', c.register);
routes.post('/login', c.login);
routes.post('/forgot-password', c.forgotPassword);
routes.post('/verify-otp', c.verifyOtp);
routes.post('/reset-password', c.resetPassword);

module.exports = routes;