'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plug, HelpCircle, CheckCircle, XCircle, AlertCircle, X, Eye, EyeOff, RefreshCw, Wifi } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
  fields: { key: string; label: string; type: string; placeholder: string }[];
}

const integrations: Integration[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    description: 'Send visitor invites, OTPs, and notifications via WhatsApp',
    category: 'Messaging',
    status: 'connected',
    icon: '💬',
    fields: [
      { key: 'phone_id', label: 'Phone Number ID', type: 'text', placeholder: 'Enter Phone Number ID' },
      { key: 'access_token', label: 'Access Token', type: 'password', placeholder: 'Enter Access Token' },
      { key: 'waba_id', label: 'WABA ID', type: 'text', placeholder: 'Enter WhatsApp Business Account ID' },
    ],
  },
  {
    id: 'hris',
    name: 'HRIS / Active Directory',
    description: 'Sync employee data from AD, Okta, or your HRIS platform',
    category: 'Identity',
    status: 'connected',
    icon: '🏢',
    fields: [
      { key: 'provider', label: 'Provider', type: 'text', placeholder: 'e.g. Okta, Azure AD' },
      { key: 'tenant_id', label: 'Tenant ID', type: 'text', placeholder: 'Enter Tenant ID' },
      { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'Enter Client ID' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'Enter Client Secret' },
    ],
  },
  {
    id: 'access-control',
    name: 'Access Control System',
    description: 'Integrate with door controllers, turnstiles, and barriers',
    category: 'Hardware',
    status: 'error',
    icon: '🔐',
    fields: [
      { key: 'controller_ip', label: 'Controller IP', type: 'text', placeholder: '192.168.1.x' },
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'Enter API Key' },
      { key: 'port', label: 'Port', type: 'text', placeholder: '8080' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack / Microsoft Teams',
    description: 'Notify hosts instantly when their visitor arrives',
    category: 'Messaging',
    status: 'disconnected',
    icon: '📢',
    fields: [
      { key: 'webhook_url', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.slack.com/...' },
      { key: 'channel', label: 'Default Channel', type: 'text', placeholder: '#visitor-alerts' },
    ],
  },
  {
    id: 'printer',
    name: 'Printer Service',
    description: 'Connect badge printers for automatic visitor badge printing',
    category: 'Hardware',
    status: 'connected',
    icon: '🖨️',
    fields: [
      { key: 'printer_ip', label: 'Printer IP', type: 'text', placeholder: '192.168.1.x' },
      { key: 'printer_model', label: 'Printer Model', type: 'text', placeholder: 'e.g. Zebra ZD421' },
    ],
  },
  {
    id: 'calendar',
    name: 'Calendar Integration',
    description: 'Sync visitor appointments with Google Calendar or Outlook',
    category: 'Productivity',
    status: 'disconnected',
    icon: '📅',
    fields: [
      { key: 'provider', label: 'Calendar Provider', type: 'text', placeholder: 'Google or Outlook' },
      { key: 'oauth_token', label: 'OAuth Token', type: 'password', placeholder: 'Enter OAuth Token' },
      { key: 'calendar_id', label: 'Calendar ID', type: 'text', placeholder: 'Enter Calendar ID' },
    ],
  },
];

const statusConfig = {
  connected: { label: 'Connected', icon: <CheckCircle size={12} />, cls: 'bg-green-50 text-green-700' },
  disconnected: { label: 'Not Connected', icon: <XCircle size={12} />, cls: 'bg-gray-100 text-gray-500' },
  error: { label: 'Error', icon: <AlertCircle size={12} />, cls: 'bg-red-50 text-red-600' },
};

export default function IntegrationsPage() {
  const [drawerOpen, setDrawerOpen] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const activeIntegration = integrations.find(i => i.id === drawerOpen);

  const handleTest = () => {
    setTestResult('testing');
    setTimeout(() => setTestResult(Math.random() > 0.3 ? 'success' : 'fail'), 2000);
  };

  const togglePassword = (key: string) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Plug size={18} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Integrations</h1>
              <p className="text-[12px] text-text-muted mt-0.5">Connect VMSPro with your existing tools and services</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              <HelpCircle size={13} /> Help
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Integrations', value: integrations.length, color: 'text-indigo-600' },
            { label: 'Connected', value: connectedCount, color: 'text-green-600' },
            { label: 'Needs Attention', value: integrations.filter(i => i.status === 'error').length, color: 'text-red-600' },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-xl border border-border p-4 shadow-card">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map(integration => {
            const sc = statusConfig[integration.status];
            return (
              <div key={integration.id} className="bg-white rounded-xl border border-border p-5 shadow-card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-2xl">
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold text-text-primary leading-tight">{integration.name}</h3>
                      <span className="text-[10px] font-medium text-text-muted">{integration.category}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${sc.cls}`}>
                    {sc.icon} {sc.label}
                  </span>
                </div>
                <p className="text-[12px] text-text-muted mb-4 leading-relaxed">{integration.description}</p>
                <button
                  onClick={() => { setDrawerOpen(integration.id); setTestResult('idle'); }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-all"
                >
                  <Plug size={13} /> Configure
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Drawer */}
      {drawerOpen && activeIntegration && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setDrawerOpen(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeIntegration.icon}</span>
                <div>
                  <h2 className="text-[15px] font-bold text-text-primary">{activeIntegration.name}</h2>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConfig[activeIntegration.status].cls}`}>
                    {statusConfig[activeIntegration.status].icon} {statusConfig[activeIntegration.status].label}
                  </span>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-all">
                <X size={16} className="text-text-muted" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <p className="text-[13px] text-text-muted">{activeIntegration.description}</p>
              <div className="space-y-3">
                {activeIntegration.fields.map(field => (
                  <div key={field.key}>
                    <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.type === 'password' && !showPasswords[field.key] ? 'password' : 'text'}
                        value={fieldValues[field.key] || ''}
                        onChange={e => setFieldValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 pr-10"
                      />
                      {field.type === 'password' && (
                        <button
                          onClick={() => togglePassword(field.key)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                        >
                          {showPasswords[field.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Connection */}
              <div className="pt-2">
                <button
                  onClick={handleTest}
                  disabled={testResult === 'testing'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-text-secondary border border-border rounded-lg hover:bg-surface transition-all disabled:opacity-60"
                >
                  {testResult === 'testing' ? (
                    <><RefreshCw size={14} className="animate-spin" /> Testing Connection...</>
                  ) : (
                    <><Wifi size={14} /> Test Connection</>
                  )}
                </button>
                {testResult === 'success' && (
                  <div className="mt-2 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-[12px] text-green-700 font-medium">Connection successful!</span>
                  </div>
                )}
                {testResult === 'fail' && (
                  <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle size={14} className="text-red-600" />
                    <span className="text-[12px] text-red-700 font-medium">Connection failed. Check credentials.</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-5 border-t border-border flex gap-2.5">
              <button onClick={() => setDrawerOpen(null)} className="flex-1 px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-sm">
                Save Configuration
              </button>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
