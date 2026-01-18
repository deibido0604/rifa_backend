const { validationResult } = require('express-validator');
const permissionService = require('../services/permissionService');
const Response = require('../components/response');

function permissionController() {
  async function getAllPermission(req, res) {
    const responseClass = new Response();

    const { skip, limit, type } = req.query;

    let types = [];
    types = type ? type.split(',') : [];

    permissionService
      .getAllPermission(parseInt(skip), parseInt(limit), types)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(true, 'success', 200, data),
          );
      })
      .catch((error) => {
        return res.status(error.code).send(error);
      });
  }

  async function getPermissionById(req, res) {
    const responseClass = new Response();
    var { id } = req.params;

    permissionService
      .getPermissionById(id)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(true, 'success', 200, data),
          );
      })
      .catch((error) => {
        return res.status(error.code).send(error);
      });
  }

  async function createPermission(req, res) {
    const responseClass = new Response();

    let permission = req.body;
    permissionService
      .createPermission(permission, req)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(
              true,
              'Permiso creado!',
              200,
              data,
            ),
          );
      })
      .catch((error) => {
        return res.status(error.code).send(error);
      });
  }

  async function updatePermission(req, res) {
    const responseClass = new Response();

    let permission = req.body;
    permissionService
      .updatePermission(permission, req)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(
              true,
              'Permiso actualizado!',
              200,
              data,
            ),
          );
      })
      .catch((error) => {
        return res.status(error.code).send(error);
      });
  }

  async function deletePermission(req, res) {
    const responseClass = new Response();
    const { id } = req.params;

    permissionService
      .deletePermission(id, req)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(true, 'Permiso eliminado!', 200, data),
          );
      })
      .catch((error) => {
        return res.status(error.code).send(error);
      });
  }
  return {
    getAllPermission,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
  };
}
module.exports = permissionController;
