'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Settings, Building, Clock, Key, HelpCircle, CheckCircle, Plus, Trash2, Eye, EyeOff, RefreshCw, Upload, Globe, Webhook } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Company Profile' },
  { id: 'retention', label: 'Retention Policy' },
  { id: 'apikeys', label: 'API Keys' },
];

const initialRetention = [
  { id: 1, dataType: 'Visitor Logs', retentionDays: 365, description: 'Full visitor check-in/out records' },
  { id: 2, dataType: 'Consent Records', retentionDays: 730, description: 'GDPR/DPDP consent capture logs' },
  { id: 3, dataType: 'Photo Captures', retentionDays: 90, description: 'Visitor photos taken at kiosks' },
  { id: 4, dataType: 'Induction Records', retentionDays: 365, description: 'Safety induction completion records' },
  { id: 5, dataType: 'Blacklist Entries', retentionDays: 1825, description: 'Watchlist and blacklist data' },
  { id: 6, dataType: 'Audit Logs', retentionDays: 1095, description: 'Admin action audit trail' },
];

const initialApiKeys = [
  { id: 1, name: 'Production API Key', key: 'vmsp_live_xK9mP2qR7nL4wT8vB3cJ', created: '01 Jan 2026', lastUsed: '14 Apr 2026', status: 'active' },
  { id: 2, name: 'Staging API Key', key: 'vmsp_test_aH5dF1yU6oN2sW9eC7mX', created: '15 Feb 2026', lastUsed: '10 Apr 2026', status: 'active' },
  { id: 3, name: 'Kiosk Integration Key', key: 'vmsp_kiosk_bG8jQ3rV5tM1pK4nE6wZ', created: '01 Mar 2026', lastUsed: '13 Apr 2026', status: 'active' },
];

