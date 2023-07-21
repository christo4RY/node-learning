const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  roles: {
    Admin: Number,
    Editor: Number,
    User: {
      type: Number,
      default: 3,
    },
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
