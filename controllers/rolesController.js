const { validationResult } = require('express-validator');
const rolesService = require('../services/rolesService');
const Response = require('../components/response');

function RolesController() {
  async function getAllRoles(req, res) {
    const responseClass = new Response();

    const { skip, limit, type } = req.query;

    let types = [];
    types = type ? type.split(',') : [];

    rolesService
      .getAllRoles(parseInt(skip), parseInt(limit), types)
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

  async function getRolesById(req, res) {
    const responseClass = new Response();
    var { id } = req.params;

    rolesService
      .getRolesById(id)
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

  async function createRoles(req, res) {
    const responseClass = new Response();
    let roles = req.body;

    rolesService
      .createRoles(roles, req)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(
              true,
              'Rol creado!',
              200,
              data,
            ),
          );
      })
      .catch((error) => {
        return res.status(error.code).send(error);
      });
  }

  async function updateRoles(req, res) {
    const responseClass = new Response();
    let roles = req.body;

    rolesService
      .updateRoles(roles, req)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(
              true,
              'Rol Actualizado!',
              200,
              data,
            ),
          );
      })
      .catch((error) => {
        return res.status(error.code).send(error);
      });
  }

  async function deleteRoles(req, res) {
    const responseClass = new Response();
    const { id } = req.params;

    rolesService
      .deleteRoles(id, req)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(
              true,
              'Rol Eliminado!',
              200,
              data,
            ),
          );
      })
      .catch((error) => {
        return res.status(error.code).send(error);
      });
  }

  return {
    getAllRoles,
    getRolesById,
    createRoles,
    updateRoles,
    deleteRoles,
  };
}

module.exports = RolesController;
