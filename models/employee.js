const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employee = new Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Employee", employee);
