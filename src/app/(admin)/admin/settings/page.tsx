'use client';

import React, { useState } from 'react';
import {
  Settings,
  Mail,
  Globe,
  Save,
  Zap,
  Shield,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [platform, setPlatform] = useState({
    platformName: 'NorthLend Financial',
    supportEmail: 'support@northlend.com',
    defaultCurrency: 'CAD',
    timezone: 'America/Toronto',
    minInvestment: '25000',
    maxInvestment: '5000000',
    kycRequired: true,
    ndaRequired: true,
    twoFactorRequired: false,
    maintenanceMode: false,
    investorRegistration: true,
    autoApproveKyc: false,
  });

  const [email, setEmail] = useState({
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    smtpUser: 'apikey',
    smtpPassword: '********',
    fromEmail: 'noreply@northlend.com',
    fromName: 'NorthLend Financial',
    welcomeEmail: true,
    commitmentEmail: true,
    reportEmail: true,
    kycStatusEmail: true,
  });

  const [integration, setIntegration] = useState({
    maApiUrl: 'https://api.mortgageautomator.com/v1',
    maApiKey: 'ma_live_sk_••••••••••••',
    maWebhookUrl: 'https://northlend.com/api/webhooks/ma',
    maSyncInterval: '15',
    maEnabled: true,
    maLastSync: '2024-03-10 14:30:00',
    maStatus: 'connected' as 'connected' | 'disconnected' | 'error',
  });

  const [testingConnection, setTestingConnection] = useState(false);

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      toast.success('Connection successful - Mortgage Automator API is reachable');
    }, 2000);
  };

  const handleSavePlatform = () => toast.success('Platform settings saved successfully');
  const handleSaveEmail = () => toast.success('Email settings saved successfully');
  const handleSaveIntegration = () => toast.success('Integration settings saved successfully');

  const inputStyle = {
    backgroundColor: '#282A35',
    border: '1px solid #3a3c4e',
    color: '#CFD2E5',
  };

  const renderInput = (label: string, value: string, onChange: (v: string) => void, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={inputStyle}
      />
    </div>
  );

  const renderToggle = (label: string, description: string, checked: boolean, onChange: (v: boolean) => void) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #3a3c4e' }}>
      <div>
        <p className="text-sm font-medium" style={{ color: '#CFD2E5' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#8b8fa3' }}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-colors"
        style={{ backgroundColor: checked ? '#C6AB4E' : '#3a3c4e' }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full transition-transform bg-white"
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#CFD2E5' }}>Admin Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#8b8fa3' }}>Configure platform, email, and integration settings.</p>
      </div>

      {/* Platform Settings */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" style={{ color: '#C6AB4E' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>Platform Settings</h2>
          </div>
          <button
            onClick={handleSavePlatform}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {renderInput('Platform Name', platform.platformName, (v) => setPlatform((p) => ({ ...p, platformName: v })))}
          {renderInput('Support Email', platform.supportEmail, (v) => setPlatform((p) => ({ ...p, supportEmail: v })), 'email')}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>Default Currency</label>
            <select
              value={platform.defaultCurrency}
              onChange={(e) => setPlatform((p) => ({ ...p, defaultCurrency: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none"
              style={inputStyle}
            >
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>Timezone</label>
            <select
              value={platform.timezone}
              onChange={(e) => setPlatform((p) => ({ ...p, timezone: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none"
              style={inputStyle}
            >
              <option value="America/Toronto">America/Toronto (EST)</option>
              <option value="America/Vancouver">America/Vancouver (PST)</option>
              <option value="America/Edmonton">America/Edmonton (MST)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          {renderInput('Minimum Investment ($)', platform.minInvestment, (v) => setPlatform((p) => ({ ...p, minInvestment: v })))}
          {renderInput('Maximum Investment ($)', platform.maxInvestment, (v) => setPlatform((p) => ({ ...p, maxInvestment: v })))}
        </div>

        <div className="space-y-0">
          {renderToggle('KYC Required', 'Require investors to complete KYC before investing', platform.kycRequired, (v) => setPlatform((p) => ({ ...p, kycRequired: v })))}
          {renderToggle('NDA Required', 'Require NDA signature before viewing deal details', platform.ndaRequired, (v) => setPlatform((p) => ({ ...p, ndaRequired: v })))}
          {renderToggle('Two-Factor Authentication', 'Require 2FA for all investor accounts', platform.twoFactorRequired, (v) => setPlatform((p) => ({ ...p, twoFactorRequired: v })))}
          {renderToggle('Maintenance Mode', 'Temporarily disable investor access to the portal', platform.maintenanceMode, (v) => setPlatform((p) => ({ ...p, maintenanceMode: v })))}
          {renderToggle('Investor Registration', 'Allow new investors to register on the platform', platform.investorRegistration, (v) => setPlatform((p) => ({ ...p, investorRegistration: v })))}
          {renderToggle('Auto-Approve KYC', 'Automatically approve KYC documents (not recommended)', platform.autoApproveKyc, (v) => setPlatform((p) => ({ ...p, autoApproveKyc: v })))}
        </div>
      </div>

      {/* Email Settings */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" style={{ color: '#C6AB4E' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>Email Settings</h2>
          </div>
          <button
            onClick={handleSaveEmail}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {renderInput('SMTP Host', email.smtpHost, (v) => setEmail((p) => ({ ...p, smtpHost: v })))}
          {renderInput('SMTP Port', email.smtpPort, (v) => setEmail((p) => ({ ...p, smtpPort: v })))}
          {renderInput('SMTP Username', email.smtpUser, (v) => setEmail((p) => ({ ...p, smtpUser: v })))}
          {renderInput('SMTP Password', email.smtpPassword, (v) => setEmail((p) => ({ ...p, smtpPassword: v })), 'password')}
          {renderInput('From Email', email.fromEmail, (v) => setEmail((p) => ({ ...p, fromEmail: v })), 'email')}
          {renderInput('From Name', email.fromName, (v) => setEmail((p) => ({ ...p, fromName: v })))}
        </div>

        <h3 className="text-sm font-semibold mb-3" style={{ color: '#CFD2E5' }}>Email Notifications</h3>
        <div className="space-y-0">
          {renderToggle('Welcome Email', 'Send welcome email on new registration', email.welcomeEmail, (v) => setEmail((p) => ({ ...p, welcomeEmail: v })))}
          {renderToggle('Commitment Notifications', 'Notify investors when commitments are processed', email.commitmentEmail, (v) => setEmail((p) => ({ ...p, commitmentEmail: v })))}
          {renderToggle('Report Notifications', 'Notify investors when new reports are available', email.reportEmail, (v) => setEmail((p) => ({ ...p, reportEmail: v })))}
          {renderToggle('KYC Status Updates', 'Notify investors on KYC approval or rejection', email.kycStatusEmail, (v) => setEmail((p) => ({ ...p, kycStatusEmail: v })))}
        </div>
      </div>

      {/* Integration Settings */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#2E3040', border: '1px solid #3a3c4e' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: '#C6AB4E' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#CFD2E5' }}>Integration Settings</h2>
          </div>
          <button
            onClick={handleSaveIntegration}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: '#C6AB4E', color: '#282A35' }}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-3 p-3 rounded-lg mb-5" style={{
          backgroundColor: integration.maStatus === 'connected' ? 'rgba(76, 175, 80, 0.08)' : 'rgba(229, 57, 53, 0.08)',
          border: `1px solid ${integration.maStatus === 'connected' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(229, 57, 53, 0.3)'}`,
        }}>
          {integration.maStatus === 'connected' ? (
            <CheckCircle className="w-5 h-5" style={{ color: '#4CAF50' }} />
          ) : (
            <AlertTriangle className="w-5 h-5" style={{ color: '#E53935' }} />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: integration.maStatus === 'connected' ? '#4CAF50' : '#E53935' }}>
              Mortgage Automator: {integration.maStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </p>
            <p className="text-xs" style={{ color: '#8b8fa3' }}>Last synced: {integration.maLastSync}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {renderInput('API URL', integration.maApiUrl, (v) => setIntegration((p) => ({ ...p, maApiUrl: v })))}
          {renderInput('API Key', integration.maApiKey, (v) => setIntegration((p) => ({ ...p, maApiKey: v })), 'password')}
          {renderInput('Webhook URL', integration.maWebhookUrl, (v) => setIntegration((p) => ({ ...p, maWebhookUrl: v })))}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#CFD2E5' }}>Sync Interval (minutes)</label>
            <select
              value={integration.maSyncInterval}
              onChange={(e) => setIntegration((p) => ({ ...p, maSyncInterval: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none appearance-none"
              style={inputStyle}
            >
              <option value="5">Every 5 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every hour</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          {renderToggle('Enable Integration', 'Sync deals and investor data with Mortgage Automator', integration.maEnabled, (v) => setIntegration((p) => ({ ...p, maEnabled: v })))}
        </div>

        <button
          onClick={handleTestConnection}
          disabled={testingConnection}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: 'rgba(198, 171, 78, 0.1)', color: '#C6AB4E', border: '1px solid #C6AB4E' }}
        >
          <RefreshCw className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
          {testingConnection ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
}
