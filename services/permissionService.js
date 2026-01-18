const mongoose = require('mongoose');
const models = require('../models');
const logsConstructor = require('../utils/logs');
const constants = require('../components/constants/index');
const { buildError } = require('../utils/response');

function permissionService() {
  async function getAllPermission(skip = 0, limit = 10, type) {
    try {
      let match = {};

      if (type.length > 0) {
        match = { type: { $in: type } };
      }

      const permissions = await models.Permissions.aggregate([
        {
          $match: match,
        },
        {
          $project: {
            _id: 1,
            action: 1,
            subject: 1,
            type: 1,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);
      const data = [];
      permissions.forEach((permission) => {
        permission._id.toString();
        data.push(permission);
      });
      return data;
    } catch (e) {
      return buildError(500, e.message);
    }
  }

  async function getPermissionById(id) {
    try {
      const query = await models.Permissions.find(
        {
          _id: mongoose.Types.ObjectId(id) 
        },
        {
            _id: 1,
            action: 1,
            subject: 1,
            type: 1,
        },
      );

      const roles = query[0];

      const data = {
        _id: roles._id.toString(),
        action: roles.action || '',
        subject: roles.subject || '',
        type: roles.type || '',
      };

      return data;
    } catch (e) {
      return buildError(500, e.message);
    }
  }

  async function createPermission(param, req) {
    try {
      const allowedActions = ['read', 'update', 'delete'];
      if (!allowedActions.includes(param.action.toLowerCase())) {
        return buildError(500, 'El valor de (action) no es válido.');
      }
      let permission = new models.Permissions({
        action: param.action.toLowerCase(),
        subject: param.subject.toLowerCase(),
        type: param.type,
      });
      const data = await permission.save();
      if (data) {
        const extractedData = {
          _id: data._id,
          action: data.action,
          subject: data.subject,
          type: data.type,
        };
        await logsConstructor(
          constants.LOG_TYPE.CREATE_PERMISSION,
          extractedData,
          'Permiso nuevo',
          req.headers['console-user'],
        );
      }
      return data;
    } catch (e) {
      return buildError(500, e.message);
    }
  }

  async function updatePermission(param, req) {
    try {
      const allowedActions = ['read', 'update', 'delete'];
      if (!allowedActions.includes(param.action.toLowerCase())) {
        return buildError(500, 'El valor de (action) no es válido.');
      }
      const update = {
        $set: {
          action: param.action.toLowerCase(),
          subject: param.subject.toLowerCase(),
          type: param.type,
        },
      };
      const data = await models.Permissions.updateOne(
        { _id: mongoose.Types.ObjectId(param.id) },
        update,
      );
      if (data) {
        const extractedData = {
          _id: param._id,
          action: param.action,
          subject: param.subject,
          type: param.type,
        };
        await logsConstructor(
          constants.LOG_TYPE.UPDATE_PERMISSION,
          extractedData,
          'Permiso actualizado',
          req.headers['console-user'],
        );
      }
      return data;
    } catch (e) {
      return buildError(500, e.message);
    }
  }

  async function deletePermission(id, req) {
    try {
      const permission = await models.Permissions.findOne({
        _id: mongoose.Types.ObjectId(id),
      });

      if (!permission) {
        return buildError(500, 'Permiso no encontrado!');
      }

      if (permission.subject === 'main') {
        return buildError(500, 'No se puede eliminar este permiso!');
      }

      const permissionsRol = await models.Roles.findOne({
        permissions: mongoose.Types.ObjectId(id),
      });

      if (permissionsRol) {
        return buildError(500, 'Permiso asignado a un Rol!');
      }

      const deletionResult = await models.Permissions.deleteOne({
        _id: mongoose.Types.ObjectId(id),
      });
      if (deletionResult) {
        const extractedData = {
          _id: permission._id,
          action: permission.action,
          subject: permission.subject,
          type: permission.type,
        };
        await logsConstructor(
          constants.LOG_TYPE.DELETE_PERMISSION,
          extractedData,
          'Permiso eliminado',
          req.headers['console-user'],
        );
      }
      return deletionResult;
    } catch (e) {
      return buildError(500, e.message);
    }
  }

  return {
    getAllPermission,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
  };
}

module.exports = permissionService();
