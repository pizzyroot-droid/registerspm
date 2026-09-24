import React from 'react';
import { RegisterSpm } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { X, FileText, CheckCircle2, Building, Layers, Receipt } from 'lucide-react';

interface SpmDetailModalProps {
  spm: RegisterSpm;
  onClose: () => void;
}

export const SpmDetailModal: React.FC<SpmDetailModalProps> = ({ spm, onClose }) => {
  const { bidangList, kontrakList, rekeningList, subKegiatanList } = useApp();

  const bidang = bidangList.find((b) => b.id === spm.bidangId);
  const kontrak = spm.kontrakId ? kontrakList.find((k) => k.id === spm.kontrakId) : null;

  const totalPajak =
    (spm.pajak?.ppn || 0) +
    (spm.pajak?.pph21 || 0) +
    (spm.pajak?.pph22 || 0) +
    (spm.pajak?.pph23 || 0) +
    (spm.pajak?.pphPasal4 || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{spm.nomorSpm}</h3>
              <p className="text-xs text-sky-400">Detail Informasi Register SPM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto grow text-xs">
          {/* Top Key Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">TGL SPM</span>
              <div className="font-bold text-slate-900 text-sm">{formatDateIndo(spm.tanggalSpm)}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">JENIS BELANJA</span>
              <div className="font-bold text-sky-800 text-sm">{spm.jenisBelanja}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">REALISASI SPM</span>
              <div className="font-bold text-emerald-700 text-sm">{formatRupiah(spm.realisasiSpm)}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase">PROGRESS FISIK</span>
              <div className="font-bold text-indigo-700 text-sm">{spm.persentaseFisik}%</div>
            </div>
          </div>

          {/* Bidang & Kontrak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-sky-600" />
                Bidang Kerja
              </div>
              <div className="text-xs text-slate-700 font-semibold">
                [{bidang?.kode || '-'}] {bidang?.nama || 'Bidang tidak ditemukan'}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Kontrak Pekerjaan Terkait
              </div>
              {kontrak ? (
                <div>
                  <div className="font-bold text-slate-900">{kontrak.uraian}</div>
                  <div className="text-[11px] text-slate-500">
                    {kontrak.namaPenyedia} | No: {kontrak.nomorKontrak}
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 mt-0.5">
                    Nilai Kontrak: {formatRupiah(kontrak.nilaiKontrak)}
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 italic">Non-Kontraktual (UP / GU / Gaji)</div>
              )}
            </div>
          </div>

          {/* Uraian Pekerjaan */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Uraian Pekerjaan</span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">{spm.uraianPekerjaan}</p>
          </div>

          {/* Rincian Belanja Table */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-sky-600" />
              Rincian Objek Belanja ({spm.rincianBelanja.length} Sub-Objek)
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white font-bold text-[11px]">
                  <tr>
                    <th className="p-2.5">No</th>
                    <th className="p-2.5">Sub Kegiatan & Rekening</th>
                    <th className="p-2.5 text-right">Nilai Realisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {spm.rincianBelanja.map((rc, idx) => {
                    const rek = rekeningList.find((r) => r.id === rc.rekeningId);
                    const sub = subKegiatanList.find((s) => s.id === rc.subKegiatanId);
                    return (
                      <tr key={rc.id || idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5">
                          <div className="font-semibold text-slate-800">
                            [{rek?.kode}] {rek?.nama}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Sub: [{sub?.kode}] {sub?.nama}
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-bold text-sky-800">
                          {formatRupiah(rc.nilaiRealisasi)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2">
            <div className="font-bold text-indigo-950 text-xs uppercase tracking-wider">
              Pemotongan Pajak SPM
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-indigo-100">
                <div className="text-[10px] text-slate-500 font-bold">PPN (11%)</div>
                <div className="font-bold text-indigo-900">{formatRupiah(spm.pajak?.ppn)}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-indigo-100">
                <div className="text-[10px] text-slate-500 font-bold">PPh 21</div>
                <div className="font-bold text-indigo-900">{formatRupiah(spm.pajak?.pph21)}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-indigo-100">
                <div className="text-[10px] text-slate-500 font-bold">PPh 22</div>
                <div className="font-bold text-indigo-900">{formatRupiah(spm.pajak?.pph22)}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-indigo-100">
                <div className="text-[10px] text-slate-500 font-bold">PPh 23</div>
                <div className="font-bold text-indigo-900">{formatRupiah(spm.pajak?.pph23)}</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-indigo-100">
                <div className="text-[10px] text-slate-500 font-bold">PPh Pas 4</div>
                <div className="font-bold text-indigo-900">{formatRupiah(spm.pajak?.pphPasal4)}</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-indigo-200/80 font-bold text-indigo-950">
              <span>Total Seluruh Potongan Pajak:</span>
              <span className="text-sm font-extrabold">{formatRupiah(totalPajak)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
