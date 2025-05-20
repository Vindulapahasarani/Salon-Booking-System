'use client';

import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface UnpaidAppointment {
  id: string;
  serviceName: string;
  price: number;
  date: string;
  timeSlot: string;
}

export default function PaymentSection() {
  const [unpaidAppointments, setUnpaidAppointments] = useState<UnpaidAppointment[]>([]);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUnpaidAppointments();
  }, []);

  const fetchUnpaidAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/appointments/unpaid');
      setUnpaidAppointments(response.data);
    } catch (error) {
      console.error('Error fetching unpaid appointments:', error);
      setError('Failed to load unpaid appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSelect = (appointmentId: string) => {
    setSelectedAppointments(prev => {
      if (prev.includes(appointmentId)) {
        return prev.filter(id => id !== appointmentId);
      } else {
        return [...prev, appointmentId];
      }
    });
  };

  const calculateTotal = () => {
    return unpaidAppointments
      .filter(appointment => selectedAppointments.includes(appointment.id))
      .reduce((total, appointment) => total + appointment.price, 0);
  };

  const handlePayment = async () => {
    if (selectedAppointments.length === 0) {
      setError('Please select at least one appointment to pay for.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === 'card') {
        const response = await axios.post('/api/payments/stripe/checkout', {
          appointmentIds: selectedAppointments
        });
        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error('No redirect URL received from Stripe');
        }
      } else {
        await axios.post('/api/payments/cash', {
          appointmentIds: selectedAppointments
        });
        alert('Cash payment confirmed! Your appointments have been marked as paid.');
        fetchUnpaidAppointments();
        setSelectedAppointments([]);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'There was an error processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && unpaidAppointments.length === 0) {
    return (
      <Card className="p-6 mt-4">
        <h2 className="text-xl font-bold mb-4">Payment Information</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  if (error && unpaidAppointments.length === 0) {
    return (
      <Card className="p-6 mt-4">
        <h2 className="text-xl font-bold mb-4">Payment Information</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
          <Button 
            onClick={fetchUnpaidAppointments}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (unpaidAppointments.length === 0) {
    return (
      <Card className="p-6 mt-4">
        <h2 className="text-xl font-bold mb-4">Payment Information</h2>
        <p>You have no unpaid appointments.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-xl font-bold mb-4">Payment Information</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Unpaid Appointments</h3>
        
        <div className="space-y-3">
          {unpaidAppointments.map(appointment => (
            <div 
              key={appointment.id} 
              className={`p-4 border rounded-md cursor-pointer flex items-center ${
                selectedAppointments.includes(appointment.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
              onClick={() => handleAppointmentSelect(appointment.id)}
            >
              <input
                type="checkbox"
                checked={selectedAppointments.includes(appointment.id)}
                onChange={() => {}}
                className="mr-3 h-5 w-5"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="font-semibold">${appointment.price.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAppointments.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="h-5 w-5"
                />
                <span>💳 Card</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="h-5 w-5"
                />
                <span>💵 Cash</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 pt-4 border-t">
            <p className="font-semibold">Total Amount:</p>
            <p className="text-xl font-bold">${calculateTotal().toFixed(2)}</p>
          </div>

          <Button 
            onClick={handlePayment} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ${paymentMethod === 'card' ? 'with Card' : 'with Cash'}`}
          </Button>
        </>
      )}
    </Card>
  );
}