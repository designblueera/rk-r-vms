'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { useRole } from '@/context/RoleContext';
import { LayoutDashboard, List, Users, GitBranch, Shield, Palette, Building2, DoorOpen, Lock, Tablet, Ban, UserCog, Plug, Bell, BarChart2, FileCheck, Settings, ChevronLeft, ChevronRight, LogOut, ChevronDown, HelpCircle,  } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { id: 'nav-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} />, href: '/dashboard' },
      { id: 'nav-visitor-log', label: 'Visitor Logs', icon: <List size={17} />, href: '/visitor-log', badge: 3 },
    ],
  },
  {
    id: 'visitor-config',
    label: 'Visitor Configuration',
    items: [
      { id: 'nav-visitor-types', label: 'Visitor Types', icon: <Users size={17} />, href: '/visitor-types' },
      { id: 'nav-workflow-builder', label: 'Workflow Builder', icon: <GitBranch size={17} />, href: '/workflow-builder' },
      { id: 'nav-induction', label: 'Induction Hub', icon: <Shield size={17} />, href: '/induction' },
      { id: 'nav-branding', label: 'Branding & Appearance', icon: <Palette size={17} />, href: '/branding' },
    ],
  },
  {
    id: 'security-access',
    label: 'Security & Access',
    items: [
      { id: 'nav-locations', label: 'Sites & Locations', icon: <Building2 size={17} />, href: '/locations-sites' },
      { id: 'nav-gates', label: 'Gates & Entry Points', icon: <DoorOpen size={17} />, href: '/gates' },
      { id: 'nav-access-zones', label: 'Access Zones', icon: <Lock size={17} />, href: '/access-zones' },
      { id: 'nav-kiosks', label: 'Kiosks & Hardware', icon: <Tablet size={17} />, href: '/kiosks' },
      { id: 'nav-blacklist', label: 'Blacklist & Watchlists', icon: <Ban size={17} />, href: '/blacklist', badge: 2 },
    ],
  },
  {
    id: 'users-integrations',
    label: 'Users & Integrations',
    items: [
      { id: 'nav-users', label: 'Users & Permissions', icon: <UserCog size={17} />, href: '/users-permissions' },
      { id: 'nav-integrations', label: 'Integrations', icon: <Plug size={17} />, href: '/integrations' },
      { id: 'nav-notifications', label: 'Notifications', icon: <Bell size={17} />, href: '/notifications' },
    ],
  },
  {
    id: 'analytics-compliance',
    label: 'Analytics & Compliance',
    items: [
      { id: 'nav-reports', label: 'Reports & Analytics', icon: <BarChart2 size={17} />, href: '/reports' },
      { id: 'nav-compliance', label: 'Compliance & Audit', icon: <FileCheck size={17} />, href: '/compliance' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [
      { id: 'nav-settings', label: 'Settings', icon: <Settings size={17} />, href: '/settings' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedRole, setSelectedRole } = useRole();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleOptions: Array<'Global' | 'Site A' | 'Site B'> = ['Global', 'Site A', 'Site B'];

  const handleRoleChange = (role: 'Global' | 'Site A' | 'Site B') => {
    setSelectedRole(role);
    setRoleDropdownOpen(false);
    if (role === 'Site A' || role === 'Site B') {
      router.push('/site-admin/dashboard');
    }
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className="relative flex flex-col h-full transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? '64px' : '240px',
        background: 'linear-gradient(180deg, #405189 0%, #4a5fa0 50%, #3a4a7e 100%)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-14 border-b px-3 shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <AppLogo size={32} className="shrink-0" />
          {!collapsed && (
            <span className="font-bold text-white text-[15px] tracking-tight truncate">
              VMSPro
            </span>
          )}
        </div>
      </div>

      {/* Role Selector */}
      {!collapsed && (
        <div className="px-3 py-2.5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(prev => !prev)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-white text-[12px] font-medium transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <span className="truncate">{selectedRole}</span>
              <ChevronDown
                size={13}
                className="shrink-0 text-white/60 transition-transform duration-150"
                style={{ transform: roleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {roleDropdownOpen && (
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-lg overflow-hidden z-50"
                style={{
                  background: '#3a4a7e',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                {roleOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleRoleChange(option)}
                    className="w-full text-left px-3 py-2 text-[12px] font-medium transition-all duration-100"
                    style={{
                      color: selectedRole === option ? '#fff' : 'rgba(255,255,255,0.65)',
                      background: selectedRole === option ? 'rgba(255,255,255,0.12)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (selectedRole !== option) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
                    onMouseLeave={e => { if (selectedRole !== option) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.id} className="mb-1">
            {!collapsed && (
              <p
                className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {group.label}
              </p>
            )}
            {collapsed && (
              <div className="my-1.5 mx-2 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            )}

            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.id} href={item.href}>
                  <div
                    className={`
                      relative flex items-center gap-3 mx-2 my-0.5 rounded-lg cursor-pointer
                      transition-all duration-150
                      ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2'}
                      ${active
                        ? 'bg-white/[0.13] text-white'
                        : 'hover:bg-white/[0.07] text-white/70 hover:text-white'
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-blue-300" />
                    )}
                    <span className={`shrink-0 ${active ? 'text-blue-300' : ''}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="text-[13px] font-medium truncate flex-1">
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        {/* Help Center */}
        <Link href="#">
          <div
            className={`flex items-center gap-3 mx-2 my-1 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/[0.07] transition-all duration-150 ${collapsed ? 'justify-center px-0' : ''}`}
            style={{ color: 'rgba(255,255,255,0.55)' }}
            title={collapsed ? 'Help Center' : undefined}
          >
            <HelpCircle size={16} className="shrink-0" />
            {!collapsed && <span className="text-[13px] font-medium">Help Center</span>}
          </div>
        </Link>

        {/* User profile / Logout */}
        <div
          className={`flex items-center gap-2.5 mx-2 mb-2 p-2 rounded-lg hover:bg-white/[0.07] cursor-pointer transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
            RP
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-semibold truncate">Reeja Pillai</p>
              <p className="text-white/45 text-[11px] truncate">Global Overview</p>
            </div>
          )}
          {!collapsed && <LogOut size={14} className="text-white/35 shrink-0" />}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center shadow-card hover:bg-primary-50 hover:border-primary-200 transition-all duration-150 z-10"
      >
        {collapsed
          ? <ChevronRight size={12} className="text-text-secondary" />
          : <ChevronLeft size={12} className="text-text-secondary" />
        }
      </button>
    </aside>
  );
}