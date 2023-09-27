const { Router } = require("express");
const { EmployeeModel } = require("../models/employee.model");

const employeeRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee-related endpoints
 */

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Add a new employee
 *     tags: [Employee]
 *     requestBody:
 *       description: Employee data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               salary:
 *                 type: number
 *             example:
 *               firstname: John
 *               lastname: Doe
 *               email: john.doe@example.com
 *               department: HR
 *               salary: 50000
 *     responses:
 *       201:
 *         description: Employee added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: New Employee added
 *               newEmployee:
 *                 firstname: John
 *                 lastname: Doe
 *                 email: john.doe@example.com
 *                 department: HR
 *                 salary: 50000
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
employeeRouter.post("/", async (req, res) => {
  try {
    const { firstname, lastname, email, department, salary } = req.body;

    const existingEmployee = await EmployeeModel.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with the same email already exists" });
    }

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


/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employee]
 *     responses:
 *       200:
 *         description: List of all employees
 *         content:
 *           application/json:
 *             example:
 *               -
 *                 firstname: John
 *                 lastname: Doe
 *                 email: john.doe@example.com
 *                 department: HR
 *                 salary: 50000
 *               -
 *                 firstname: Jane
 *                 lastname: Smith
 *                 email: jane.smith@example.com
 *                 department: IT
 *                 salary: 60000
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
employeeRouter.get("/", async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /employees/{id}:
 *   patch:
 *     summary: Edit an employee's information
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated employee data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               salary:
 *                 type: number
 *             example:
 *               firstname: UpdatedFirstName
 *               lastname: UpdatedLastName
 *               email: updated.email@example.com
 *               department: UpdatedDepartment
 *               salary: 60000
 *     responses:
 *       200:
 *         description: Employee information updated successfully
 *         content:
 *           application/json:
 *             example:
 *               firstname: UpdatedFirstName
 *               lastname: UpdatedLastName
 *               email: updated.email@example.com
 *               department: UpdatedDepartment
 *               salary: 60000
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             example:
 *               message: Employee not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
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

    res.status(200).json({ message: "Employee updated successfully", updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Employee deleted
 *               deletedEmployee:
 *                 firstname: John
 *                 lastname: Doe
 *                 email: john.doe@example.com
 *                 department: HR
 *                 salary: 50000
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             example:
 *               message: Employee not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
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

/**
 * @swagger
 * /employees/pagination:
 *   get:
 *     summary: Get employees with pagination
 *     tags: [Employee]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of employees with pagination
 *         content:
 *           application/json:
 *             example:
 *               -
 *                 firstname: John
 *                 lastname: Doe
 *                 email: john.doe@example.com
 *                 department: HR
 *                 salary: 50000
 *               -
 *                 firstname: Jane
 *                 lastname: Smith
 *                 email: jane.smith@example.com
 *                 department: IT
 *                 salary: 60000
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
employeeRouter.get("/pagination", async (req, res) => {
  const page = req.query.page || 1;
  const perPage = 5;

  try {
    const totalEmployees = await EmployeeModel.countDocuments();
    const totalPages = Math.ceil(totalEmployees / perPage);

    const employees = await EmployeeModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ employees, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /employees/filter/{department}:
 *   get:
 *     summary: Get employees filtered by department
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of employees in the specified department
 *         content:
 *           application/json:
 *             example:
 *               -
 *                 firstname: John
 *                 lastname: Doe
 *                 email: john.doe@example.com
 *                 department: HR
 *                 salary: 50000
 *               -
 *                 firstname: Jane
 *                 lastname: Smith
 *                 email: jane.smith@example.com
 *                 department: HR
 *                 salary: 60000
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
employeeRouter.get("/filter/:department", async (req, res) => {
  const { department } = req.params;

  try {
    const employees = await EmployeeModel.find({ department });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /employees/sort/{order}:
 *   get:
 *     summary: Get employees sorted by salary
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: order
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of employees sorted by salary
 *         content:
 *           application/json:
 *             example:
 *               -
 *                 firstname: John
 *                 lastname: Doe
 *                 email: john.doe@example.com
 *                 department: HR
 *                 salary: 50000
 *               -
 *                 firstname: Jane
 *                 lastname: Smith
 *                 email: jane.smith@example.com
 *                 department: IT
 *                 salary: 60000
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
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

/**
 * @swagger
 * /api/employees/search/{firstName}:
 *   get:
 *     summary: Search employees by first name
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: firstName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of employees matching the search criteria
 *         content:
 *           application/json:
 *             example:
 *               -
 *                 firstname: John
 *                 lastname: Doe
 *                 email: john.doe@example.com
 *                 department: HR
 *                 salary: 50000
 *               -
 *                 firstname: Jane
 *                 lastname: Smith
 *                 email: jane.smith@example.com
 *                 department: IT
 *                 salary: 60000
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
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
