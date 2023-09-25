const { Router } = require("express");
const { EmployeeModel } = require("../models/employee.model");

const employeeRouter = Router();

// Add Employees
employeeRouter.post("/", async (req, res) => {
  try {
    const { firstname, lastname, email, department, salary } = req.body;
    const newEmployee = new EmployeeModel({
      firstname,
      lastname,
      email,
      department,
      salary,
    });
    await newEmployee.save();
    res.status(201).json({ message: "New Employee added", newEmployee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Data
employeeRouter.get("/", async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit Data
employeeRouter.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, department, salary } = req.body;

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      { firstname, lastname, email, department, salary },
      { new: true }
    );

    if (!updatedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Employee
employeeRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);

    if (!deletedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee deleted", deletedEmployee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pagination
employeeRouter.get("/pagination", async (req, res) => {
  const page = req.query.page || 1;
  const perPage = 5;

  try {
    const employees = await EmployeeModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Filter by Department
employeeRouter.get("/filter/:department", async (req, res) => {
  const { department } = req.params;

  try {
    const employees = await EmployeeModel.find({ department });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sort by Salary
employeeRouter.get("/sort/:order", async (req, res) => {
  try {
    const { order } = req.params;
    let sortOption = 1;
    if (order.toLowerCase() === "desc") {
      sortOption = -1;
    }
    const employees = await EmployeeModel.find().sort({ salary: sortOption });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search Employee
employeeRouter.get("/search/:firstName", async (req, res) => {
  const { firstName } = req.params;

  try {
    const employees = await EmployeeModel.find({
      firstname: { $regex: firstName, $options: "i" },
    });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { employeeRouter };
