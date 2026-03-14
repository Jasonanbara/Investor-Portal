'use client';

import { useState } from 'react';
import {
  User,
  FileCheck,
  BarChart3,
  Building,
  Bell,
  Shield,
  Save,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'kyc', label: 'KYC Documents', icon: FileCheck },
  { id: 'preferences', label: 'Investment Preferences', icon: BarChart3 },
  { id: 'banking', label: 'Banking Info', icon: Building },
  { id: 'communications', label: 'Communications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');

  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'James',
    lastName: 'Richardson',
    email: 'james.richardson@example.com',
    phone: '+1 (416) 555-0187',
    address: '120 Adelaide Street West',
    city: 'Toronto',
    province: 'Ontario',
    postalCode: 'M5H 1T1',
  });

  // Preferences state
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [dealSizeMin, setDealSizeMin] = useState('50000');
  const [dealSizeMax, setDealSizeMax] = useState('500000');
  const [propertyTypes, setPropertyTypes] = useState(['Multifamily', 'Commercial', 'Mixed-Use']);

  // Communications state
  const [commsPrefs, setCommsPrefs] = useState({
    dealOpportunities: true,
    dealStatusUpdates: true,
    monthlyReports: true,
    chatMessages: true,
    systemAnnouncements: false,
    weeklyDigest: true,
  });

  // Security state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePropertyTypeToggle = (type: string) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-[#C6AB4E]' : 'bg-[#3a3c4e]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6AB4E]/20">
            <User className="h-5 w-5 text-[#C6AB4E]" />
          </div>
          <h1 className="text-2xl font-bold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
            Profile
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#C6AB4E]/15 text-[#C6AB4E]'
                    : 'text-[#8b8fa3] hover:text-[#CFD2E5]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6">
            <h2 className="mb-6 text-lg font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">First Name</label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                    className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">Last Name</label>
                  <input
                    type="text"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                    className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">Email</label>
                <input
                  type="email"
                  value={personalInfo.email}
                  disabled
                  className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#8b8fa3] outline-none opacity-60"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">Phone</label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">Street Address</label>
                <input
                  type="text"
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                  className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">City</label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                    className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">Province</label>
                  <input
                    type="text"
                    value={personalInfo.province}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, province: e.target.value })}
                    className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">Postal Code</label>
                  <input
                    type="text"
                    value={personalInfo.postalCode}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, postalCode: e.target.value })}
                    className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center gap-2 rounded-lg bg-[#C6AB4E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b89b3e]">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KYC Documents Tab */}
        {activeTab === 'kyc' && (
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6">
            <h2 className="mb-6 text-lg font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              KYC Documents
            </h2>
            <div className="space-y-5">
              {[
                { label: 'Government-Issued ID', status: 'verified', fileName: 'passport-scan.pdf', uploadDate: 'Jan 15, 2026' },
                { label: 'Proof of Address', status: 'verified', fileName: 'utility-bill.pdf', uploadDate: 'Jan 15, 2026' },
                { label: 'Accreditation Certificate', status: 'pending', fileName: 'accreditation.pdf', uploadDate: 'Mar 5, 2026' },
                { label: 'Tax Documents (T1)', status: 'missing', fileName: null, uploadDate: null },
              ].map((doc) => (
                <div
                  key={doc.label}
                  className="flex items-center justify-between rounded-lg border border-[#3a3c4e] bg-[#282A35] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      doc.status === 'verified' ? 'bg-[#4CAF50]/10' :
                      doc.status === 'pending' ? 'bg-[#FFB300]/10' : 'bg-[#E53935]/10'
                    }`}>
                      {doc.status === 'verified' && <CheckCircle className="h-5 w-5 text-[#4CAF50]" />}
                      {doc.status === 'pending' && <Clock className="h-5 w-5 text-[#FFB300]" />}
                      {doc.status === 'missing' && <AlertTriangle className="h-5 w-5 text-[#E53935]" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#CFD2E5]">{doc.label}</p>
                      {doc.fileName ? (
                        <p className="text-xs text-[#8b8fa3]">{doc.fileName} - Uploaded {doc.uploadDate}</p>
                      ) : (
                        <p className="text-xs text-[#E53935]">Not uploaded</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      doc.status === 'verified' ? 'bg-[#4CAF50]/10 text-[#4CAF50]' :
                      doc.status === 'pending' ? 'bg-[#FFB300]/10 text-[#FFB300]' : 'bg-[#E53935]/10 text-[#E53935]'
                    }`}>
                      {doc.status === 'verified' ? 'Verified' : doc.status === 'pending' ? 'Pending Review' : 'Required'}
                    </span>
                    <label className="cursor-pointer rounded-lg border border-[#3a3c4e] px-3 py-1.5 text-xs text-[#CFD2E5] transition-colors hover:bg-[#353748]">
                      <Upload className="mr-1 inline h-3 w-3" />
                      {doc.fileName ? 'Replace' : 'Upload'}
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investment Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6">
            <h2 className="mb-6 text-lg font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              Investment Preferences
            </h2>
            <div className="space-y-6">
              {/* Risk Tolerance */}
              <div>
                <label className="mb-3 block text-sm font-medium text-[#CFD2E5]">Risk Tolerance</label>
                <div className="space-y-2">
                  {[
                    { value: 'conservative', label: 'Conservative', desc: 'Lower risk, stable returns (6-8%)' },
                    { value: 'moderate', label: 'Moderate', desc: 'Balanced risk and return (8-10%)' },
                    { value: 'aggressive', label: 'Aggressive', desc: 'Higher risk, higher returns (10-14%)' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        riskTolerance === option.value
                          ? 'border-[#C6AB4E] bg-[#C6AB4E]/10'
                          : 'border-[#3a3c4e] hover:border-[#8b8fa3]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="risk"
                        value={option.value}
                        checked={riskTolerance === option.value}
                        onChange={() => setRiskTolerance(option.value)}
                        className="h-4 w-4 accent-[#C6AB4E]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#CFD2E5]">{option.label}</p>
                        <p className="text-xs text-[#8b8fa3]">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deal Size Range */}
              <div>
                <label className="mb-3 block text-sm font-medium text-[#CFD2E5]">Preferred Deal Size Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs text-[#8b8fa3]">Minimum ($)</label>
                    <input
                      type="number"
                      value={dealSizeMin}
                      onChange={(e) => setDealSizeMin(e.target.value)}
                      className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#8b8fa3]">Maximum ($)</label>
                    <input
                      type="number"
                      value={dealSizeMax}
                      onChange={(e) => setDealSizeMax(e.target.value)}
                      className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                    />
                  </div>
                </div>
              </div>

              {/* Property Types */}
              <div>
                <label className="mb-3 block text-sm font-medium text-[#CFD2E5]">Preferred Property Types</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {['Multifamily', 'Commercial', 'Industrial', 'Retail', 'Mixed-Use', 'Land', 'Office', 'Hospitality', 'Student Housing'].map((type) => (
                    <label
                      key={type}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        propertyTypes.includes(type)
                          ? 'border-[#C6AB4E] bg-[#C6AB4E]/10 text-[#C6AB4E]'
                          : 'border-[#3a3c4e] text-[#8b8fa3] hover:border-[#8b8fa3]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={propertyTypes.includes(type)}
                        onChange={() => handlePropertyTypeToggle(type)}
                        className="h-3.5 w-3.5 accent-[#C6AB4E]"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <button className="inline-flex items-center gap-2 rounded-lg bg-[#C6AB4E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b89b3e]">
                <Save className="h-4 w-4" />
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Banking Info Tab */}
        {activeTab === 'banking' && (
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6">
            <h2 className="mb-6 text-lg font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              Banking Information
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Bank Name', value: 'Royal Bank of Canada' },
                { label: 'Account Type', value: 'Chequing' },
                { label: 'Transit Number', value: '****1234' },
                { label: 'Institution Number', value: '***003' },
                { label: 'Account Number', value: '******7890' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-[#3a3c4e] bg-[#282A35] px-4 py-3">
                  <span className="text-sm text-[#8b8fa3]">{item.label}</span>
                  <span className="text-sm font-medium text-[#CFD2E5]">{item.value}</span>
                </div>
              ))}
              <p className="mt-4 text-xs text-[#8b8fa3]">
                To update your banking information, please contact NorthLend Financial support.
              </p>
            </div>
          </div>
        )}

        {/* Communications Tab */}
        {activeTab === 'communications' && (
          <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6">
            <h2 className="mb-6 text-lg font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
              Communication Preferences
            </h2>
            <div className="divide-y divide-[#3a3c4e]/50">
              {[
                { key: 'dealOpportunities' as const, label: 'Deal Opportunities', desc: 'New investment opportunities matching your preferences' },
                { key: 'dealStatusUpdates' as const, label: 'Deal Status Updates', desc: 'Changes to deals you are invested in' },
                { key: 'monthlyReports' as const, label: 'Monthly Reports', desc: 'Portfolio performance reports' },
                { key: 'chatMessages' as const, label: 'Chat Messages', desc: 'New messages from underwriters and support' },
                { key: 'systemAnnouncements' as const, label: 'System Announcements', desc: 'Platform updates and maintenance notices' },
                { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Summary of your weekly activity' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-[#CFD2E5]">{label}</p>
                    <p className="text-xs text-[#8b8fa3]">{desc}</p>
                  </div>
                  <ToggleSwitch
                    enabled={commsPrefs[key]}
                    onToggle={() => setCommsPrefs({ ...commsPrefs, [key]: !commsPrefs[key] })}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#C6AB4E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b89b3e]">
                <Save className="h-4 w-4" />
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6">
              <h2 className="mb-6 text-lg font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
                Change Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 pr-10 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b8fa3]"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 pr-10 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b8fa3]"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#CFD2E5]">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2.5 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
                  />
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg bg-[#C6AB4E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b89b3e]">
                  <Shield className="h-4 w-4" />
                  Update Password
                </button>
              </div>
            </div>

            {/* 2FA */}
            <div className="rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#CFD2E5]" style={{ fontFamily: 'Volkhov, serif' }}>
                    Two-Factor Authentication
                  </h2>
                  <p className="mt-1 text-sm text-[#8b8fa3]">
                    Add an extra layer of security to your account with 2FA.
                  </p>
                </div>
                <ToggleSwitch
                  enabled={twoFactorEnabled}
                  onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)}
                />
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 rounded-lg border border-[#4CAF50]/20 bg-[#4CAF50]/5 p-4">
                  <p className="text-sm text-[#4CAF50]">
                    Two-factor authentication is enabled. You will be prompted for a code on each login.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
