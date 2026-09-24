import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TahunAnggaran } from '../types';
import {
  FileSpreadsheet,
  UploadCloud,
  DownloadCloud,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface NavbarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sidebarOpen: propSidebarOpen,
  setSidebarOpen: propSetSidebarOpen,
}) => {
  const {
    sidebarOpen: ctxSidebarOpen,
    setSidebarOpen: ctxSetSidebarOpen,
    selectedYear,
    setSelectedYear,
    user,
    isAdmin,
    isLoggedIn,
    setIsLoginModalOpen,
    logout,
    syncWebToSpreadsheet,
    syncSpreadsheetToWeb,
    isSyncing,
    syncStatusMessage,
    gasConfig,
  } = useApp();

  const sidebarOpen = propSidebarOpen !== undefined ? propSidebarOpen : ctxSidebarOpen;
  const setSidebarOpen = propSetSidebarOpen || ctxSetSidebarOpen;

  const years: TahunAnggaran[] = ['2026', '2027', '2028', '2029', '2030'];
  const [showSyncModal, setShowSyncModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-950 border-b-2 border-slate-900 text-white shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-slate-800"
              title="Toggle Menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md border border-amber-400/30 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-black tracking-tight text-white uppercase leading-tight font-heading">
                  REGISTER SPM <span className="text-amber-400">&</span> REKAPITULASI BELANJA
                </h1>
                <p className="text-[11px] text-amber-400/90 font-bold uppercase tracking-wider">
                  Sistem Kontrol Belanja & Kontrak APBD
                </p>
              </div>
            </div>
          </div>

          {/* Right: Year Selector, Sync Buttons & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Year Selector */}
            <div className="flex items-center gap-2 bg-slate-900 border-2 border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
              <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest hidden md:inline">
                TAHUN:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as TahunAnggaran)}
                className="bg-transparent text-xs sm:text-sm font-extrabold text-amber-400 focus:outline-none cursor-pointer tracking-wider"
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-slate-950 text-amber-400 font-bold">
                    TA {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Sync Spreadsheet Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => syncWebToSpreadsheet()}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer border border-emerald-400/50"
                title="Update data dari web ke Google Spreadsheet"
              >
                {isSyncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5" />
                )}
                <span>Update ke Spreadsheet</span>
              </button>

              <button
                onClick={() => syncSpreadsheetToWeb()}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer border border-amber-400/50"
                title="Update data dari Google Spreadsheet ke Web"
              >
                {isSyncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <DownloadCloud className="w-3.5 h-3.5" />
                )}
                <span>Update dari Spreadsheet</span>
              </button>
            </div>

            {/* Mobile Sync Icon Button */}
            <button
              onClick={() => setShowSyncModal(true)}
              className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Menu Sync Spreadsheet"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
            </button>

            {/* User & Logout / Login */}
            <div className="pl-2 border-l border-slate-800 flex items-center gap-2.5">
              {isLoggedIn ? (
                <>
                  <div className="hidden lg:flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{user.namaLengkap}</span>
                      {isAdmin ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 border border-amber-300 shadow-xs">
                          ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-400 text-slate-950 border border-sky-300 shadow-xs">
                          USER (READ ONLY)
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">{user.jabatan}</div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/30 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Keluar / Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Login / Pilih Role</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatusMessage && (
          <div
            className={`px-4 py-1.5 text-xs font-medium flex items-center justify-between border-t border-b ${
              syncStatusMessage.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
                : syncStatusMessage.type === 'error'
                ? 'bg-rose-950/80 text-rose-300 border-rose-800/50'
                : 'bg-sky-950/80 text-sky-300 border-sky-800/50'
            }`}
          >
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              {syncStatusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : syncStatusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <Loader2 className="w-4 h-4 shrink-0 animate-spin text-sky-400" />
              )}
              <span>{syncStatusMessage.text}</span>
            </div>
            {gasConfig.lastSyncedAt && (
              <span className="text-[10px] opacity-75 hidden sm:inline">
                Terakhir: {gasConfig.lastSyncedAt}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Mobile Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100">Singkronisasi Google Spreadsheet</h3>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Pilih tindakan sinkronisasi dengan Google Spreadsheet:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  syncWebToSpreadsheet();
                  setShowSyncModal(false);
                }}
                disabled={isSyncing}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Update Data dari Web Ke Spreadsheet</span>
              </button>

              <button
                onClick={() => {
                  syncSpreadsheetToWeb();
                  setShowSyncModal(false);
                }}
                disabled={isSyncing}
                className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Update Data dari Spreadsheet Ke Web</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
