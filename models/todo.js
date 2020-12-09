const { Schema, Types, model } = require('mongoose');

const todoSchema = new Schema({
  uid: { type: Types.ObjectId, required: true, ref: 'User' },
  description: { type: String, required: true },
  checked: { type: Boolean, required: true },
});

module.exports = model('Todo', todoSchema);
