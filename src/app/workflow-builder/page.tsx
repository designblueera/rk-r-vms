'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { GitBranch, Plus, Clock, CheckCircle, Briefcase, HardHat, UserCheck, Star, Truck, Shield, Users, Pencil, Eye, MoreVertical, Zap, FileText, ArrowRight, UserCheck2,  } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Workflow {
  id: number;
  name: string;
  visitorType: string;
  status: 'active' | 'draft';
  steps: number;
  lastUpdated: string;
  fields: number;
  description: string;
}

// ─── Shared Data ──────────────────────────────────────────────────────────────

const visitorTypeIcons: Record<string, React.ReactNode> = {
  'Vendor': <Briefcase size={18} />,
  'Contractor': <HardHat size={18} />,
  'Interviewee': <UserCheck size={18} />,
  'VIP / Executive': <Star size={18} />,
  'Delivery / Courier': <Truck size={18} />,
  'Govt Official': <Shield size={18} />,
  'General Visitor': <Users size={18} />,
};

const visitorTypeColors: Record<string, string> = {
  'Vendor': 'bg-blue-100 text-blue-600',
  'Contractor': 'bg-amber-100 text-amber-600',
  'Interviewee': 'bg-green-100 text-green-600',
  'VIP / Executive': 'bg-purple-100 text-purple-600',
  'Delivery / Courier': 'bg-orange-100 text-orange-600',
  'Govt Official': 'bg-red-100 text-red-600',
  'General Visitor': 'bg-slate-100 text-slate-600',
};

const preRegisteredWorkflows: Workflow[] = [
  {
    id: 1,
    name: 'Vendor Onboarding Flow',
    visitorType: 'Vendor',
    status: 'active',
    steps: 3,
    fields: 7,
    lastUpdated: '2 days ago',
    description: 'NDA sign-off, ID verification, host approval and badge issuance.',
  },
  {
    id: 2,
    name: 'Contractor Access Flow',
    visitorType: 'Contractor',
    status: 'active',
    steps: 3,
    fields: 10,
    lastUpdated: '5 days ago',
    description: 'Safety induction, compliance check, site access and escort assignment.',
  },
  {
    id: 3,
    name: 'VIP Executive Express Flow',
    visitorType: 'VIP / Executive',
    status: 'draft',
    steps: 2,
    fields: 6,
    lastUpdated: '1 week ago',
    description: 'Express check-in with auto-escort and host notification.',
  },
  {
    id: 4,
    name: 'Interviewee Check-in Flow',
    visitorType: 'Interviewee',
    status: 'active',
    steps: 3,
    fields: 9,
    lastUpdated: '3 days ago',
    description: 'Candidate registration, pre-screening and arrival check-in.',
  },
];

const walkInWorkflows: Workflow[] = [
  {
    id: 1,
    name: 'General Walk-In Flow',
    visitorType: 'General Visitor',
    status: 'active',
    steps: 3,
    fields: 5,
    lastUpdated: '1 day ago',
    description: 'Quick ID capture, host notification and temporary badge issuance.',
  },
  {
    id: 2,
    name: 'Delivery Check-In Flow',
    visitorType: 'Delivery / Courier',
    status: 'active',
    steps: 2,
    fields: 4,
    lastUpdated: '3 days ago',
    description: 'Package logging, recipient confirmation and dock access assignment.',
  },
  {
    id: 3,
    name: 'Unplanned Contractor Entry',
    visitorType: 'Contractor',
    status: 'draft',
    steps: 4,
    fields: 8,
    lastUpdated: '5 days ago',
    description: 'Safety briefing, permit verification and site supervisor approval.',
  },
];

// ─── Workflow Card ─────────────────────────────────────────────────────────────

