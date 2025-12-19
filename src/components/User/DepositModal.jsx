import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DepositModal = ({ onClose }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('commonpay');
  const [fullName, setFullName] = useState('');
  const [rib, setRib] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (amount < 100 || amount > 10000) {
      alert('المبلغ يجب أن يكون بين 100 و 10000 درهم');
      return;
    }

    if (rib.length !== 24) {
      alert('الريب يجب أن يكون 24 رقم');
      return;
    }

    setLoading(true);

    try {
      // Upload proof image
      let imageUrl = '';
      if (proofImage) {
        const imageRef = ref(storage, `deposit-proofs/${user.uid}/${Date.now()}_${proofImage.name}`);
        await uploadBytes(imageRef, proofImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Create deposit record
      const depositId = `dep_${Date.now()}_${user.uid}`;
      await setDoc(doc(db, 'deposits', depositId), {
        userId: user.uid,
        amount: parseFloat(amount),
        paymentMethod,
        fullName,
        rib,
        proofImage: imageUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      alert('تم إرسال طلب الإيداع بنجاح، في انتظار المراجعة');
      onClose();
    } catch (error) {
      console.error('Deposit error:', error);
      alert('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'commonpay', name: 'CommonPay', icon: '🏦' },
    { id: 'usdt', name: 'USDT (TRC20)', icon: '₮' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-yellow-400 text-right">
              طلب إيداع جديد
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-gray-300 mb-2 text-right">
              المبلغ (MAD)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-right text-xl pr-12 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="مثال: 500"
                min="100"
                max="10000"
                required
              />
              <span className="absolute left-4 top-3 text-gray-400">درهم</span>
            </div>
            <p className="text-gray-400 text-sm mt-2 text-right">
              الحد الأدنى: 100 درهم | الحد الأقصى: 10,000 درهم
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-300 mb-2 text-right">
              طريقة الدفع
            </label>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    paymentMethod === method.id
                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-10'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-white font-bold">{method.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-gray-300 mb-2 text-right">
              الاسم الكامل كما في الحساب البنكي
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-right focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>

          {/* RIB */}
          <div>
            <label className="block text-gray-300 mb-2 text-right">
              رقم RIB (24 رقم)
            </label>
            <input
              type="text"
              value={rib}
              onChange={(e) => setRib(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-right font-mono focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="XXXXXXXXXXXXXXXXXXXXXXXX"
              maxLength="24"
              required
            />
          </div>

          {/* Proof Upload */}
          <div>
            <label className="block text-gray-300 mb-2 text-right">
              صورة إثبات التحويل
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-yellow-500 transition-colors duration-300">
              <input
                type="file"
                id="proofUpload"
                className="hidden"
                accept="image/*"
                onChange={(e) => setProofImage(e.target.files[0])}
              />
              <label htmlFor="proofUpload" className="cursor-pointer block">
                {proofImage ? (
                  <div className="text-green-400">
                    <span className="text-3xl block mb-2">✅</span>
                    <p>{proofImage.name}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      اضغط لتغيير الصورة
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-3xl block mb-2">📤</span>
                    <p className="text-gray-300">اضغط لرفع صورة التحويل</p>
                    <p className="text-sm text-gray-400 mt-1">
                      (JPG, PNG, GIF - الحد الأقصى 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                جاري الإرسال...
              </span>
            ) : (
              'إرسال طلب الإيداع'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
