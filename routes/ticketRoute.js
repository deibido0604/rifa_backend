var express = require("express");

const {
  jwtObject,
  getValidation,
  validate,
  authenticateUser,
} = require("../middleware/middlewareRules");

const ticketController = require("../controllers/ticketController");

const {
  createTicket,
  getAllTickets,
  getTicketById,
  approveTicket,
  rejectTicket,
  getTicketByNumber,
} = ticketController();

var ticketRouter = express.Router();

/**
 * =========================
 *  RUTAS PÚBLICAS
 * =========================
 */

// Crear ticket (nombre, teléfono, imagen)
ticketRouter.post(
  "/create",
  [
    getValidation("create:ticket"), // opcional si ya lo tienes
    validate,
  ],
  createTicket
);

// Consultar ticket por número
ticketRouter.get(
  "/number/:ticketNumber",
  getTicketByNumber
);

/**
 * =========================
 *  RUTAS ADMIN
 * =========================
 */

// Listar tickets
ticketRouter.get(
  "/list",
  [jwtObject, authenticateUser],
  getAllTickets
);

// Obtener ticket por ID
ticketRouter.get(
  "/:id",
  [jwtObject, authenticateUser],
  getTicketById
);

// Aprobar ticket
ticketRouter.patch(
  "/approve/:id",
  [jwtObject, authenticateUser],
  approveTicket
);

// Rechazar ticket
ticketRouter.patch(
  "/reject/:id",
  [jwtObject, authenticateUser],
  rejectTicket
);

module.exports = ticketRouter;
