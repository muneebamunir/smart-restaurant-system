'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  LayoutDashboard,
  Sliders,
  User,
  Camera,
  Mail,
  ShieldCheck,
  MapPin,
  Wallet,
  ArrowUpRight,
  IdCard,
  Edit3,
  Calendar,
  Lock,
  History,
  CheckCircle2,
  Flame,
  Key,
  X,
} from 'lucide-react';
import BrandLogo from '@/components/layout/brandlogo';
import UserProfileDropdown from '@/components/layout/userprofiledropdown';
import { useToast } from '@/context/toastcontext';

interface FinancialMetric {
  label: string;
  val: string;
}

interface RoleProfileData {
  userId: string;
  roleBadgeText: string;
  name: string;
  email: string;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  address: string;
  balanceTitle: string;
  balanceSubtitle: string;
  balanceAmountMain: string;
  balanceAmountCents: string;
  balanceLabel: string;
  actionText: string;
  breakdown: FinancialMetric[];
}

const USER_ROLES_DATA: Record<'admin' | 'staff', RoleProfileData> = {
  admin: {
    userId: '#user-123',
    roleBadgeText: 'Head Chef / Admin',
    name: 'Alexander Chef',
    email: 'alex@tastecraft.com',
    phone: '+1 (555) 019-2834',
    emergencyName: 'Maria Chef (Spouse)',
    emergencyPhone: '+1 (555) 998-1122',
    address: '452 Culinary Way, Suite 8B, Gourmet City',
    balanceTitle: 'Store Revenue & Ledger',
    balanceSubtitle: 'Total processed store gross revenue for current billing month',
    balanceAmountMain: '$42,850',
    balanceAmountCents: '50',
    balanceLabel: 'Net Restaurant Revenue',
    actionText: 'Export Store Financial Report',
    breakdown: [
      { label: 'Gross Sales', val: '$48,200.00' },
      { label: 'Total Orders', val: '1,420' },
      { label: 'Tax Collected (8%)', val: '$3,856.00' },
      { label: 'Delivery Fees', val: '$1,294.50' },
    ],
  },
  staff: {
    userId: '#staff-408',
    roleBadgeText: 'Senior Floor Waiter',
    name: 'Sarah Jenkins',
    email: 'sarah@tastecraft.com',
    phone: '+1 (555) 349-8812',
    emergencyName: 'David Jenkins (Brother)',
    emergencyPhone: '+1 (555) 771-4433',
    address: '184 Market Street, Apt 4C, Gourmet City',
    balanceTitle: 'Salary & Tips Balance',
    balanceSubtitle: 'Available earned monthly base salary and accumulated tip bonus',
    balanceAmountMain: '$3,450',
    balanceAmountCents: '00',
    balanceLabel: 'Available Paycheck Balance',
    actionText: 'Request Direct Deposit Payout',
    breakdown: [
      { label: 'Base Monthly Rate', val: '$2,800.00' },
      { label: 'Tips Earned', val: '$650.00' },
      { label: 'Shifts Worked', val: '22 Shifts' },
      { label: 'Pay Date', val: '1st of Month' },
    ],
  },
};

