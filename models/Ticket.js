"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = {
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // URL o path del archivo
    required: true,
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdByIP: {
    type: String,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SystemUser",
  },
  approvedAt: {
    type: Date,
  },
};

const options = {
  collection: "Tickets",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
};

const TicketSchema = new Schema(schema, options);

// Índices útiles
TicketSchema.index({ phone: 1 });
TicketSchema.index({ ticketNumber: 1 }, { unique: true });
TicketSchema.index({ status: 1 });

module.exports = mongoose.model("Ticket", TicketSchema);
