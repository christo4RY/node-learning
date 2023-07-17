const fs = require("fs/promises");
const path = require("path");
const datas = {
  getEmployees: require("./../data/employees.json"),
  setEmployees(data) {
    this.getEmployees = data;
  },
};

const getEmployees = (req, res, next) => {
  res.json(datas.getEmployees);
};
const createEmployee = async (req, res, next) => {
  const newEmployee = {
    id: datas.getEmployees.length + 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  if (!newEmployee.firstName || !newEmployee.lastName) {
    res.status(400).json({ message: "first and last name required." });
    res.end();
  }
  await fs.writeFile(
    path.join(__dirname, "..", "data", "employees.json"),
    JSON.stringify([...datas.getEmployees, newEmployee])
  );
  datas.setEmployees([...datas.getEmployees, newEmployee]);
  res.status(201).json(datas.getEmployees);
  res.end();
};

const getEmployee = (req, res, next) => {
  const employee = datas.getEmployees.find(
    (employee) => employee.id === parseFloat(req.params.id)
  );
  if (!employee) res.status(404).send({ message: "employee not found." });
  res.send(employee);
};

const updateEmployee = (req, res, next) => {
  const employee = datas.getEmployees.find(
    (employee) => employee.id === parseFloat(req.params.id)
  );
  if (!employee) res.status(404).send({ message: "employee not found." });
  employee.firstName = req.body.firstName ?? employee.firstName;
  employee.lastName = req.body.lastName ?? employee.lastName;
  const filterEmployees = datas.getEmployees.filter(
    (employee) => employee.id !== parseFloat(req.params.id)
  );
  datas.setEmployees(
    [...filterEmployees, employee].sort((a, b) =>
      a.id > b.id ? 1 : a.id < b.id ? -1 : 0
    )
  );
  res.send(datas.getEmployees);
};

const deleteEmployee = (req, res, next) => {
  const employee = datas.getEmployees.find(
    (employee) => employee.id === parseFloat(req.params.id)
  );
  if (!employee) res.status(404).send({ message: "employee not found." });
  const filterEmployees = datas.getEmployees.filter(
    (employee) => employee.id !== parseFloat(req.params.id)
  );
  datas.setEmployees([...filterEmployees]);
  res.send(filterEmployees);
};

module.exports = {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
