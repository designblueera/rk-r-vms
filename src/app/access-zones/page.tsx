'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Search, Lock, HelpCircle, X, ChevronDown, CheckCircle, XCircle } from 'lucide-react';

interface Zone {
  id: number;
  name: string;
  site: string;
  description: string;
  allowedTypes: string[];
  rules: string;
  status: 'active' | 'inactive';
}

const initialZones: Zone[] = [
  { id: 1, name: 'Main Lobby', site: 'HQ – Mumbai', description: 'Ground floor reception and waiting area', allowedTypes: ['Guest', 'Contractor', 'VIP', 'Vendor'], rules: 'Escort required', status: 'active' },
  { id: 2, name: 'Executive Floor', site: 'HQ – Mumbai', description: '14th floor executive offices', allowedTypes: ['VIP', 'Contractor'], rules: 'Pre-approval + escort', status: 'active' },
  { id: 3, name: 'Data Centre', site: 'HQ – Mumbai', description: 'Server room and IT infrastructure', allowedTypes: ['Contractor'], rules: 'Biometric + escort', status: 'active' },
  { id: 4, name: 'Open Office', site: 'Bangalore Office', description: 'General work area', allowedTypes: ['Guest', 'Contractor', 'Vendor', 'Intern'], rules: 'Badge required', status: 'active' },
  { id: 5, name: 'Conference Zone', site: 'Bangalore Office', description: 'Meeting rooms and conference halls', allowedTypes: ['Guest', 'VIP', 'Contractor'], rules: 'Host approval', status: 'inactive' },
];

const sites = ['HQ – Mumbai', 'Bangalore Office', 'Pune Branch'];
const visitorTypeOptions = ['Guest', 'Contractor', 'VIP', 'Vendor', 'Delivery', 'Intern'];
const ruleOptions = ['Badge required', 'Escort required', 'Pre-approval + escort', 'Biometric + escort', 'Host approval'];

export default function AccessZonesPage() {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [form, setForm] = useState({
    name: '', site: '', description: '', allowedTypes: [] as string[], rules: '',
  });

  const filtered = zones.filter(z =>
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    z.site.toLowerCase().includes(search.toLowerCase())
  );

  const toggleType = (type: string) => {
    setForm(f => ({
      ...f,
      allowedTypes: f.allowedTypes.includes(type)
        ? f.allowedTypes.filter(t => t !== type)
        : [...f.allowedTypes, type],
    }));
  };

  const handleSave = () => {
    if (!form.name || !form.site) return;
    const newZone: Zone = {
      id: zones.length + 1,
      name: form.name,
      site: form.site,
      description: form.description,
      allowedTypes: form.allowedTypes.length ? form.allowedTypes : ['Guest'],
      rules: form.rules || 'Badge required',
      status: 'active',
    };
    setZones(prev => [newZone, ...prev]);
    setShowModal(false);
    setForm({ name: '', site: '', description: '', allowedTypes: [], rules: '' });
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <Lock size={18} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Access Zones</h1>
              <p className="text-[12px] text-text-muted mt-0.5">Define and manage restricted access zones across your sites</p>
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
              <Plus size={15} /> Add New Zone
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Zones', value: zones.length, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Active', value: zones.filter(z => z.status === 'active').length, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Inactive', value: zones.filter(z => z.status === 'inactive').length, color: 'text-gray-500', bg: 'bg-gray-50' },
            { label: 'Sites Covered', value: [...new Set(zones.map(z => z.site))].length, color: 'text-blue-600', bg: 'bg-blue-50' },
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
                placeholder="Search zones..."
                className="w-full pl-9 pr-3 py-1.5 text-[13px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <span className="text-[12px] text-text-muted ml-auto">{filtered.length} zones</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {['Zone Name', 'Site', 'Description', 'Allowed Visitor Types', 'Rules', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((zone, i) => (
                  <tr key={zone.id} className={`border-b border-border hover:bg-surface/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                          <Lock size={12} className="text-purple-600" />
                        </div>
                        <span className="text-[13px] font-semibold text-text-primary">{zone.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary">{zone.site}</td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary max-w-[180px] truncate">{zone.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {zone.allowedTypes.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700">{t}</span>
                        ))}
                        {zone.allowedTypes.length > 3 && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-surface text-text-muted">+{zone.allowedTypes.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-medium px-2 py-0.5 rounded-md bg-surface border border-border text-text-secondary">{zone.rules}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${zone.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {zone.status === 'active' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        {zone.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="text-[12px] font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50 transition-all">Edit</button>
                        <button className="text-[12px] font-medium text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-all">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Zone Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-[16px] font-bold text-text-primary">Add New Zone</h2>
                <p className="text-[12px] text-text-muted mt-0.5">Define a new access zone with rules and permissions</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface transition-all">
                <X size={16} className="text-text-muted" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Zone Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Executive Floor"
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Linked Site *</label>
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
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of this zone..."
                  rows={2}
                  className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-2">Allowed Visitor Types</label>
                <div className="flex flex-wrap gap-2">
                  {visitorTypeOptions.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all ${form.allowedTypes.includes(type) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-text-secondary border-border hover:border-primary-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Access Rules</label>
                <div className="relative">
                  <select
                    value={form.rules}
                    onChange={e => setForm(f => ({ ...f, rules: e.target.value }))}
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none bg-white"
                  >
                    <option value="">Select rule</option>
                    {ruleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 p-5 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-surface transition-all">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.site}
                className="px-5 py-2 text-[13px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Add Zone
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
