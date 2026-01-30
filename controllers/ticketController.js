const { validationResult } = require("express-validator");
const ticketService = require("../services/ticketService");
const Response = require("../components/response");

function ticketController() {
  /**
   * Crear ticket (PÚBLICO)
   */
  async function createTicket(req, res) {
    const responseClass = new Response();
    const ticket = req.body;

    ticketService
      .createTicket(ticket, req)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(
              true,
              "Ticket creado correctamente!",
              200,
              data
            )
          );
      })
      .catch((error) => {
        return res.status(error.code || 500).send(error);
      });
  }

  /**
   * Obtener todos los tickets (ADMIN)
   */
  async function getAllTickets(req, res) {
    const responseClass = new Response();
    const { skip, limit, status } = req.query;

    ticketService
      .getAllTickets(parseInt(skip), parseInt(limit), status)
      .then((data) => {
        return res
          .status(200)
          .send(responseClass.buildResponse(true, "success", 200, data));
      })
      .catch((error) => {
        return res.status(error.code || 500).send(error);
      });
  }

  /**
   * Obtener ticket por ID (ADMIN)
   */
  async function getTicketById(req, res) {
    const responseClass = new Response();
    const { id } = req.params;

    ticketService
      .getTicketById(id)
      .then((data) => {
        return res
          .status(200)
          .send(responseClass.buildResponse(true, "success", 200, data));
      })
      .catch((error) => {
        return res.status(error.code || 500).send(error);
      });
  }

  /**
   * Aprobar ticket (ADMIN)
   */
  async function approveTicket(req, res) {
    const responseClass = new Response();
    const { id } = req.params;
    const userId = req.user ? req.user.userId : null;

    if (!userId) {
      return res
        .status(401)
        .send(
          responseClass.buildResponse(
            false,
            "Usuario no autenticado",
            401,
            {}
          )
        );
    }

    ticketService
      .approveTicket(id, userId, req)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(
              true,
              "Ticket aprobado!",
              200,
              data
            )
          );
      })
      .catch((error) => {
        return res.status(error.code || 500).send(error);
      });
  }

  /**
   * Rechazar ticket (ADMIN)
   */
  async function rejectTicket(req, res) {
    const responseClass = new Response();
    const { id } = req.params;
    const userId = req.user ? req.user.userId : null;

    if (!userId) {
      return res
        .status(401)
        .send(
          responseClass.buildResponse(
            false,
            "Usuario no autenticado",
            401,
            {}
          )
        );
    }

    ticketService
      .rejectTicket(id, userId, req)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(
              true,
              "Ticket rechazado!",
              200,
              data
            )
          );
      })
      .catch((error) => {
        return res.status(error.code || 500).send(error);
      });
  }

  /**
   * Consultar ticket por número (PÚBLICO)
   */
  async function getTicketByNumber(req, res) {
    const responseClass = new Response();
    const { ticketNumber } = req.params;

    ticketService
      .getTicketByNumber(ticketNumber)
      .then((data) => {
        return res
          .status(200)
          .send(
            responseClass.buildResponse(true, "success", 200, data)
          );
      })
      .catch((error) => {
        return res.status(error.code || 500).send(error);
      });
  }

  return {
    createTicket,
    getAllTickets,
    getTicketById,
    approveTicket,
    rejectTicket,
    getTicketByNumber,
  };
}

module.exports = ticketController;
