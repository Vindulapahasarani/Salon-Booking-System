const Employee = require('../models/Employee');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('services', 'name');
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid employee ID format' });
    }
    
    const employee = await Employee.findById(req.params.id).populate('services', 'name');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, position, email } = req.body;
    
    if (!name || !position || !email) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        error: 'Name, position, and email are required'
      });
    }
    
    const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
    if (existingEmployee) {
      return res.status(400).json({ 
        message: 'Email already in use', 
        error: 'An employee with this email already exists'
      });
    }
    
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    
    const populatedEmployee = await Employee.findById(savedEmployee._id).populate('services', 'name');
    
    res.status(201).json(populatedEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        error: error.message 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already in use', 
        error: 'An employee with this email already exists'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create employee', 
      error: error.message 
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid employee ID format' });
    }
    
    if (req.body.email) {
      const existingEmployee = await Employee.findOne({ 
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingEmployee) {
        return res.status(400).json({ 
          message: 'Email already in use', 
          error: 'Another employee is using this email address'
        });
      }
    }
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('services', 'name');
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        error: error.message 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already in use', 
        error: 'Another employee is using this email address'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to update employee', 
      error: error.message 
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid employee ID format' });
    }
    
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json({ message: 'Employee deleted successfully', deletedEmployee: employee });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
};