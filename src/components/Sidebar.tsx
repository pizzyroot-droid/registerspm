import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FileCheck2,
  Briefcase,
  FileSearch,
  Layers,
  Receipt,
  FileSpreadsheet,
  Database,
  ChevronRight,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'spm'
  | 'pekerjaan'
  | 'kontrol_kontrak_spm'
  | 'rekap_bidang'
  | 'rekap_rekening'
  | 'rekap_pajak'
  | 'master';

interface SidebarProps {
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  sidebarOpen: propSidebarOpen,
  setSidebarOpen: propSetSidebarOpen,
}) => {
  const {
    currentView,
    setCurrentView,
    sidebarOpen: ctxSidebarOpen,
    setSidebarOpen: ctxSetSidebarOpen,
  } = useApp();

  const activeTab = propActiveTab || (currentView as ActiveTab) || 'dashboard';
  const setActiveTab = propSetActiveTab || ((tab: ActiveTab) => setCurrentView(tab));
  const sidebarOpen = propSidebarOpen !== undefined ? propSidebarOpen : ctxSidebarOpen;
  const setSidebarOpen = propSetSidebarOpen || ctxSetSidebarOpen;
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Ringkasan & Statistik Belanja',
    },
    {
      id: 'spm' as ActiveTab,
      label: 'Register SPM',
      icon: FileCheck2,
      description: 'Input & Register SPM Baru',
    },
    {
      id: 'pekerjaan' as ActiveTab,
      label: 'Pekerjaan Belum Selesai',
      icon: Briefcase,
      description: 'Kontrol Kontrak & Deadline',
    },
    {
      id: 'kontrol_kontrak_spm' as ActiveTab,
      label: 'Kontrol Kontrak & SPM',
      icon: FileSearch,
      description: 'Pencarian Kontrak & Detail SPM',
    },
    {
      id: 'rekap_bidang' as ActiveTab,
      label: 'Rekap per Bidang',
      icon: Layers,
      description: 'Laporan Hirarki Belanja',
    },
    {
      id: 'rekap_rekening' as ActiveTab,
      label: 'Rekap Rekening Belanja',
      icon: Receipt,
      description: 'Rincian Objek Belanja',
    },
    {
      id: 'rekap_pajak' as ActiveTab,
      label: 'Rekap Laporan Pajak',
      icon: FileSpreadsheet,
      description: 'PPN, PPh 21, 22, 23 & Pas 4',
    },
    {
      id: 'master' as ActiveTab,
      label: 'Master Data',
      icon: Database,
      description: 'Bidang, Sub, Pagu & User',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-[65px] bottom-0 left-0 z-40 w-72 bg-slate-950 border-r-2 border-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-black text-amber-400 uppercase tracking-widest font-heading">
              NAVIGASI UTAMA
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group cursor-pointer border ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md shadow-amber-950/40'
                      : 'bg-slate-900/60 hover:bg-slate-900 hover:text-white text-slate-300 border-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? 'text-slate-950 font-bold' : 'text-slate-400 group-hover:text-amber-400'
                      }`}
                    />
                    <div>
                      <div className={`text-xs uppercase tracking-wide leading-tight ${isActive ? 'font-black text-slate-950' : 'font-bold text-slate-200'}`}>
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] leading-tight ${
                          isActive ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-400'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive
                        ? 'text-slate-950 font-bold opacity-100 translate-x-0.5'
                        : 'text-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Footer Info Box */}
          <div className="mt-6 p-4 bg-slate-900 border-2 border-slate-800 rounded-2xl text-xs space-y-1.5 shadow-inner">
            <div className="font-black text-amber-400 uppercase tracking-wider text-[11px] font-heading">
              Status Sistem
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Versi: <span className="text-slate-200 font-bold">1.0.0 Stable</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Database: <span className="text-emerald-400 font-bold">Google Spreadsheet API</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
