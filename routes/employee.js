const express = require("express");
const employeeController = require("../controllers/employeeController");
const router = express.Router();

router
  .get("/", employeeController.getEmployees)
  .post("/", employeeController.createEmployee)
  .route("/:id")
  .get(employeeController.getEmployee)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

module.exports = router;
