const express = require("express");
const employeeController = require("../controllers/employeeController");
const jwtVerify = require("../middlewares/jwtVerify");
const roleVerify = require("../middlewares/roleVerify");
const roleLists = require("../config/roleLists");
const router = express.Router();

router
  .use(jwtVerify)
  .get(
    "/",
    roleVerify(roleLists.User, roleLists.Admin, roleLists.Editor),
    employeeController.getEmployees
  )
  .post(
    "/",
    roleVerify(roleLists.Admin, roleLists.Editor),
    employeeController.createEmployee
  )
  .route("/:id")
  .get(employeeController.getEmployee)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

module.exports = router;
