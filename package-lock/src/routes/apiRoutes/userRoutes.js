const express = require('express');
const userController = require('../../controllers/userController');
const { catchErrors } = require('../../handlers/errorHandlers');
const createMiddlewares = require('../../middlewares');

const router = express.Router();
const userCont = userController();
const middleware = createMiddlewares();

router.get(
  '/users',
  middleware.isValidAuthToken,
  catchErrors(userCont.paginatedList),
);
router.get(
  '/users/all',
  middleware.isValidAuthToken,
  catchErrors(userCont.listAll),
);
router.post(
  '/users',
  middleware.isValidAuthToken,
  catchErrors(userCont.create),
);
router.delete(
  '/users/:id',
  middleware.isValidAuthToken,
  catchErrors(userCont.remove),
);
router.put(
  '/users/:id',
  middleware.isValidAuthToken,
  catchErrors(userCont.update),
);
router.patch(
  '/users/:id',
  middleware.isValidAuthToken,
  catchErrors(userCont.updateStatus),
);

module.exports = router;
