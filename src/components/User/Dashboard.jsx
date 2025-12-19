import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BalanceCard from '../Shared/BalanceCard';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import TasksPanel from './TasksPanel';
import TeamStats from './TeamStats';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Dashboard = () => {
  const { user } = useAuth();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [copied, setCopied] = useState(false);

  const quickActions = [
    { icon: '💰', label: 'إيداع', color: 'bg-green-500', action: () => setShowDeposit(true) },
    { icon: '💸', label: 'سحب', color: 'bg-red-500', action: () => setShowWithdraw(true) },
    { icon: '👥', label: 'فريقي', color: 'bg-blue-500', action: () => {/* Navigate to team */} },
    { icon: '✅', label: 'مهام', color: 'bg-purple-500', action: () => {/* Open tasks */} },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              مرحباً، {user?.phoneNumber}
            </h1>
            <p className="text-gray-400">المستوى: {user?.level || 1}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400">رقم العضو</p>
            <p className="text-yellow-400 font-mono">{user?.uid?.substring(0, 8)}</p>
          </div>
        </div>

        {/* Balance Card */}
        <BalanceCard balance={user?.balance || 0} />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} p-4 rounded-2xl text-white flex flex-col items-center justify-center hover:opacity-90 transition-all duration-300 transform hover:scale-105`}
            >
              <span className="text-2xl mb-2">{action.icon}</span>
              <span className="font-bold">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Referral Link */}
        <div className="bg-gray-800 p-6 rounded-2xl mb-8 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 text-right">
            رابط الدعوة الخاص بك
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-gray-900 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-300 text-right break-all">
                {window.location.origin}/register?ref={user?.referralCode}
              </p>
            </div>
            <CopyToClipboard
              text={`${window.location.origin}/register?ref=${user?.referralCode}`}
              onCopy={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold transition-colors duration-300 whitespace-nowrap">
                {copied ? 'تم النسخ! ✅' : 'نسخ الرابط 📋'}
              </button>
            </CopyToClipboard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Tasks */}
          <TasksPanel />

          {/* Team Statistics */}
          <TeamStats />
        </div>
      </div>

      {/* Modals */}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}
    </div>
  );
};

export default Dashboard;
