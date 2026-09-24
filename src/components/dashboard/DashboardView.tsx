import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';
import {
  FileCheck2,
  Briefcase,
  AlertTriangle,
  Wallet,
  Receipt,
  PieChart,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    selectedYear,
    setSelectedYear,
    bidangList,
    programList,
    kegiatanList,
    subKegiatanList,
    rekeningList,
    kontrakList,
    spmList,
  } = useApp();

  const [expandedBidang, setExpandedBidang] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedBidang((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter entities by selectedYear
  const yearSpm = useMemo(
    () => spmList.filter((s) => s.tahun === selectedYear),
    [spmList, selectedYear]
  );

  const yearKontrak = useMemo(
    () => kontrakList.filter((k) => k.tahun === selectedYear),
    [kontrakList, selectedYear]
  );

  const yearRekening = useMemo(
    () => rekeningList.filter((r) => r.tahun === selectedYear),
    [rekeningList, selectedYear]
  );

  // Summary Calculations
  const totalSpmCount = yearSpm.length;
  const totalPekerjaanCount = yearKontrak.length;

  const pekerjaanBelumSelesaiCount = useMemo(() => {
    return yearKontrak.filter((k) => k.persentaseFisik < 100).length;
  }, [yearKontrak]);

  const totalPagu = useMemo(() => {
    return yearRekening.reduce((acc, r) => acc + (r.pagu || 0), 0);
  }, [yearRekening]);

  const totalRealisasi = useMemo(() => {
    return yearSpm.reduce((acc, s) => acc + (s.realisasiSpm || 0), 0);
  }, [yearSpm]);

  const sisaPagu = totalPagu - totalRealisasi;
  const persentaseRealisasi = totalPagu > 0 ? (totalRealisasi / totalPagu) * 100 : 0;

  // Tax Totals
  const totalPajak = useMemo(() => {
    let ppn = 0;
    let pph21 = 0;
    let pph22 = 0;
    let pph23 = 0;
    let pphPasal4 = 0;

    yearSpm.forEach((s) => {
      if (s.pajak) {
        ppn += s.pajak.ppn || 0;
        pph21 += s.pajak.pph21 || 0;
        pph22 += s.pajak.pph22 || 0;
        pph23 += s.pajak.pph23 || 0;
        pphPasal4 += s.pajak.pphPasal4 || 0;
      }
    });

    return {
      ppn,
      pph21,
      pph22,
      pph23,
      pphPasal4,
      grandTotal: ppn + pph21 + pph22 + pph23 + pphPasal4,
    };
  }, [yearSpm]);

  // Hierarchical Rekap per Bidang
  const rekapPerBidang = useMemo(() => {
    return bidangList.map((bidang) => {
      // Find programs under this bidang
      const programs = programList.filter((p) => p.bidangId === bidang.id);
      const programIds = programs.map((p) => p.id);

      // Find kegiatan
      const kegiatans = kegiatanList.filter((k) => programIds.includes(k.programId));
      const kegiatanIds = kegiatans.map((k) => k.id);

      // Find subkegiatan
      const subKegiatans = subKegiatanList.filter((sk) => kegiatanIds.includes(sk.kegiatanId));
      const subKegiatanIds = subKegiatans.map((sk) => sk.id);

      // Find rekening
      const rekenings = yearRekening.filter((r) => subKegiatanIds.includes(r.subKegiatanId));
      const paguBidang = rekenings.reduce((sum, r) => sum + r.pagu, 0);

      // Find SPM realisasi
      const spms = yearSpm.filter((s) => s.bidangId === bidang.id);
      const realisasiBidang = spms.reduce((sum, s) => sum + s.realisasiSpm, 0);

      const persentase = paguBidang > 0 ? (realisasiBidang / paguBidang) * 100 : 0;
      const sisa = paguBidang - realisasiBidang;

      return {
        bidang,
        programs,
        pagu: paguBidang,
        realisasi: realisasiBidang,
        sisa,
        persentase,
        jumlahSpm: spms.length,
      };
    });
  }, [
    bidangList,
    programList,
    kegiatanList,
    subKegiatanList,
    yearRekening,
    yearSpm,
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border-2 border-slate-900">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 rounded-lg shadow-sm font-heading">
              DASHBOARD RINGKASAN
            </span>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              TAHUN ANGGARAN {selectedYear}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase font-heading">
            Kontrol Realisasi Belanja <span className="text-amber-400">&</span> SPM
          </h2>
          <p className="text-xs font-medium text-slate-300 max-w-2xl leading-relaxed">
            Ringkasan data register SPM, kontrol pekerjaan fisik, pagu anggaran, serta rekapitulasi pajak APBD.
          </p>
        </div>

        {/* Year Select Widget */}
        <div className="flex items-center gap-3 bg-slate-900 border-2 border-slate-800 p-3.5 rounded-2xl">
          <div className="text-right">
            <div className="text-[10px] text-amber-400 uppercase font-black tracking-wider">TAHUN ANGGARAN</div>
            <div className="text-xs font-bold text-slate-300">PILIH TAHUN</div>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value as any)}
            className="bg-slate-950 text-amber-400 font-black text-sm px-3.5 py-2 rounded-xl border border-amber-500/50 focus:outline-none cursor-pointer tracking-wider"
          >
            <option value="2026">TA 2026</option>
            <option value="2027">TA 2027</option>
            <option value="2028">TA 2028</option>
            <option value="2029">TA 2029</option>
            <option value="2030">TA 2030</option>
          </select>
        </div>
      </div>

      {/* Top Statistic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Jumlah SPM */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">JUMLAH SPM</span>
            <div className="p-2 bg-amber-100 text-slate-950 rounded-xl font-bold border border-amber-300">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-950 tracking-tight">{totalSpmCount}</div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">Dokumen SPM terdaftar</p>
        </div>

        {/* Metric 2: Jumlah Pekerjaan */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">TOTAL PEKERJAAN</span>
            <div className="p-2 bg-slate-100 text-slate-950 rounded-xl font-bold border border-slate-300">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-950 tracking-tight">{totalPekerjaanCount}</div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">Paket kontrak terikat</p>
        </div>

        {/* Metric 3: Pekerjaan Belum Selesai */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-700">BELUM SELESAI</span>
            <div className="p-2 bg-rose-100 text-rose-950 rounded-xl font-bold border border-rose-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 tracking-tight">
            {pekerjaanBelumSelesaiCount}
          </div>
          <p className="text-[11px] font-semibold text-rose-600 mt-1">Progress fisik &lt; 100%</p>
        </div>

        {/* Metric 4: Total Pagu */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">TOTAL PAGU</span>
            <div className="p-2 bg-emerald-100 text-emerald-950 rounded-xl font-bold border border-emerald-300">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-black text-slate-950 truncate" title={formatRupiah(totalPagu)}>
            {formatRupiah(totalPagu)}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">Pagu Anggaran TA {selectedYear}</p>
        </div>

        {/* Metric 5: Total Realisasi */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-800">TOTAL REALISASI</span>
            <div className="p-2 bg-sky-100 text-sky-950 rounded-xl font-bold border border-sky-300">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-black text-sky-900 truncate" title={formatRupiah(totalRealisasi)}>
            {formatRupiah(totalRealisasi)}
          </div>
          <p className="text-[11px] font-extrabold text-sky-700 mt-1">
            {persentaseRealisasi.toFixed(1)}% dari Pagu
          </p>
        </div>

        {/* Metric 6: Sisa Pagu */}
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">SISA PAGU</span>
            <div className="p-2 bg-amber-100 text-amber-950 rounded-xl font-bold border border-amber-300">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-black text-slate-900 truncate" title={formatRupiah(sisaPagu)}>
            {formatRupiah(sisaPagu)}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">Belum direalisasikan</p>
        </div>
      </div>

      {/* Main Grid: Rekap Per Bidang & Tax Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Rekapitulasi Per Bidang secara Hirarki Menurun */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight flex items-center gap-2 font-heading">
                  <Layers className="w-5 h-5 text-amber-500" />
                  Rekapitulasi Belanja Per Bidang (Hirarki)
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Rincian pagu, realisasi SPM, dan sisa anggaran di setiap bidang kerja
                </p>
              </div>
              <span className="text-xs font-black text-slate-950 bg-amber-400 px-3 py-1 rounded-xl border border-amber-500">
                {bidangList.length} BIDANG
              </span>
            </div>

            <div className="space-y-3.5">
              {rekapPerBidang.map((item) => {
                const isExpanded = !!expandedBidang[item.bidang.id];
                return (
                  <div
                    key={item.bidang.id}
                    className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-xs"
                  >
                    {/* Header Item */}
                    <div
                      onClick={() => toggleExpand(item.bidang.id)}
                      className="bg-slate-50 hover:bg-amber-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="px-2.5 py-1 bg-slate-950 text-amber-400 rounded-xl font-mono text-xs font-black shrink-0 border border-slate-900">
                          {item.bidang.kode}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-950 uppercase">{item.bidang.nama}</h4>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">
                            {item.programs.length} Program | {item.jumlahSpm} SPM
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right justify-between sm:justify-end">
                        <div>
                          <div className="text-[10px] font-black uppercase text-slate-400">Realisasi / Pagu</div>
                          <div className="text-xs font-black text-slate-950">
                            <span className="text-sky-800 font-black">{formatRupiah(item.realisasi)}</span>
                            <span className="text-slate-400"> / </span>
                            <span>{formatRupiah(item.pagu)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 text-xs font-black uppercase rounded-xl border ${
                              item.persentase >= 80
                                ? 'bg-emerald-400 text-slate-950 border-emerald-500'
                                : item.persentase >= 40
                                ? 'bg-sky-400 text-slate-950 border-sky-500'
                                : 'bg-slate-200 text-slate-950 border-slate-300'
                            }`}
                          >
                            {item.persentase.toFixed(1)}%
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-900 font-bold" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-900 font-bold" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 overflow-hidden border-t border-slate-300">
                      <div
                        className="bg-amber-500 h-full transition-all duration-500"
                        style={{ width: `${Math.min(item.persentase, 100)}%` }}
                      />
                    </div>

                    {/* Collapsible Program Details */}
                    {isExpanded && (
                      <div className="p-4 bg-white border-t-2 border-slate-900 space-y-3">
                        <div className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading">
                          PROGRAM KERJA TERKAIT:
                        </div>
                        {item.programs.length === 0 ? (
                          <div className="text-xs text-slate-400 italic">
                            Belum ada program diinput di bidang ini.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {item.programs.map((prog) => (
                              <div
                                key={prog.id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs border border-slate-300"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono text-xs font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded-lg border border-amber-500">
                                    {prog.kode}
                                  </span>
                                  <span className="font-extrabold text-slate-900">{prog.nama}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Rekapitulasi Pajak & Statistik Sederhana */}
        <div className="space-y-6">
          {/* Tax Breakdown Card */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-sm space-y-4">
            <div className="border-b-2 border-slate-900 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-950 flex items-center gap-2 font-heading">
                <Receipt className="w-4 h-4 text-amber-500" />
                Rekapitulasi Pajak SPM (TA {selectedYear})
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Jumlah pemotongan pajak dari seluruh SPM yang telah dicairkan
              </p>
            </div>

            <div className="space-y-2.5">
              {/* PPN */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border-2 border-slate-900">
                <div>
                  <div className="text-xs font-black text-slate-950">PPN (11%)</div>
                  <div className="text-[10px] font-bold text-slate-500">Pajak Pertambahan Nilai</div>
                </div>
                <div className="text-xs font-black text-indigo-900">
                  {formatRupiah(totalPajak.ppn)}
                </div>
              </div>

              {/* PPh 21 */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border-2 border-slate-900">
                <div>
                  <div className="text-xs font-black text-slate-950">PPh 21</div>
                  <div className="text-[10px] font-bold text-slate-500">Pajak Penghasilan Orang Pribadi</div>
                </div>
                <div className="text-xs font-black text-indigo-900">
                  {formatRupiah(totalPajak.pph21)}
                </div>
              </div>

              {/* PPh 22 */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border-2 border-slate-900">
                <div>
                  <div className="text-xs font-black text-slate-950">PPh 22</div>
                  <div className="text-[10px] font-bold text-slate-500">Pajak Pengadaan Barang</div>
                </div>
                <div className="text-xs font-black text-indigo-900">
                  {formatRupiah(totalPajak.pph22)}
                </div>
              </div>

              {/* PPh 23 */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border-2 border-slate-900">
                <div>
                  <div className="text-xs font-black text-slate-950">PPh 23</div>
                  <div className="text-[10px] font-bold text-slate-500">Pajak Jasa & Sewa</div>
                </div>
                <div className="text-xs font-black text-indigo-900">
                  {formatRupiah(totalPajak.pph23)}
                </div>
              </div>

              {/* PPh Pasal 4(2) */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border-2 border-slate-900">
                <div>
                  <div className="text-xs font-black text-slate-950">PPh Pasal 4(2)</div>
                  <div className="text-[10px] font-bold text-slate-500">Pajak Final Jasa Konstruksi</div>
                </div>
                <div className="text-xs font-black text-indigo-900">
                  {formatRupiah(totalPajak.pphPasal4)}
                </div>
              </div>

              {/* Grand Total Tax */}
              <div className="p-4 bg-slate-950 text-white rounded-2xl flex items-center justify-between border-2 border-slate-900 shadow-md">
                <div>
                  <div className="text-xs font-black uppercase text-amber-400 font-heading">TOTAL SELURUH PAJAK</div>
                  <div className="text-[10px] font-bold text-slate-400">Setoran Kas Negara</div>
                </div>
                <div className="text-base font-black text-amber-400">
                  {formatRupiah(totalPajak.grandTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Visual Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              Statistik Realisasi Belanja
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Terpakai (Realisasi)</span>
                  <span className="text-sky-700">{persentaseRealisasi.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(persentaseRealisasi, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Sisa Pagu Anggaran</span>
                  <span className="text-slate-600">
                    {(100 - persentaseRealisasi).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-slate-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Math.max(100 - persentaseRealisasi, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
