'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { FileCheck, HelpCircle, Download, CheckCircle, AlertCircle, Search, Trash2, Plus, Shield } from 'lucide-react';

const consentLogs = [
  { id: 1, visitor: 'Rahul Sharma', type: 'Contractor', site: 'HQ – Mumbai', date: '14 Apr 2026', consent: 'Accepted', method: 'Kiosk', ip: '192.168.1.45' },
  { id: 2, visitor: 'Priya Nair', type: 'Guest', site: 'HQ – Mumbai', date: '14 Apr 2026', consent: 'Accepted', method: 'Pre-registration', ip: '103.21.44.12' },
  { id: 3, visitor: 'James Wilson', type: 'VIP', site: 'Bangalore Office', date: '13 Apr 2026', consent: 'Accepted', method: 'Kiosk', ip: '192.168.2.10' },
  { id: 4, visitor: 'Anita Desai', type: 'Vendor', site: 'HQ – Mumbai', date: '13 Apr 2026', consent: 'Declined', method: 'Kiosk', ip: '192.168.1.67' },
  { id: 5, visitor: 'Tom Chen', type: 'Delivery', site: 'Pune Branch', date: '12 Apr 2026', consent: 'Accepted', method: 'Pre-registration', ip: '49.36.22.8' },
];

const retentionPolicies = [
  { id: 1, dataType: 'Visitor Logs', retentionDays: 365, lastPurge: '01 Apr 2026', nextPurge: '01 Apr 2027', status: 'active' },
  { id: 2, dataType: 'Consent Records', retentionDays: 730, lastPurge: '01 Jan 2026', nextPurge: '01 Jan 2027', status: 'active' },
  { id: 3, dataType: 'Photo Captures', retentionDays: 90, lastPurge: '14 Jan 2026', nextPurge: '14 Apr 2026', status: 'due' },
  { id: 4, dataType: 'Induction Records', retentionDays: 365, lastPurge: '01 Mar 2026', nextPurge: '01 Mar 2027', status: 'active' },
  { id: 5, dataType: 'Blacklist Entries', retentionDays: 1825, lastPurge: '—', nextPurge: '01 Apr 2031', status: 'active' },
];

const auditTrail = [
  { id: 1, action: 'Visitor Type Created', user: 'Reeja Pillai', role: 'Global Admin', timestamp: '14 Apr 2026, 11:32 AM', ip: '192.168.1.1', details: 'Created "Intern" visitor type' },
  { id: 2, action: 'Workflow Published', user: 'Reeja Pillai', role: 'Global Admin', timestamp: '14 Apr 2026, 10:15 AM', ip: '192.168.1.1', details: 'Published "Pre-Registered Visitor" workflow v3' },
  { id: 3, action: 'User Invited', user: 'Reeja Pillai', role: 'Global Admin', timestamp: '13 Apr 2026, 04:22 PM', ip: '192.168.1.1', details: 'Invited arjun@acme.com as Site Admin' },
  { id: 4, action: 'Blacklist Entry Added', user: 'Security Team', role: 'Site Admin', timestamp: '13 Apr 2026, 02:10 PM', ip: '192.168.1.45', details: 'Added John Doe to blacklist — Trespassing' },
  { id: 5, action: 'Kiosk Restarted', user: 'System', role: 'Automated', timestamp: '12 Apr 2026, 11:00 PM', ip: '192.168.1.101', details: 'Lobby Kiosk 1 auto-restarted after update' },
  { id: 6, action: 'Retention Policy Updated', user: 'Reeja Pillai', role: 'Global Admin', timestamp: '12 Apr 2026, 09:45 AM', ip: '192.168.1.1', details: 'Photo retention changed from 180 to 90 days' },
];

