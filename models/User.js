const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid 10-digit mobile number!`,
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  address: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  loginId: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9]{8,}$/.test(v);
      },
      message: (props) =>
        `${props.value} must be at least 8 characters long and alphanumeric!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(v);
      },
      message: (props) =>
        `Password must have 6 characters with at least 1 uppercase, 1 lowercase, and 1 special character.`,
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
