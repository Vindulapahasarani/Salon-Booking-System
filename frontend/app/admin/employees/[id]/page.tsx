'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

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
  services: Array<{
    _id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter();
  
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/employees/${params.id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error('Failed to fetch employee:', err);
        setError('Failed to load employee details');
        toast.error('Could not load employee details');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchEmployee();
    }
  }, [params.id]);
  
  if (loading) {
    return <div className="p-6">Loading employee details...</div>;
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
        <button 
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded">
          Employee not found
        </div>
        <button 
          onClick={() => router.push('/admin/employees')}
          className="mt-4 text-blue-600 hover:underline"
        >
          &larr; Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Details</h1>
        <div className="space-x-2">
          <button 
            onClick={() => router.push('/admin/employees')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </button>
          <button 
            onClick={() => router.push(`/admin/employees/edit/${params.id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Employee
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">{employee.name}</h2>
              <div className="space-y-2">
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Position:</span>
                  <span>{employee.position}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span>{employee.email}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span>{employee.phone || 'N/A'}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Address:</span>
                  <span>{employee.address || 'N/A'}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Join Date:</span>
                  <span>{format(new Date(employee.joinDate), 'MMMM dd, yyyy')}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {employee.status}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-600 mb-2">Bio</h3>
              <p className="text-gray-700 mb-4">{employee.bio || 'No bio available.'}</p>
              
              <h3 className="font-medium text-gray-600 mb-2">Services</h3>
              {employee.services && employee.services.length > 0 ? (
                <ul className="list-disc list-inside">
                  {employee.services.map(service => (
                    <li key={service._id} className="text-gray-700">{service.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No services assigned.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-3">
          <p className="text-xs text-gray-500">
            Created: {format(new Date(employee.createdAt), 'MMM dd, yyyy')} | 
            Last Updated: {format(new Date(employee.updatedAt), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
}