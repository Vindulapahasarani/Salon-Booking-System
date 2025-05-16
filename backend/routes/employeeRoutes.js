// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Public routes
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);

// Protected admin routes
router.post('/', verifyToken, verifyAdmin, employeeController.createEmployee);
router.put('/:id', verifyToken, verifyAdmin, employeeController.updateEmployee);
router.delete('/:id', verifyToken, verifyAdmin, employeeController.deleteEmployee);

module.exports = router;