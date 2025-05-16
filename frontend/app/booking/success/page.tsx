
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [verifyStatus, setVerifyStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

  useEffect(() => {
    // If there's no session ID, this is likely a direct navigation (not from Stripe)
    if (!sessionId) {
      setVerifyStatus('error');
      setLoading(false);
      return;
    }

    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        // Replace with actual API call if needed
        // Example: await axios.post('/api/verify-payment', { sessionId });
        
        // For now, simulate successful verification after 1.5 seconds
        setTimeout(() => {
          setVerifyStatus('success');
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerifyStatus('error');
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-green-700 mb-6">Payment Successful! 🎉</h1>
        <p className="text-lg text-gray-700 mb-8">
          Thank you for your payment. Your appointment has been confirmed. We look forward to seeing you! ✂️
        </p>
        <Button onClick={goToDashboard} className="w-full">
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
}