function WorkflowCard({ w, editHref, previewHref }: { w: Workflow; editHref: string; previewHref: string }) {
  const [openMenu, setOpenMenu] = useState(false);
  const iconBg = visitorTypeColors[w.visitorType] ?? 'bg-slate-100 text-slate-600';
  const icon = visitorTypeIcons[w.visitorType] ?? <GitBranch size={18} />;

  return (
    <div className="bg-white rounded-xl border border-border shadow-card hover:shadow-md transition-shadow flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
              {icon}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-primary leading-tight">{w.name}</p>
              <p className="text-[11px] text-text-muted mt-0.5">{w.visitorType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
              w.status === 'active' ?'bg-green-50 text-green-700 border border-green-100' :'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              {w.status === 'active' ? '● Active' : '○ Draft'}
            </span>
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="p-1 rounded-lg hover:bg-surface transition-colors text-text-muted"
              >
                <MoreVertical size={14} />
              </button>
              {openMenu && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-border rounded-lg shadow-dropdown z-20 py-1">
                  {w.status === 'draft' ? (
                    <button
                      onClick={() => setOpenMenu(false)}
                      className="w-full text-left px-3 py-2 text-[12px] text-green-700 hover:bg-green-50 flex items-center gap-2"
                    >
                      <Zap size={12} /> Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => setOpenMenu(false)}
                      className="w-full text-left px-3 py-2 text-[12px] text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                    >
                      <FileText size={12} /> Set as Draft
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-text-secondary leading-relaxed mb-3">{w.description}</p>

        <div className="flex items-center gap-4 text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <CheckCircle size={11} className="text-primary-400" />
            {w.steps} steps
          </span>
          <span className="flex items-center gap-1">
            <FileText size={11} className="text-primary-400" />
            {w.fields} fields
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {w.lastUpdated}
          </span>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-surface/50 rounded-b-xl">
        <Link
          href={editHref}
          className="flex items-center gap-1 text-[12px] font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          <Pencil size={12} />
          Edit Workflow
        </Link>
        <Link
          href={previewHref}
          className="flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <Eye size={12} />
          Preview
        </Link>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function WorkflowSection({
  title,
  subtitle,
  icon,
  accentColor,
  workflows,
  createHref,
  viewAllHref,
  editBasePath,
  previewBasePath,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  workflows: Workflow[];
  createHref: string;
  viewAllHref: string;
  editBasePath: string;
  previewBasePath: string;
}) {
  const activeCount = workflows.filter(w => w.status === 'active').length;
  const draftCount = workflows.filter(w => w.status === 'draft').length;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentColor}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-text-primary">{title}</h2>
            <p className="text-[11px] text-text-muted mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={viewAllHref}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300 rounded-lg transition-all"
          >
            View All
            <ArrowRight size={12} />
          </Link>
          <Link
            href={createHref}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-sm"
          >
            <Plus size={13} />
            Create New
          </Link>
        </div>
      </div>

      {/* Summary Pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          <span className="text-[12px] font-medium text-green-700">{activeCount} Active</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          <span className="text-[12px] font-medium text-amber-700">{draftCount} Draft</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {workflows.map(w => (
          <WorkflowCard
            key={w.id}
            w={w}
            editHref={`${editBasePath}?visitorType=${encodeURIComponent(w.visitorType)}&workflowId=${w.id}`}
            previewHref={`${previewBasePath}?visitorType=${encodeURIComponent(w.visitorType)}&workflowId=${w.id}&mode=view`}
          />
        ))}

        {/* Add new tile */}
        <Link
          href={createHref}
          className="bg-white rounded-xl border-2 border-dashed border-border hover:border-primary-300 hover:bg-primary-50/30 transition-all flex flex-col items-center justify-center gap-3 p-8 min-h-[180px] group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
            <Plus size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-text-secondary group-hover:text-primary-600 transition-colors text-center">
              Create New Workflow
            </p>
            <p className="text-[11px] text-text-muted text-center mt-0.5">
              Select a visitor type to begin
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkflowBuilderPage() {
  return (
    <AppLayout>
      <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-8">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Workflow Builder</h1>
            <p className="text-[12px] text-text-muted mt-0.5">
              Configure check-in workflows for pre-registered visitors and walk-ins
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-border" />

        {/* ── Pre-registered Section ── */}
        <WorkflowSection
          title="Pre-registered"
          subtitle="Workflows for invited and scheduled visitors"
          icon={<UserCheck2 size={18} className="text-primary-600" />}
          accentColor="bg-primary-50"
          workflows={preRegisteredWorkflows}
          createHref="/workflows"
          viewAllHref="/workflows"
          editBasePath="/workflows/builder"
          previewBasePath="/workflows/builder"
        />

        {/* ── Divider ── */}
        <div className="border-t border-border" />

        {/* ── Walk-Ins Section ── */}
        <WorkflowSection
          title="Walk-Ins"
          subtitle="Workflows for unscheduled and on-the-spot visitors"
          icon={<Users size={18} className="text-amber-600" />}
          accentColor="bg-amber-50"
          workflows={walkInWorkflows}
          createHref="/workflows/walk-in"
          viewAllHref="/workflows/walk-in"
          editBasePath="/workflows/walk-in/builder"
          previewBasePath="/workflows/walk-in/builder"
        />

      </div>
    </AppLayout>
  );
}
