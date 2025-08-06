import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const sendOtp = async () => {
    if (!validateMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/send-otp', { 
        mobile: mobile.trim() 
      });
      
      if (response.data.success) {
        setStep(2);
        setError('');
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-otp', { 
        mobile: mobile.trim(), 
        otp: otp.trim() 
      });
      
      if (response.data.success) {
        const { isNewUser, userId } = response.data;
        
        // Store user info in localStorage for the ProfileForm to use
        localStorage.setItem('user', JSON.stringify({ id: userId, isNewUser }));
        
        if (isNewUser) {
          onLogin('user-profile', userId);
        } else {
          onLogin('home', userId);
        }
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const goBack = () => {
    setStep(1);
    setOtp('');
    setError('');
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {step === 1 ? 'Login' : 'Verify OTP'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Enter 10-digit mobile number" 
              value={mobile} 
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setMobile(value);
                setError('');
              }}
              onKeyPress={(e) => handleKeyPress(e, sendOtp)}
              maxLength={10}
              disabled={loading}
            />
          </div>
          <button 
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              loading || !mobile 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            onClick={sendOtp}
            disabled={loading || !mobile}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP sent to {mobile}
            </label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest" 
              placeholder="000000" 
              value={otp} 
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setError('');
              }}
              onKeyPress={(e) => handleKeyPress(e, verifyOtp)}
              maxLength={6}
              disabled={loading}
              autoFocus
            />
          </div>
          <button 
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              loading || !otp 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            onClick={verifyOtp}
            disabled={loading || !otp}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button 
            className="w-full py-2 px-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={goBack}
            disabled={loading}
          >
            Change Mobile Number
          </button>
        </div>
      )}
    </div>
  );
}