const tabs = [
  { id: 'consent', label: 'Consent Log' },
  { id: 'purge', label: 'PII Purge Scheduler' },
  { id: 'audit', label: 'Audit Trail' },
  { id: 'certificate', label: 'DPDP Certificate' },
];

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState('consent');
  const [search, setSearch] = useState('');
  const [editingRetention, setEditingRetention] = useState<number | null>(null);
  const [retentionValues, setRetentionValues] = useState<Record<number, number>>(
    Object.fromEntries(retentionPolicies.map(p => [p.id, p.retentionDays]))
  );

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
              <FileCheck size={18} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Compliance & Audit</h1>
              <p className="text-[12px] text-text-muted mt-0.5">Manage consent records, data retention, and audit trails</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
              <HelpCircle size={13} /> Help
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-sm">
              <Download size={14} /> Export Report
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

        {/* Consent Log */}
        {activeTab === 'consent' && (
          <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search consent records..."
                  className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <span className="text-[12px] text-text-muted ml-auto">{consentLogs.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    {['Visitor', 'Type', 'Site', 'Date', 'Consent', 'Method', 'IP Address'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {consentLogs.filter(l => l.visitor.toLowerCase().includes(search.toLowerCase())).map((log, i) => (
                    <tr key={log.id} className={`border-b border-border hover:bg-surface/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                      <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">{log.visitor}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{log.type}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{log.site}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{log.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${log.consent === 'Accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {log.consent === 'Accepted' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                          {log.consent}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{log.method}</td>
                      <td className="px-4 py-3 text-[12px] font-mono text-text-muted">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PII Purge Scheduler */}
        {activeTab === 'purge' && (
          <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold text-text-primary">PII Purge Scheduler</h3>
                <p className="text-[12px] text-text-muted mt-0.5">Configure automatic data purge schedules for each data type</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all">
                <Plus size={13} /> Add Policy
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    {['Data Type', 'Retention (Days)', 'Last Purge', 'Next Purge', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {retentionPolicies.map((policy, i) => (
                    <tr key={policy.id} className={`border-b border-border hover:bg-surface/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                      <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">{policy.dataType}</td>
                      <td className="px-4 py-3">
                        {editingRetention === policy.id ? (
                          <input
                            type="number"
                            value={retentionValues[policy.id]}
                            onChange={e => setRetentionValues(prev => ({ ...prev, [policy.id]: Number(e.target.value) }))}
                            onBlur={() => setEditingRetention(null)}
                            className="w-24 px-2 py-1 text-[13px] border border-primary-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                            autoFocus
                          />
                        ) : (
                          <span
                            onClick={() => setEditingRetention(policy.id)}
                            className="text-[13px] font-medium text-primary-600 cursor-pointer hover:underline"
                          >
                            {retentionValues[policy.id]} days
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{policy.lastPurge}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{policy.nextPurge}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${policy.status === 'due' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                          {policy.status === 'due' ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                          {policy.status === 'due' ? 'Purge Due' : 'On Schedule'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="text-[12px] font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50 transition-all">Run Now</button>
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
        )}

        {/* Audit Trail */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search audit trail..."
                  className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all ml-auto">
                <Download size={13} /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    {['Action', 'User', 'Role', 'Timestamp', 'IP Address', 'Details'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditTrail.filter(a => a.action.toLowerCase().includes(search.toLowerCase()) || a.user.toLowerCase().includes(search.toLowerCase())).map((entry, i) => (
                    <tr key={entry.id} className={`border-b border-border hover:bg-surface/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                      <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">{entry.action}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{entry.user}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface border border-border text-text-secondary">{entry.role}</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-text-muted whitespace-nowrap">{entry.timestamp}</td>
                      <td className="px-4 py-3 text-[12px] font-mono text-text-muted">{entry.ip}</td>
                      <td className="px-4 py-3 text-[12px] text-text-secondary max-w-[200px] truncate">{entry.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DPDP Certificate */}
        {activeTab === 'certificate' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-border p-6 shadow-card">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                  <Shield size={26} className="text-teal-600" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-text-primary">DPDP Compliance Certificate</h2>
                  <p className="text-[12px] text-text-muted mt-0.5">Digital Personal Data Protection Act 2023 — India</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 mt-1.5">
                    <CheckCircle size={10} /> Compliant
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Certificate ID', value: 'DPDP-2026-ACM-0047' },
                  { label: 'Issued To', value: 'Acme Corporation' },
                  { label: 'Issue Date', value: '01 Jan 2026' },
                  { label: 'Valid Until', value: '31 Dec 2026' },
                  { label: 'Compliance Score', value: '97/100' },
                  { label: 'Last Audit', value: '01 Apr 2026' },
                ].map(f => (
                  <div key={f.label} className="p-3 rounded-xl bg-surface border border-border">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">{f.label}</p>
                    <p className="text-[13px] font-semibold text-text-primary">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-all shadow-sm">
                  <Download size={14} /> Download Certificate (PDF)
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
                  <Download size={14} /> Download Audit Report
                </button>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="bg-white rounded-xl border border-border p-5 shadow-card">
              <h3 className="text-[14px] font-semibold text-text-primary mb-4">Compliance Checklist</h3>
              <div className="space-y-2.5">
                {[
                  { item: 'Consent collected at point of data capture', status: true },
                  { item: 'Data retention policies configured', status: true },
                  { item: 'PII purge scheduler active', status: true },
                  { item: 'Audit trail enabled for all admin actions', status: true },
                  { item: 'Data Processing Agreement signed', status: true },
                  { item: 'Breach notification procedure documented', status: false },
                  { item: 'Data Protection Officer (DPO) assigned', status: false },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
                    {c.status
                      ? <CheckCircle size={15} className="text-green-600 shrink-0" />
                      : <AlertCircle size={15} className="text-amber-500 shrink-0" />
                    }
                    <span className={`text-[13px] ${c.status ? 'text-text-primary' : 'text-text-secondary'}`}>{c.item}</span>
                    {!c.status && <span className="ml-auto text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Action Required</span>}
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
