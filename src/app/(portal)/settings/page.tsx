'use client';

import { useState } from 'react';
import {
  Settings,
  Bell,
  Monitor,
  Shield,
  Save,
  Globe,
  Clock,
  KeyRound,
  Smartphone,
  Download,
  Trash2,
  X,
} from 'lucide-react';

interface NotificationPrefs {
  dealOpportunity: boolean;
  dealStatus: boolean;
  reportUploaded: boolean;
  chatMessage: boolean;
  profileAction: boolean;
  commitmentUpdate: boolean;
  system: boolean;
  weeklyDigest: boolean;
  monthlyDigest: boolean;
}

export default function SettingsPage() {
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    dealOpportunity: true,
    dealStatus: true,
    reportUploaded: true,
    chatMessage: true,
    profileAction: true,
    commitmentUpdate: true,
    system: true,
    weeklyDigest: false,
    monthlyDigest: true,
  });

  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleToggle = (key: keyof NotificationPrefs) => {
    setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Mock save
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  const ToggleSwitch = ({
    enabled,
    onToggle,
  }: {
    enabled: boolean;
    onToggle: () => void;
  }) => (
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
    <div className="min-h-screen bg-[#282A35] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6AB4E]/20">
            <Settings className="h-5 w-5 text-[#C6AB4E]" />
          </div>
          <h1
            className="text-2xl font-bold text-[#CFD2E5]"
            style={{ fontFamily: 'Volkhov, serif' }}
          >
            Settings
          </h1>
        </div>

        {/* Notification Preferences */}
        <section className="mb-6 overflow-hidden rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
          <div className="flex items-center gap-3 border-b border-[#3a3c4e] px-6 py-4">
            <Bell className="h-5 w-5 text-[#C6AB4E]" />
            <h2
              className="text-lg font-semibold text-[#CFD2E5]"
              style={{ fontFamily: 'Volkhov, serif' }}
            >
              Notification Preferences
            </h2>
          </div>

          <div className="divide-y divide-[#3a3c4e]/50 px-6">
            <p className="py-3 text-sm text-[#8b8fa3]">
              Choose which email notifications you would like to receive.
            </p>

            {[
              { key: 'dealOpportunity' as const, label: 'Deal Opportunities', desc: 'New investment opportunities matching your preferences' },
              { key: 'dealStatus' as const, label: 'Deal Status Updates', desc: 'Changes to deals you are invested in' },
              { key: 'reportUploaded' as const, label: 'Reports & Documents', desc: 'New reports and documents available for download' },
              { key: 'chatMessage' as const, label: 'Chat Messages', desc: 'New messages from underwriters and support' },
              { key: 'profileAction' as const, label: 'Profile Actions', desc: 'KYC reminders and account-related alerts' },
              { key: 'commitmentUpdate' as const, label: 'Commitment Updates', desc: 'Status changes on your deal commitments' },
              { key: 'system' as const, label: 'System Announcements', desc: 'Platform updates, maintenance, and new features' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#CFD2E5]">{label}</p>
                  <p className="text-xs text-[#8b8fa3]">{desc}</p>
                </div>
                <ToggleSwitch
                  enabled={notificationPrefs[key]}
                  onToggle={() => handleToggle(key)}
                />
              </div>
            ))}

            <div className="py-4">
              <p className="mb-3 text-sm font-medium text-[#CFD2E5]">
                Email Digests
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#CFD2E5]">Weekly Digest</p>
                    <p className="text-xs text-[#8b8fa3]">Summary of activity every Monday</p>
                  </div>
                  <ToggleSwitch
                    enabled={notificationPrefs.weeklyDigest}
                    onToggle={() => handleToggle('weeklyDigest')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#CFD2E5]">Monthly Digest</p>
                    <p className="text-xs text-[#8b8fa3]">Monthly portfolio summary on the 1st</p>
                  </div>
                  <ToggleSwitch
                    enabled={notificationPrefs.monthlyDigest}
                    onToggle={() => handleToggle('monthlyDigest')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#3a3c4e] px-6 py-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-[#C6AB4E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b89b3e]"
            >
              <Save className="h-4 w-4" />
              {saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'saved'
                  ? 'Saved!'
                  : 'Save Changes'}
            </button>
          </div>
        </section>

        {/* Display Preferences */}
        <section className="mb-6 overflow-hidden rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
          <div className="flex items-center gap-3 border-b border-[#3a3c4e] px-6 py-4">
            <Monitor className="h-5 w-5 text-[#C6AB4E]" />
            <h2
              className="text-lg font-semibold text-[#CFD2E5]"
              style={{ fontFamily: 'Volkhov, serif' }}
            >
              Display Preferences
            </h2>
          </div>

          <div className="space-y-5 px-6 py-5">
            {/* Language */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#CFD2E5]">
                <Globe className="h-4 w-4 text-[#8b8fa3]" />
                Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  // Set cookie for next-intl
                  document.cookie = `NEXT_LOCALE=${e.target.value};path=/;max-age=31536000`;
                }}
                className="w-full max-w-xs rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
              >
                <option value="en">English</option>
                <option value="fr">Fran&ccedil;ais</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#CFD2E5]">
                <Clock className="h-4 w-4 text-[#8b8fa3]" />
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-2 text-sm text-[#CFD2E5] outline-none focus:border-[#C6AB4E]"
              >
                <option value="America/Toronto">Eastern Time (ET) - Toronto</option>
                <option value="America/Chicago">Central Time (CT) - Chicago</option>
                <option value="America/Denver">Mountain Time (MT) - Denver</option>
                <option value="America/Los_Angeles">Pacific Time (PT) - Los Angeles</option>
                <option value="America/Vancouver">Pacific Time (PT) - Vancouver</option>
                <option value="America/Edmonton">Mountain Time (MT) - Edmonton</option>
                <option value="America/Winnipeg">Central Time (CT) - Winnipeg</option>
                <option value="America/Halifax">Atlantic Time (AT) - Halifax</option>
                <option value="America/St_Johns">Newfoundland Time (NT) - St. John&apos;s</option>
                <option value="UTC">UTC</option>
              </select>
              <p className="mt-1 text-xs text-[#8b8fa3]">
                Auto-detected: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </p>
            </div>
          </div>

          <div className="border-t border-[#3a3c4e] px-6 py-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-[#C6AB4E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b89b3e]"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </section>

        {/* Account */}
        <section className="overflow-hidden rounded-xl border border-[#3a3c4e] bg-[#2E3040]">
          <div className="flex items-center gap-3 border-b border-[#3a3c4e] px-6 py-4">
            <Shield className="h-5 w-5 text-[#C6AB4E]" />
            <h2
              className="text-lg font-semibold text-[#CFD2E5]"
              style={{ fontFamily: 'Volkhov, serif' }}
            >
              Account
            </h2>
          </div>

          <div className="divide-y divide-[#3a3c4e]/50 px-6">
            {/* Change Password */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-[#8b8fa3]" />
                <div>
                  <p className="text-sm font-medium text-[#CFD2E5]">Change Password</p>
                  <p className="text-xs text-[#8b8fa3]">Update your account password</p>
                </div>
              </div>
              <a
                href="/profile?tab=security"
                className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748]"
              >
                Change
              </a>
            </div>

            {/* 2FA */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-[#8b8fa3]" />
                <div>
                  <p className="text-sm font-medium text-[#CFD2E5]">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-[#8b8fa3]">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <a
                href="/profile?tab=security"
                className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748]"
              >
                Configure
              </a>
            </div>

            {/* Download Data */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-[#8b8fa3]" />
                <div>
                  <p className="text-sm font-medium text-[#CFD2E5]">Download My Data</p>
                  <p className="text-xs text-[#8b8fa3]">
                    Export a copy of all your data
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  // Mock download
                  alert('Your data export has been queued. You will receive an email when it is ready.');
                }}
                className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-3 py-1.5 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748]"
              >
                Download
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-[#E53935]" />
                <div>
                  <p className="text-sm font-medium text-[#E53935]">Delete Account</p>
                  <p className="text-xs text-[#8b8fa3]">
                    Permanently delete your account and all associated data
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="rounded-lg border border-[#E53935]/30 bg-[#E53935]/10 px-3 py-1.5 text-sm text-[#E53935] transition-colors hover:bg-[#E53935]/20"
              >
                Delete
              </button>
            </div>
          </div>
        </section>

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl border border-[#3a3c4e] bg-[#2E3040] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3
                  className="text-lg font-semibold text-[#CFD2E5]"
                  style={{ fontFamily: 'Volkhov, serif' }}
                >
                  Delete Account
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg p-1 text-[#8b8fa3] transition-colors hover:bg-[#3a3c4e] hover:text-[#CFD2E5]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-2 text-sm text-[#CFD2E5]">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <p className="mb-6 text-sm text-[#8b8fa3]">
                All your data, including investment history, documents, and preferences
                will be permanently removed.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg border border-[#3a3c4e] bg-[#282A35] px-4 py-2 text-sm text-[#CFD2E5] transition-colors hover:bg-[#353748]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Mock deletion
                    alert('Account deletion request submitted. You will receive a confirmation email.');
                    setShowDeleteModal(false);
                  }}
                  className="rounded-lg bg-[#E53935] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#C62828]"
                >
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