const webhooks = [
  { id: 1, name: 'Visitor Check-in Webhook', url: 'https://api.acme.com/webhooks/visitor-checkin', events: ['visitor.checkin', 'visitor.checkout'], status: 'active' },
  { id: 2, name: 'Blacklist Alert Webhook', url: 'https://api.acme.com/webhooks/blacklist', events: ['blacklist.match'], status: 'active' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [autoSaved, setAutoSaved] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({});
  const [retention, setRetention] = useState(initialRetention);
  const [editingRetention, setEditingRetention] = useState<number | null>(null);
  const [profile, setProfile] = useState({
    companyName: 'Acme Corporation',
    industry: 'Technology',
    country: 'India',
    timezone: 'Asia/Kolkata (IST)',
    website: 'https://acme.com',
    supportEmail: 'support@acme.com',
    plan: 'Enterprise',
    address: '14th Floor, Bandra Kurla Complex, Mumbai – 400051',
  });

  const handleProfileChange = (key: string, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setAutoSaved(false);
    setTimeout(() => setAutoSaved(true), 1500);
  };

  const handleRetentionChange = (id: number, days: number) => {
    setRetention(prev => prev.map(r => r.id === id ? { ...r, retentionDays: days } : r));
    setAutoSaved(false);
    setTimeout(() => setAutoSaved(true), 1500);
  };

  const toggleKey = (id: number) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));

  const maskKey = (key: string) => key.substring(0, 12) + '••••••••••••••••••••';

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Settings size={18} className="text-slate-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Settings</h1>
              <p className="text-[12px] text-text-muted mt-0.5">Manage company profile, data retention, and API access</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {autoSaved && (
              <span className="flex items-center gap-1.5 text-[12px] text-green-600 font-medium">
                <CheckCircle size={13} /> Auto-saved
              </span>
            )}
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              <HelpCircle size={13} /> Help
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-sm">
              Publish All Changes
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${activeTab === tab.id ? 'bg-white text-text-primary shadow-sm border border-border' : 'text-text-muted hover:text-text-secondary'}`}
            >
              {tab.id === 'profile' && <Building size={13} className="inline mr-1.5 -mt-0.5" />}
              {tab.id === 'retention' && <Clock size={13} className="inline mr-1.5 -mt-0.5" />}
              {tab.id === 'apikeys' && <Key size={13} className="inline mr-1.5 -mt-0.5" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Company Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            {/* Logo Upload */}
            <div className="bg-white rounded-xl border border-border p-5 shadow-card">
              <h3 className="text-[14px] font-semibold text-text-primary mb-4">Company Logo</h3>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-primary-200">
                  AC
                </div>
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-all">
                    <Upload size={14} /> Upload Logo
                  </button>
                  <p className="text-[11px] text-text-muted mt-1.5">PNG, JPG or SVG. Max 2MB. Recommended: 200×200px</p>
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="bg-white rounded-xl border border-border p-5 shadow-card">
              <h3 className="text-[14px] font-semibold text-text-primary mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'companyName', label: 'Company Name', icon: <Building size={13} /> },
                  { key: 'industry', label: 'Industry', icon: <Globe size={13} /> },
                  { key: 'country', label: 'Country', icon: <Globe size={13} /> },
                  { key: 'timezone', label: 'Timezone', icon: <Clock size={13} /> },
                  { key: 'website', label: 'Website', icon: <Globe size={13} /> },
                  { key: 'supportEmail', label: 'Support Email', icon: <Globe size={13} /> },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">{field.label}</label>
                    <input
                      value={profile[field.key as keyof typeof profile]}
                      onChange={e => handleProfileChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Office Address</label>
                <textarea
                  value={profile.address}
                  onChange={e => handleProfileChange('address', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                />
              </div>
            </div>

            {/* Plan Info */}
            <div className="bg-white rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary">Current Plan</h3>
                  <p className="text-[12px] text-text-muted mt-0.5">Your subscription and usage details</p>
                </div>
                <span className="text-[12px] font-bold px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                  {profile.plan}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { label: 'Sites', value: '5 / 10' },
                  { label: 'Kiosks', value: '15 / 30' },
                  { label: 'Users', value: '12 / 50' },
                ].map(u => (
                  <div key={u.label} className="p-3 rounded-xl bg-surface border border-border text-center">
                    <p className="text-[15px] font-bold text-text-primary">{u.value}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{u.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Retention Policy */}
        {activeTab === 'retention' && (
          <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-[14px] font-semibold text-text-primary">Data Retention Policies</h3>
              <p className="text-[12px] text-text-muted mt-0.5">Click on retention days to edit. Changes auto-save.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    {['Data Type', 'Description', 'Retention Period', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {retention.map((policy, i) => (
                    <tr key={policy.id} className={`border-b border-border hover:bg-surface/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                      <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">{policy.dataType}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{policy.description}</td>
                      <td className="px-4 py-3">
                        {editingRetention === policy.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={policy.retentionDays}
                              onChange={e => handleRetentionChange(policy.id, Number(e.target.value))}
                              onBlur={() => setEditingRetention(null)}
                              className="w-24 px-2 py-1 text-[13px] border border-primary-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                              autoFocus
                            />
                            <span className="text-[12px] text-text-muted">days</span>
                          </div>
                        ) : (
                          <span
                            onClick={() => setEditingRetention(policy.id)}
                            className="text-[13px] font-semibold text-primary-600 cursor-pointer hover:underline"
                          >
                            {policy.retentionDays} days
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditingRetention(policy.id)}
                          className="text-[12px] font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50 transition-all"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* API Keys */}
        {activeTab === 'apikeys' && (
          <div className="space-y-5">
            {/* API Keys Table */}
            <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary">API Keys</h3>
                  <p className="text-[12px] text-text-muted mt-0.5">Manage API keys for external integrations</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
                  <Plus size={13} /> Generate New Key
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      {['Name', 'API Key', 'Created', 'Last Used', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {initialApiKeys.map((apiKey, i) => (
                      <tr key={apiKey.id} className={`border-b border-border hover:bg-surface/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                        <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">{apiKey.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <code className="text-[12px] font-mono text-text-secondary bg-surface px-2 py-0.5 rounded border border-border">
                              {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                            </code>
                            <button onClick={() => toggleKey(apiKey.id)} className="text-text-muted hover:text-text-secondary">
                              {showKeys[apiKey.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-text-secondary">{apiKey.created}</td>
                        <td className="px-4 py-3 text-[13px] text-text-secondary">{apiKey.lastUsed}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                            <CheckCircle size={10} /> Active
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button className="text-[12px] font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50 transition-all">
                              <RefreshCw size={12} />
                            </button>
                            <button className="text-[12px] font-medium text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-all">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Webhooks */}
            <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary">Webhooks</h3>
                  <p className="text-[12px] text-text-muted mt-0.5">Configure webhook endpoints for real-time event notifications</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
                  <Plus size={13} /> Add Webhook
                </button>
              </div>
              <div className="p-4 space-y-3">
                {webhooks.map(wh => (
                  <div key={wh.id} className="flex items-start justify-between p-4 rounded-xl bg-surface border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center mt-0.5">
                        <Webhook size={14} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-primary">{wh.name}</p>
                        <code className="text-[11px] font-mono text-text-muted">{wh.url}</code>
                        <div className="flex gap-1.5 mt-1.5">
                          {wh.events.map(e => (
                            <span key={e} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700">{e}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                        <CheckCircle size={10} /> Active
                      </span>
                      <button className="text-[12px] font-medium text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
