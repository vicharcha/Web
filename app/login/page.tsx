"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const router = useRouter();
  const { login, verifyOTP } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(phoneNumber);
      setIsOtpSent(true);
    } catch (error) {
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isVerified = await verifyOTP(otp);
      if (isVerified) {
        router.push('/');
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      alert('Failed to verify OTP');
    }
  };

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center">
      <form onSubmit={isOtpSent ? handleVerifyOTP : handleSendOTP} className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl mb-4">Login</h1>
        {!isOtpSent ? (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isOtpSent ? 'Verify OTP' : 'Send OTP'}
          </button>
        </div>
      </form>
    </div>
  );
}
