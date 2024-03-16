const isValidAuthToken = require('./isValidAuthToken');

const userModel = 'Admin';

const createMiddlewares = () => {
  let middlewares = {};
  middlewares.isValidAuthToken = (req, res, next) =>
    isValidAuthToken(userModel, req, res, next);
  return middlewares;
};

module.exports = createMiddlewares;
