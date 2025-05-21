'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from '@/utils/axios';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface Appointment {
  id: string;
  serviceName: string;
  price: number;
  date: string;
  timeSlot: string;
}

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [verifyStatus, setVerifyStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setVerifyStatus('error');
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        // Verify the Stripe session with the backend
        const response = await axios.post('/api/payments/verify', { sessionId });
        if (response.data.success) {
          setAppointments(response.data.appointments || []);
          setVerifyStatus('success');
        } else {
          throw new Error(response.data.message || 'Payment verification failed');
        }
      } catch (error: any) {
        console.error('Payment verification failed:', error);
        setVerifyStatus('error');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-10">
        <Card className="p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Processing Payment</h1>
          <p className="mb-6">Please wait while we verify your payment...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (verifyStatus === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-10">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="mb-6 text-red-500 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-700 mb-6">Payment Verification Failed</h1>
          <p className="text-lg text-gray-700 mb-8">
            We couldn't verify your payment. If you believe this is an error, please contact our support team.
          </p>
          <Button onClick={goToDashboard} className="w-full">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-10">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="mb-6 text-green-500 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-green-700 mb-6">Payment Successful! 🎉</h1>
        <p className="text-lg text-gray-700 mb-4">
          Thank you for your payment. Your appointment(s) have been confirmed.
        </p>
        {appointments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Confirmed Appointments</h2>
            <div className="space-y-2">
              {appointments.map((appt) => (
                <div key={appt.id} className="p-2 border rounded-md">
                  <p className="font-medium">{appt.serviceName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}
                  </p>
                  <p className="text-sm font-semibold">${appt.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button onClick={goToDashboard} className="w-full">
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
}