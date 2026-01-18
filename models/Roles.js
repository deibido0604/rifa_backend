'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
  },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permissions',
    },
  ],
  nature: {
    type: [Number],
    default: 0
  },
});

const options = {
  collection: 'Roles',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
};

let rolesSchema = new Schema(schema, options);

module.exports = mongoose.model('Roles', rolesSchema);
