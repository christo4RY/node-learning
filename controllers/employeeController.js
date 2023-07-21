const EmployeeSchema = require("./../models/employee");
const fs = require("fs/promises");
const path = require("path");
const datas = {
  getEmployees: require("./../data/employees.json"),
  setEmployees(data) {
    this.getEmployees = data;
  },
};

const getEmployees = async (req, res, next) => {
  const employees = await EmployeeSchema.find();
  if (!employees)
    return res.status(204).json({ message: "No employees found." });
  res.json(employees);
};

const createEmployee = async (req, res, next) => {
  const newEmployee = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  if (!newEmployee.firstName || !newEmployee.lastName)
    return res.status(400).json({ message: "first and last name required." });

  const employee = await EmployeeSchema.create(newEmployee);
  res.status(201).json(employee);
  res.end();
};

const getEmployee = async (req, res, next) => {
  const employee = await EmployeeSchema.findById(req.params.id).exec();
  if (!employee)
    return res.status(404).send({ message: "employee not found." });
  res.send(employee);
};

const updateEmployee = async (req, res, next) => {
  const employee = await EmployeeSchema.findById(req.params.id).exec();
  if (!employee)
    return res.status(404).send({ message: "employee not found." });
  employee.firstName = req.body.firstName ?? employee.firstName;
  employee.lastName = req.body.lastName ?? employee.lastName;
  const updated = await employee.save();
  res.send(updated);
};

const deleteEmployee = async (req, res, next) => {
  const employee = await EmployeeSchema.findById(req.params.id).exec();
  if (!employee)
    return res.status(404).send({ message: "employee not found." });
  await employee.deleteOne();
  res.send({ message: "deleted successfully!" });
};

module.exports = {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
