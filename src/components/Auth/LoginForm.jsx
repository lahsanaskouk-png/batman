import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const { loginWithPhone, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phone.startsWith('212')) {
      alert('الرجاء إدخال رقم هاتف مغربي صحيح');
      return;
    }

    const formattedPhone = `+${phone}`;
    const result = await loginWithPhone(formattedPhone, password);
    
    if (result.success) {
      if (result.isAdmin) {
        navigate('/admin');
      } else if (result.confirmationResult) {
        setConfirmationResult(result.confirmationResult);
        setShowOtp(true);
      }
    } else {
      alert(result.error);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const result = await verifyOTP(confirmationResult, otp);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert('رمز التحقق غير صحيح');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            منصة الاستثمار الذهبية
          </h2>
          <p className="text-gray-400">تسجيل الدخول إلى حسابك</p>
        </div>

        {!showOtp ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-right">
                رقم الهاتف المغربي
              </label>
              <PhoneInput
                country={'ma'}
                value={phone}
                onChange={setPhone}
                inputClass="!w-full !bg-gray-700 !border-gray-600 !text-white !text-right"
                containerClass="rtl-direction"
                placeholder="+212 6XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-right">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-right focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
            >
              تسجيل الدخول
            </button>

            <div id="recaptcha-container"></div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-right">
                رمز التحقق OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="123456"
                maxLength="6"
                required
              />
              <p className="text-gray-400 text-sm mt-2 text-right">
                تم إرسال رمز التحقق إلى هاتفك
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
            >
              تأكيد الرمز
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
