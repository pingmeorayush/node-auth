const express = require('express');
const createAuthController = require('../../controllers/authController');
const createMiddlewares = require('../../middlewares');
const { catchErrors } = require('../../handlers/errorHandlers');

const router = express.Router();
const authController = createAuthController();

router.post('/login', catchErrors(authController.login));
router.post(
  '/logout',
  createMiddlewares().isValidAuthToken,
  catchErrors(authController.logout),
);
router.post('/forgot-password', catchErrors(authController.forgotPassword));
router.post('/reset-password', catchErrors(authController.resetPassword));

module.exports = router;
