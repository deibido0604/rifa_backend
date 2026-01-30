"use strict";
const mongoose = require("mongoose");
const models = require("../models");
const logsConstructor = require("../utils/logs");
const constants = require("../components/constants/index");
const { buildError } = require("../utils/response");
const cloudinary = require("../utils/cloudinary");

function ticketService() {
  /**
   * Crear ticket (PÚBLICO)
   */
  async function createTicket(param, req) {
    try {
      if (!param.fullName || !param.phone || !param.image) {
        return buildError(400, "Datos incompletos!");
      }

      // Subir imagen a Cloudinary
      let imageUrl = "";
      let cloudinaryId = "";

      try {
        // Subir imagen base64 a Cloudinary
        const uploadResult = await cloudinary.uploader.upload(param.image, {
          folder: "tickets",
          resource_type: "image",
          transformation: [
            { width: 800, height: 800, crop: "limit" }, // Redimensionar
            { quality: "auto:good" }, // Optimizar calidad
          ],
        });

        imageUrl = uploadResult.secure_url;
        cloudinaryId = uploadResult.public_id;
      } catch (uploadError) {
        console.error("Error subiendo a Cloudinary:", uploadError);
        return buildError(500, "Error al subir la imagen");
      }

      const ticketNumber = `TCK-${Date.now()}-${Math.floor(
        Math.random() * 1000,
      )}`;

      const ticket = new models.Ticket({
        fullName: param.fullName,
        phone: param.phone,
        image: imageUrl, // Ahora guardamos URL, no Base64
        cloudinaryId: cloudinaryId, // Para poder borrar después si es necesario
        ticketNumber,
        createdByIP: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      });

      const data = await ticket.save();

      if (data) {
        await logsConstructor(
          constants.LOG_TYPE.CREATE_TICKET,
          {
            _id: data._id,
            ticketNumber: data.ticketNumber,
            phone: data.phone,
          },
          "Ticket creado",
          "PUBLIC",
        );
      }

      return data;
    } catch (e) {
      return buildError(500, e.message);
    }
  }
  /**
   * Obtener tickets (ADMIN)
   */
  async function getAllTickets(skip = 0, limit = 10, status) {
    try {
      const match = {};

      if (status) {
        match.status = status;
      }

      const tickets = await models.Ticket.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "SystemUsers",
            localField: "approvedBy",
            foreignField: "_id",
            as: "approvedByInfo",
          },
        },
        {
          $project: {
            fullName: 1,
            phone: 1,
            image: 1,
            ticketNumber: 1,
            status: 1,
            createdAt: 1,
            approvedAt: 1,
            approvedBy: {
              $arrayElemAt: ["$approvedByInfo", 0],
            },
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      return tickets;
    } catch (e) {
      return buildError(500, e.message);
    }
  }

  /**
   * Obtener ticket por ID (ADMIN)
   */
  async function getTicketById(id) {
    try {
      const ticket = await models.Ticket.findById(
        mongoose.Types.ObjectId(id),
      ).populate("approvedBy", "username name lastName");

      if (!ticket) {
        return buildError(404, "Ticket no encontrado!");
      }

      return ticket;
    } catch (e) {
      return buildError(500, e.message);
    }
  }

  /**
   * Aprobar ticket (ADMIN)
   */
  async function approveTicket(id, userId, req) {
    try {
      const ticket = await models.Ticket.findById(mongoose.Types.ObjectId(id));

      if (!ticket) {
        return buildError(404, "Ticket no encontrado!");
      }

      if (ticket.status === "approved") {
        return buildError(400, "El ticket ya fue aprobado!");
      }

      ticket.status = "approved";
      ticket.approvedBy = mongoose.Types.ObjectId(userId);
      ticket.approvedAt = new Date();

      const data = await ticket.save();

      await logsConstructor(
        constants.LOG_TYPE.APPROVE_TICKET,
        {
          _id: ticket._id,
          ticketNumber: ticket.ticketNumber,
        },
        "Ticket aprobado",
        req.headers["console-user"],
      );

      return data;
    } catch (e) {
      return buildError(500, e.message);
    }
  }

  /**
   * Rechazar ticket (ADMIN)
   */
  async function rejectTicket(id, userId, req) {
    try {
      const ticket = await models.Ticket.findById(mongoose.Types.ObjectId(id));

      if (!ticket) {
        return buildError(404, "Ticket no encontrado!");
      }

      ticket.status = "rejected";
      ticket.approvedBy = mongoose.Types.ObjectId(userId);
      ticket.approvedAt = new Date();

      const data = await ticket.save();

      await logsConstructor(
        constants.LOG_TYPE.REJECT_TICKET,
        {
          _id: ticket._id,
          ticketNumber: ticket.ticketNumber,
        },
        "Ticket rechazado",
        req.headers["console-user"],
      );

      return data;
    } catch (e) {
      return buildError(500, e.message);
    }
  }

  /**
   * Obtener ticket por número (PÚBLICO)
   */
  async function getTicketByNumber(ticketNumber) {
    try {
      const ticket = await models.Ticket.findOne({ ticketNumber });

      if (!ticket) {
        return buildError(404, "Ticket no encontrado!");
      }

      return {
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        createdAt: ticket.createdAt,
      };
    } catch (e) {
      return buildError(500, e.message);
    }
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

module.exports = ticketService();
