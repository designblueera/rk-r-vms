'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Search, DoorOpen, HelpCircle, X, ChevronDown, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Gate {
  id: number;
  name: string;
  site: string;
  type: string;
  assignedKiosk: string;
  assignedWorkflow: string;
  status: 'active' | 'inactive' | 'maintenance';
}

const initialGates: Gate[] = [
  { id: 1, name: 'Main Entrance Gate', site: 'HQ – Mumbai', type: 'Turnstile', assignedKiosk: 'Lobby Kiosk 1', assignedWorkflow: 'Pre-Registered Visitor', status: 'active' },
  { id: 2, name: 'Delivery Bay Gate', site: 'HQ – Mumbai', type: 'Barrier', assignedKiosk: 'Gate B Kiosk', assignedWorkflow: 'Delivery & Vendor', status: 'active' },
  { id: 3, name: 'Staff Side Entry', site: 'Bangalore Office', type: 'Access Door', assignedKiosk: 'Reception Kiosk', assignedWorkflow: 'Walk-In Visitor', status: 'maintenance' },
  { id: 4, name: 'VIP Entrance', site: 'HQ – Mumbai', type: 'Turnstile', assignedKiosk: 'Lobby Kiosk 1', assignedWorkflow: 'VIP Guest', status: 'active' },
  { id: 5, name: 'Emergency Exit Gate', site: 'Bangalore Office', type: 'Emergency Door', assignedKiosk: '—', assignedWorkflow: '—', status: 'inactive' },
];

const sites = ['HQ – Mumbai', 'Bangalore Office', 'Pune Branch'];
const gateTypes = ['Turnstile', 'Barrier', 'Access Door', 'Emergency Door', 'Sliding Gate'];
const kiosks = ['Lobby Kiosk 1', 'Gate B Kiosk', 'Reception Kiosk', '—'];
const workflows = ['Pre-Registered Visitor', 'Walk-In Visitor', 'Delivery & Vendor', 'VIP Guest', '—'];

const statusConfig = {
  active: { label: 'Active', icon: <CheckCircle size={11} />, cls: 'bg-green-50 text-green-700' },
  inactive: { label: 'Inactive', icon: <XCircle size={11} />, cls: 'bg-gray-100 text-gray-500' },
  maintenance: { label: 'Maintenance', icon: <AlertCircle size={11} />, cls: 'bg-amber-50 text-amber-700' },
};

export default function GatesPage() {
  const [gates, setGates] = useState<Gate[]>(initialGates);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [form, setForm] = useState({
    name: '', site: '', type: '', kiosk: '', workflow: '',
    requireApproval: false, capturePhoto: true, printBadge: true,
  });

  const filtered = gates.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.site.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name || !form.site || !form.type) return;
    const newGate: Gate = {
      id: gates.length + 1,
      name: form.name,
      site: form.site,
      type: form.type,
      assignedKiosk: form.kiosk || '—',
      assignedWorkflow: form.workflow || '—',
      status: 'active',
    };
    setGates(prev => [newGate, ...prev]);
    setShowModal(false);
    setForm({ name: '', site: '', type: '', kiosk: '', workflow: '', requireApproval: false, capturePhoto: true, printBadge: true });
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
              <DoorOpen size={18} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Gates & Entry Points</h1>
              <p className="text-[12px] text-text-muted mt-0.5">Manage physical entry gates and their assigned kiosks & workflows</p>
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
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-sm"
            >
              <Plus size={15} /> Add New Gate
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Gates', value: gates.length, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'Active', value: gates.filter(g => g.status === 'active').length, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Maintenance', value: gates.filter(g => g.status === 'maintenance').length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Inactive', value: gates.filter(g => g.status === 'inactive').length, color: 'text-gray-500', bg: 'bg-gray-50' },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-xl border border-border p-4 shadow-card">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search gates..."
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <span className="text-[12px] text-text-muted ml-auto">{filtered.length} gates</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {['Gate Name', 'Site', 'Type', 'Assigned Kiosk', 'Assigned Workflow', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((gate, i) => {
                  const sc = statusConfig[gate.status];
                  return (
                    <tr key={gate.id} className={`border-b border-border hover:bg-surface/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                            <DoorOpen size={13} className="text-primary-600" />
                          </div>
                          <span className="text-[13px] font-semibold text-text-primary">{gate.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{gate.site}</td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-medium px-2 py-0.5 rounded-md bg-surface border border-border text-text-secondary">{gate.type}</span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{gate.assignedKiosk}</td>
                      <td className="px-4 py-3 text-[13px] text-text-secondary">{gate.assignedWorkflow}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.cls}`}>
                          {sc.icon} {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="text-[12px] font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50 transition-all">Edit</button>
                          <button className="text-[12px] font-medium text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-all">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Gate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-[16px] font-bold text-text-primary">Add New Gate</h2>
                <p className="text-[12px] text-text-muted mt-0.5">Configure a new entry gate or access point</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-all">
                <X size={16} className="text-text-muted" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Gate Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Main Entrance Gate"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Site *</label>
                  <div className="relative">
                    <select
                      value={form.site}
                      onChange={e => setForm(f => ({ ...f, site: e.target.value }))}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white"
                    >
                      <option value="">Select site</option>
                      {sites.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Gate Type *</label>
                  <div className="relative">
                    <select
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white"
                    >
                      <option value="">Select type</option>
                      {gateTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Assigned Kiosk</label>
                  <div className="relative">
                    <select
                      value={form.kiosk}
                      onChange={e => setForm(f => ({ ...f, kiosk: e.target.value }))}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white"
                    >
                      <option value="">None</option>
                      {kiosks.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Assigned Workflow</label>
                  <div className="relative">
                    <select
                      value={form.workflow}
                      onChange={e => setForm(f => ({ ...f, workflow: e.target.value }))}
                      className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white"
                    >
                      <option value="">None</option>
                      {workflows.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>
              </div>
              {/* Rules Toggles */}
              <div>
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-2">Gate Rules</label>
                <div className="space-y-2.5">
                  {[
                    { key: 'requireApproval', label: 'Require Host Approval', desc: 'Visitor must be approved by host before entry' },
                    { key: 'capturePhoto', label: 'Capture Photo on Entry', desc: 'Take visitor photo at this gate' },
                    { key: 'printBadge', label: 'Print Badge on Entry', desc: 'Auto-print visitor badge upon check-in' },
                  ].map(rule => (
                    <div key={rule.key} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                      <div>
                        <p className="text-[13px] font-medium text-text-primary">{rule.label}</p>
                        <p className="text-[11px] text-text-muted">{rule.desc}</p>
                      </div>
                      <button
                        onClick={() => setForm(f => ({ ...f, [rule.key]: !f[rule.key as keyof typeof f] }))}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${(form as Record<string, unknown>)[rule.key] ? 'bg-primary-600' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${(form as Record<string, unknown>)[rule.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 p-5 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.site || !form.type}
                className="px-5 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Add Gate
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
