const create = require('./create');
const paginatedList = require('./paginatedList');
const listAll = require('./listAll');
const remove = require('./remove');
const updateStatus = require('./updateStatus');

const userModel = 'Admin';

const createUserController = () => {
  let userController = {};
  userController.create = (req, res) => create(userModel, req, res);
  userController.paginatedList = (req, res) =>
    paginatedList(userModel, req, res);
  userController.listAll = (req, res) => listAll(userModel, req, res);
  userController.remove = (req, res) => remove(userModel, req, res);
  userController.update = (req, res) => update(userModel, req, res);
  userController.updateStatus = (req, res) => updateStatus(userModel, req, res);
  return userController;
};

module.exports = createUserController;