export default function ProfilePage() {
  const { showToast } = useToast();

  const [activeRole, setActiveRole] = useState<'admin' | 'staff'>('admin');
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Editable identity form values
  const currentRole = USER_ROLES_DATA[activeRole];
  const [formData, setFormData] = useState({
    fullName: currentRole.name,
    phone: currentRole.phone,
    emergencyName: currentRole.emergencyName,
    emergencyPhone: currentRole.emergencyPhone,
    address: currentRole.address,
  });

  const handleRoleSwitch = (role: 'admin' | 'staff') => {
    setActiveRole(role);
    const newRoleData = USER_ROLES_DATA[role];
    setFormData({
      fullName: newRoleData.name,
      phone: newRoleData.phone,
      emergencyName: newRoleData.emergencyName,
      emergencyPhone: newRoleData.emergencyPhone,
      address: newRoleData.address,
    });
    setIsEditingDetails(false);
    showToast(`Profile View Switched to ${role.toUpperCase()}`);
  };

  const handleWithdrawOrPayout = () => {
    if (activeRole === 'admin') {
      showToast('Generating Store Financial Report PDF...');
    } else {
      showToast('Salary payout request submitted to Payroll Admin!');
    }
  };

  const handleSaveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingDetails(false);
    showToast('Employment profile details updated.');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match. Please verify.');
      return;
    }
    setPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Security password updated successfully!');
  };

  return (
    <div className="bg-brand-dark text-gray-100 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-brand-500 selection:text-white relative">
      {/* ── TOP HEADER NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 glass-nav border-b border-brand-border flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <BrandLogo href="/" subtitle="Staff Portal" size="md" />
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/order"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white bg-gray-900 border border-brand-border px-3 py-1.5 rounded-xl transition"
          >
            <ChefHat className="w-3.5 h-3.5 text-brand-500" />
            <span>Kitchen Ops</span>
          </Link>

          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white bg-gray-900 border border-brand-border px-3 py-1.5 rounded-xl transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Dashboard</span>
          </Link>

          <div className="h-6 w-px bg-brand-border hidden sm:block" />

          {/* User Profile Dropdown */}
          <UserProfileDropdown
            variant="admin"
            user={{
              name: currentRole.name,
              email: currentRole.email,
              role: currentRole.roleBadgeText,
            }}
          />
        </div>
      </header>

      {/* ── MAIN BODY CONTAINER ── */}
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        {/* ROLE DEMO SWITCHER BAR */}
        <div className="glass-card p-3 rounded-2xl border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-500" />
            <span className="font-bold text-gray-300">Preview User Role View:</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-xl border border-brand-border">
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeRole === 'admin'
                  ? 'text-brand-500 bg-brand-500/20 border border-brand-500/30'
                  : 'text-gray-400 hover:text-white font-semibold'
              }`}
            >
              Admin View (Store Revenue)
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('staff')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeRole === 'staff'
                  ? 'text-brand-500 bg-brand-500/20 border border-brand-500/30'
                  : 'text-gray-400 hover:text-white font-semibold'
              }`}
            >
              Staff View (Personal Salary)
            </button>
          </div>
        </div>

        {/* PROFILE TOP HEADER PANEL */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
            {/* Left Pane: Profile Picture Avatar */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-linear-to-tr from-brand-600 to-amber-400 p-1 shadow-glow flex items-center justify-center">
                <div className="w-full h-full bg-gray-900 rounded-[22px] flex items-center justify-center text-gray-400 border border-brand-border/40">
                  <User className="w-14 h-14 sm:w-16 sm:h-16 text-brand-500" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Click to upload new staff badge photo.')}
                className="absolute bottom-1 right-1 p-2 rounded-xl bg-gray-900 border border-brand-border text-gray-300 hover:text-white shadow-lg transition active:scale-95"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4 text-brand-500" />
              </button>
            </div>

            {/* Right Pane: User Details */}
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-brand-500 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  {currentRole.userId}
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  {currentRole.roleBadgeText}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {formData.fullName}
              </h1>

              <p className="text-sm font-medium text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{currentRole.email}</span>
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Employee
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-500" /> Main Branch (Kitchen #1)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FINANCIAL OVERVIEW BALANCE BOX */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-glow-emerald">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{currentRole.balanceTitle}</h3>
                <p className="text-[11px] text-gray-400">{currentRole.balanceSubtitle}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Active Ledger
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <span className="text-xs text-gray-500 font-semibold block mb-1">
                {currentRole.balanceLabel}
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {currentRole.balanceAmountMain}.
                <span className="text-brand-500 text-3xl sm:text-4xl">
                  {currentRole.balanceAmountCents}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleWithdrawOrPayout}
                className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-5 py-3 rounded-xl shadow-glow-emerald text-xs flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>{currentRole.actionText}</span>
              </button>
            </div>
          </div>

          {/* Breakdown Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-brand-border/60 text-xs">
            {currentRole.breakdown.map((item, i) => (
              <div
                key={i}
                className="p-3 bg-gray-900/60 rounded-2xl border border-brand-border space-y-0.5"
              >
                <span className="text-[10px] text-gray-400 block">{item.label}</span>
                <span className="font-bold text-white text-sm">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TWO COLUMN DETAILS & SECURITY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS: PERSONAL IDENTITY & SHIFT INFORMATION */}
          <div className="lg:col-span-2 space-y-6">
            {/* Staff Identity Form / View */}
            <div className="glass-card p-6 rounded-3xl border border-brand-border space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-brand-500" />
                  <span>Employment Identity Details</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingDetails((v) => !v)}
                  className="text-xs text-brand-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingDetails ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              </div>

              <form onSubmit={handleSaveProfileDetails} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Full Legal Name</label>
                  <input
                    type="text"
                    readOnly={!isEditingDetails}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-white transition ${
                      isEditingDetails
                        ? 'bg-gray-900 border border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'
                        : 'bg-gray-900/60 border border-brand-border cursor-default'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Staff Contact Phone</label>
                  <input
                    type="text"
                    readOnly={!isEditingDetails}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-white transition ${
                      isEditingDetails
                        ? 'bg-gray-900 border border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'
                        : 'bg-gray-900/60 border border-brand-border cursor-default'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Emergency Contact Name</label>
                  <input
                    type="text"
                    readOnly={!isEditingDetails}
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-white transition ${
                      isEditingDetails
                        ? 'bg-gray-900 border border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'
                        : 'bg-gray-900/60 border border-brand-border cursor-default'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Emergency Phone</label>
                  <input
                    type="text"
                    readOnly={!isEditingDetails}
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-white transition ${
                      isEditingDetails
                        ? 'bg-gray-900 border border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'
                        : 'bg-gray-900/60 border border-brand-border cursor-default'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-400 mb-1 font-semibold">Residential Address</label>
                  <input
                    type="text"
                    readOnly={!isEditingDetails}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-white transition ${
                      isEditingDetails
                        ? 'bg-gray-900 border border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'
                        : 'bg-gray-900/60 border border-brand-border cursor-default'
                    }`}
                  />
                </div>

                {isEditingDetails && (
                  <div className="sm:col-span-2 flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-glow text-xs transition cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Shift Schedule & Roster */}
            <div className="glass-card p-6 rounded-3xl border border-brand-border space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-brand-border pb-3">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Assigned Work Shifts</span>
                </span>
                <span className="text-[10px] text-gray-400 font-normal">Week 37 Roster</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-gray-900/60 rounded-2xl border border-brand-border space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">
                    Morning Shift
                  </span>
                  <p className="font-bold text-white">Mon - Wed</p>
                  <p className="text-gray-400 text-[11px]">09:00 AM - 05:00 PM</p>
                </div>
                <div className="p-3 bg-gray-900/60 rounded-2xl border border-brand-border space-y-1">
                  <span className="text-[10px] text-brand-500 font-bold uppercase block">
                    Evening Shift
                  </span>
                  <p className="font-bold text-white">Thu - Sat</p>
                  <p className="text-gray-400 text-[11px]">04:00 PM - 12:00 AM</p>
                </div>
                <div className="p-3 bg-gray-900/60 rounded-2xl border border-brand-border space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                    Rest Day
                  </span>
                  <p className="font-bold text-white">Sunday</p>
                  <p className="text-gray-400 text-[11px]">Off Duty</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COL: SECURITY & ACTIVITY LOG */}
          <div className="space-y-6">
            {/* Account Security Settings */}
            <div className="glass-card p-6 rounded-3xl border border-brand-border space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-500" />
                <span>Security & Login</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-gray-900/60 rounded-2xl border border-brand-border">
                  <div>
                    <p className="font-bold text-white">Password</p>
                    <p className="text-[10px] text-gray-400">Last changed 14 days ago</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(true)}
                    className="text-brand-500 font-bold hover:underline cursor-pointer"
                  >
                    Update
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-900/60 rounded-2xl border border-brand-border">
                  <div>
                    <p className="font-bold text-white">Two-Factor Auth</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">Enforced for Staff</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

            {/* Recent Portal Activity Log */}
            <div className="glass-card p-6 rounded-3xl border border-brand-border space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>Recent Activity Log</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 pb-2 border-b border-brand-border/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-200">Logged into Kitchen Ops</p>
                    <p className="text-[10px] text-gray-500">Today at 09:14 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pb-2 border-b border-brand-border/40">
                  <Flame className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-200">Completed Order #ORD-1082</p>
                    <p className="text-[10px] text-gray-500">Today at 11:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Key className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-200">Password verified</p>
                    <p className="text-[10px] text-gray-500">Yesterday at 04:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-[11px] text-gray-500 border-t border-brand-border/40">
        <p>&copy; 2026 TasteCraft Restaurant System. All staff credentials protected.</p>
      </footer>

      {/* CHANGE PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-modal border border-brand-border rounded-3xl max-w-md w-full p-6 space-y-4 relative text-gray-100 shadow-2xl">
            <button
              type="button"
              onClick={() => setPasswordModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Update Password</h3>
            <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">
                  New Password (Min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-glow transition cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
