var express = require('express');
const {
  jwtObject,
  getValidation,
  validate,
  authenticateUser,
} = require('../middleware/middlewareRules');

const rolesController = require('../controllers/rolesController');

const {
  getAllRoles,
  getRolesById,
  createRoles,
  updateRoles,
  deleteRoles,
} = rolesController();

var rolesRouter = express.Router();

rolesRouter.get('/list', jwtObject, getAllRoles);
rolesRouter.get('/:id', jwtObject, getRolesById);
rolesRouter.post(
  '/create',
  [
    getValidation('create:roles'),
    validate,
    jwtObject,
    authenticateUser,
  ],
  createRoles,
);
rolesRouter.put(
  '/update',
  [
    getValidation('update:roles'),
    validate,
    jwtObject,
    authenticateUser,
  ],
  updateRoles,
);
rolesRouter.delete(
  '/delete/:id',
  [jwtObject, authenticateUser],
  deleteRoles,
);

module.exports = rolesRouter;
