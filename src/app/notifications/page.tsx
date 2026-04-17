'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Bell, HelpCircle, Send, Eye, CheckCircle, ChevronDown } from 'lucide-react';

const tabs = [
  { id: 'invite', label: 'Invite Sent' },
  { id: 'precheckin', label: 'Pre-Check-in Complete' },
  { id: 'approval', label: 'Host Approval Request' },
  { id: 'emergency', label: 'Emergency Broadcast' },
];

const defaultTemplates: Record<string, string> = {
  invite: `Dear {{visitor_name}},

You have been invited to visit {{company_name}} on {{visit_date}} at {{visit_time}}.

📍 Location: {{site_address}}
🏢 Host: {{host_name}} ({{host_department}})
🔑 Your Pass Code: {{pass_code}}

Please complete your pre-registration at: {{checkin_link}}

For assistance, contact: {{support_email}}

Best regards,
{{company_name}} Security Team`,

  precheckin: `Hi {{visitor_name}},

Your pre-check-in for {{visit_date}} is complete! ✅

Here's your visit summary:
• Host: {{host_name}}
• Site: {{site_name}}
• Arrival Time: {{visit_time}}
• Badge Type: {{visitor_type}}

On arrival, please proceed to the {{kiosk_location}} kiosk and scan your QR code.

See you soon!
{{company_name}}`,

  approval: `Hi {{host_name}},

{{visitor_name}} ({{visitor_company}}) is requesting approval to visit you on {{visit_date}} at {{visit_time}}.

Purpose: {{visit_purpose}}

Please approve or decline:
✅ Approve: {{approve_link}}
❌ Decline: {{decline_link}}

This request expires in 2 hours.

VMSPro Security`,

  emergency: `🚨 EMERGENCY BROADCAST — {{company_name}}

{{emergency_message}}

All visitors currently on-site must:
1. Stop all activities immediately
2. Proceed to the nearest exit
3. Assemble at: {{assembly_point}}

Emergency Contact: {{emergency_contact}}
Time: {{broadcast_time}}

This is an automated emergency notification.`,
};

const variables: Record<string, string[]> = {
  invite: ['{{visitor_name}}', '{{company_name}}', '{{visit_date}}', '{{visit_time}}', '{{host_name}}', '{{host_department}}', '{{pass_code}}', '{{checkin_link}}', '{{site_address}}', '{{support_email}}'],
  precheckin: ['{{visitor_name}}', '{{visit_date}}', '{{host_name}}', '{{site_name}}', '{{visit_time}}', '{{visitor_type}}', '{{kiosk_location}}', '{{company_name}}'],
  approval: ['{{host_name}}', '{{visitor_name}}', '{{visitor_company}}', '{{visit_date}}', '{{visit_time}}', '{{visit_purpose}}', '{{approve_link}}', '{{decline_link}}'],
  emergency: ['{{company_name}}', '{{emergency_message}}', '{{assembly_point}}', '{{emergency_contact}}', '{{broadcast_time}}'],
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('invite');
  const [templates, setTemplates] = useState(defaultTemplates);
  const [autoSaved, setAutoSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [channel, setChannel] = useState('email');

  const handleChange = (val: string) => {
    setTemplates(prev => ({ ...prev, [activeTab]: val }));
    setAutoSaved(false);
    const timer = setTimeout(() => setAutoSaved(true), 1500);
    return () => clearTimeout(timer);
  };

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const insertVariable = (variable: string) => {
    setTemplates(prev => ({ ...prev, [activeTab]: prev[activeTab] + variable }));
  };

  const previewText = templates[activeTab]
    .replace(/{{visitor_name}}/g, 'Rahul Sharma')
    .replace(/{{company_name}}/g, 'Acme Corporation')
    .replace(/{{visit_date}}/g, '18 Apr 2026')
    .replace(/{{visit_time}}/g, '10:30 AM')
    .replace(/{{host_name}}/g, 'Reeja Pillai')
    .replace(/{{host_department}}/g, 'Engineering')
    .replace(/{{pass_code}}/g, 'VMS-2847')
    .replace(/{{checkin_link}}/g, 'https://checkin.vmspro.app/abc123')
    .replace(/{{site_address}}/g, '14th Floor, BKC, Mumbai')
    .replace(/{{support_email}}/g, 'support@acme.com')
    .replace(/{{site_name}}/g, 'HQ – Mumbai')
    .replace(/{{visitor_type}}/g, 'Contractor')
    .replace(/{{kiosk_location}}/g, 'Main Lobby')
    .replace(/{{visitor_company}}/g, 'TechVendors Pvt Ltd')
    .replace(/{{visit_purpose}}/g, 'Product Demo')
    .replace(/{{approve_link}}/g, 'https://approve.vmspro.app/xyz')
    .replace(/{{decline_link}}/g, 'https://decline.vmspro.app/xyz')
    .replace(/{{emergency_message}}/g, 'Fire alarm triggered on Floor 14.')
    .replace(/{{assembly_point}}/g, 'Parking Lot B')
    .replace(/{{emergency_contact}}/g, '+91 98765 43210')
    .replace(/{{broadcast_time}}/g, '14 Apr 2026, 11:42 AM');

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Bell size={18} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Notification Templates</h1>
              <p className="text-[12px] text-text-muted mt-0.5">Customize messages sent to visitors and hosts at each stage</p>
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
            <button
              onClick={handleSendTest}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-sm"
            >
              {testSent ? <><CheckCircle size={14} /> Sent!</> : <><Send size={14} /> Send Test</>}
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
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor + Variables + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
                <span className="text-[13px] font-semibold text-text-primary">Template Editor</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-text-muted">Channel:</span>
                  <div className="relative">
                    <select
                      value={channel}
                      onChange={e => setChannel(e.target.value)}
                      className="text-[12px] font-medium text-text-secondary border border-border rounded-lg px-2.5 py-1 pr-6 focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="push">Push</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>
              </div>
              <textarea
                value={templates[activeTab]}
                onChange={e => handleChange(e.target.value)}
                className="w-full p-4 text-[13px] text-text-primary font-mono leading-relaxed focus:outline-none resize-none"
                rows={18}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Variables Panel + Preview */}
          <div className="space-y-4">
            {/* Variables */}
            <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface">
                <span className="text-[13px] font-semibold text-text-primary">Available Variables</span>
              </div>
              <div className="p-3 space-y-1.5">
                {variables[activeTab]?.map(v => (
                  <button
                    key={v}
                    onClick={() => insertVariable(v)}
                    className="w-full text-left px-3 py-1.5 text-[12px] font-mono text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-all"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
                <span className="text-[13px] font-semibold text-text-primary">Live Preview</span>
                <button
                  onClick={() => setShowPreview(p => !p)}
                  className="flex items-center gap-1 text-[12px] text-text-muted hover:text-text-secondary"
                >
                  <Eye size={13} /> {showPreview ? 'Hide' : 'Show'}
                </button>
              </div>
              {showPreview && (
                <div className="p-4">
                  <div className="p-3 bg-surface rounded-lg border border-border text-[12px] text-text-secondary whitespace-pre-wrap leading-relaxed font-mono max-h-64 overflow-y-auto">
                    {previewText}
                  </div>
                </div>
              )}
              {!showPreview && (
                <div className="p-4 text-center text-[12px] text-text-muted">
                  Click &quot;Show&quot; to preview with sample data
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
