'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Employee {
  _id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  address?: string;
  joinDate: string;
  status: 'active' | 'inactive';
  bio?: string;
  image?: string;
  services: any[];
}

interface FormData {
  name: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  bio: string;
  services: string[];
  joinDate?: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const initialFormData = {
    name: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    status: 'active' as const,
    bio: '',
    services: [],
    joinDate: new Date().toISOString().split('T')[0],
  };
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      // Wait a bit to see if user data is being loaded
      const timer = setTimeout(() => {
        if (!user) {
          toast.error('Please sign in to access this page');
          router.replace('/login');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Check if user is admin
    if (user && !user.isAdmin) {
      toast.error('You do not have permission to access this page');
      router.replace('/dashboard');
      return;
    }

    fetchEmployees();
    fetchServices();
  }, [user, router]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/employees');
      if (res.data && Array.isArray(res.data)) {
        setEmployees(res.data);
      } else {
        console.error('Invalid response format:', res.data);
        setError('Received invalid data format from server');
        toast.error('Error loading employees data');
      }
    } catch (error: any) {
      console.error('Failed to fetch employees:', error);
      setError(error.response?.data?.message || 'Failed to load employees');
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setError(null);
      const res = await axios.get('/services');
      if (res.data && Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        console.error('Invalid services data format:', res.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch services:', error);
      toast.error('Failed to load services');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, services: selectedOptions }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.position.trim()) return 'Position is required';
    if (!formData.email.trim()) return 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const dataToSubmit = {
        ...formData,
        joinDate: formData.joinDate || new Date().toISOString(),
      };
      
      if (editingId) {
        await axios.put(`/employees/${editingId}`, dataToSubmit);
        toast.success('Employee updated successfully');
      } else {
        await axios.post('/employees', dataToSubmit);
        toast.success('Employee added successfully');
      }
      
      resetForm();
      fetchEmployees();
    } catch (error: any) {
      console.error('Error saving employee:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to save employee';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (error.response?.data?.error?.includes('duplicate key') || 
          error.response?.data?.error?.includes('email already in use')) {
        toast.error('Email address is already in use');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee._id);
    setFormData({
      name: employee.name,
      position: employee.position,
      email: employee.email,
      phone: employee.phone || '',
      address: employee.address || '',
      status: employee.status,
      bio: employee.bio || '',
      joinDate: new Date(employee.joinDate).toISOString().split('T')[0],
      services: employee.services.map(service => service._id || service),
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        setError(null);
        await axios.delete(`/employees/${id}`);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error: any) {
        console.error('Error deleting employee:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete employee';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  // If still loading and no data yet received
  if (loading && !employees.length) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading employees...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Employees</h1>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Employee
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-8 border">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position*</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                <select
                  multiple
                  name="services"
                  value={formData.services}
                  onChange={handleServiceChange}
                  className="w-full border rounded p-2 h-24"
                >
                  {services.map(service => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple services</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 h-24"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className={`${
                  submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-4 py-2 rounded flex items-center`}
              >
                {submitting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {submitting ? 'Saving...' : editingId ? 'Update Employee' : 'Add Employee'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {loading ? 'Loading...' : 'No employees found. Click "Add New Employee" to create one.'}
                  </td>
                </tr>
              ) : (
                employees.map(employee => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        <Link href={`/admin/employees/${employee._id}`} className="hover:text-blue-600">
                          {employee.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}