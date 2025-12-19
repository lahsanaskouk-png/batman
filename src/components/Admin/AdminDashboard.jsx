import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import UsersManagement from './UsersManagement';
import TransactionsReview from './TransactionsReview';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDeposits: 0,
    pendingWithdrawals: 0,
    totalBalance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const depositsQuery = query(collection(db, 'deposits'), where('status', '==', 'pending'));
      const withdrawalsQuery = query(collection(db, 'withdrawals'), where('status', '==', 'pending'));

      const [usersSnap, depositsSnap, withdrawalsSnap] = await Promise.all([
        getDocs(usersQuery),
        getDocs(depositsQuery),
        getDocs(withdrawalsQuery)
      ]);

      const totalBalance = usersSnap.docs.reduce((sum, doc) => sum + (doc.data().balance || 0), 0);

      setStats({
        totalUsers: usersSnap.size,
        activeDeposits: depositsSnap.size,
        pendingWithdrawals: withdrawalsSnap.size,
        totalBalance
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers.toLocaleString(),
      icon: '👥',
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'إيداعات قيد المراجعة',
      value: stats.activeDeposits,
      icon: '💰',
      color: 'bg-green-500',
      change: '+5'
    },
    {
      title: 'سحوبات قيد المعالجة',
      value: stats.pendingWithdrawals,
      icon: '💸',
      color: 'bg-red-500',
      change: '+3'
    },
    {
      title: 'إجمالي الأرصدة',
      value: `${stats.totalBalance.toLocaleString()} MAD`,
      icon: '🏦',
      color: 'bg-yellow-500',
      change: '+8%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            لوحة تحكم الأدمن
          </h1>
          <p className="text-gray-400">مراقبة وإدارة المنصة بالكامل</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <span className="text-green-400 text-sm font-bold">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Management */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-right">إدارة المستخدمين</h2>
            <UsersManagement />
          </div>

          {/* Transactions Review */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-right">مراجعة المعاملات</h2>
            <TransactionsReview />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-right">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'إضافة رصيد للمستخدم', icon: '➕', action: () => {} },
              { label: 'حظر مستخدم', icon: '🚫', action: () => {} },
              { label: 'إرسال إشعام عام', icon: '📢', action: () => {} }
            ].map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-white flex items-center justify-center gap-3 transition-colors duration-300"
              >
                <span className="text-2xl">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
