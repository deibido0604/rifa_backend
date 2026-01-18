var express = require('express');
const {
  jwtObject,
  getValidation,
  validate,
  authenticateUser,
} = require('../middleware/middlewareRules');
const permissionController = require('../controllers/permissionController');

const {
  getAllPermission,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} = permissionController();

var permissionRouter = express.Router();

permissionRouter.get('/list', jwtObject, getAllPermission);
permissionRouter.get('/:id', jwtObject, getPermissionById);
permissionRouter.post(
  '/create',
  [
    getValidation('create:permission'),
    validate,
    jwtObject,
    authenticateUser,
  ],
  createPermission,
);
permissionRouter.put(
  '/update',
  [
    getValidation('update:permission'),
    validate,
    jwtObject,
    authenticateUser,
  ],
  updatePermission,
);
permissionRouter.delete('/delete/:id', jwtObject, deletePermission);

module.exports = permissionRouter;
