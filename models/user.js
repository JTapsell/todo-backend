const { Schema, Types, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  todos: [{ type: Types.ObjectId, required: true, ref: 'Todo' }],
});

userSchema.plugin(uniqueValidator);

module.exports = model('User', userSchema);
