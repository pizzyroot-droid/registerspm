import {
  Bidang,
  Program,
  Kegiatan,
  SubKegiatan,
  RekeningPagu,
  KontrakPekerjaan,
  RegisterSpm,
  User,
} from '../types';

export const initialUser: User = {
  username: 'admin',
  passwordHash: 'admin123',
  namaLengkap: 'Administrator Utama',
  jabatan: 'Pengelola Keuangan & Full Admin',
  role: 'admin',
};

export const initialRegularUser: User = {
  username: 'user',
  passwordHash: 'user123',
  namaLengkap: 'User / Tamu Pengamat',
  jabatan: 'Staf / View Only Keuangan',
  role: 'user',
};

export const initialBidang: Bidang[] = [
  { id: 'B1', kode: '1.01.01', nama: 'Sekretariat' },
  { id: 'B2', kode: '1.01.02', nama: 'Bidang Pembangunan & Infrastruktur' },
  { id: 'B3', kode: '1.01.03', nama: 'Bidang Perencanaan & Evaluasi' },
  { id: 'B4', kode: '1.01.04', nama: 'Bidang Tata Ruang & Pengawasan' },
];

export const initialProgram: Program[] = [
  {
    id: 'P1',
    bidangId: 'B1',
    kode: '1.01.01.2.01',
    nama: 'Program Penunjang Urusan Pemerintahan Daerah',
  },
  {
    id: 'P2',
    bidangId: 'B2',
    kode: '1.01.02.2.02',
    nama: 'Program Pembangunan Jalan, Jembatan, dan Infrastruktur',
  },
  {
    id: 'P3',
    bidangId: 'B3',
    kode: '1.01.03.2.03',
    nama: 'Program Perencanaan dan Penganggaran Pembangunan Daerah',
  },
  {
    id: 'P4',
    bidangId: 'B4',
    kode: '1.01.04.2.04',
    nama: 'Program Penataan Bangunan Gedung dan Pengawasan Fasilitas Umum',
  },
];

export const initialKegiatan: Kegiatan[] = [
  {
    id: 'K1',
    programId: 'P1',
    kode: '1.01.01.2.01.01',
    nama: 'Administrasi Umum dan Dukungan Operasional Perkatoran',
  },
  {
    id: 'K2',
    programId: 'P2',
    kode: '1.01.02.2.02.01',
    nama: 'Pembangunan dan Rehabilitasi Sarana Prasarana Jalan',
  },
  {
    id: 'K3',
    programId: 'P3',
    kode: '1.01.03.2.03.01',
    nama: 'Riset dan Penyusunan Dokumen Strategis Daerah',
  },
  {
    id: 'K4',
    programId: 'P4',
    kode: '1.01.04.2.04.01',
    nama: 'Pengawasan Teknis Konstruksi dan Bangunan',
  },
];

export const initialSubKegiatan: SubKegiatan[] = [
  {
    id: 'SK1',
    kegiatanId: 'K1',
    kode: '1.01.01.2.01.01.01',
    nama: 'Penyediaan Komponen Bahan Logistik dan Cetak Kantor',
  },
  {
    id: 'SK2',
    kegiatanId: 'K2',
    kode: '1.01.02.2.02.01.01',
    nama: 'Peningkatan Jalan Ruas Utama Kabupaten',
  },
  {
    id: 'SK3',
    kegiatanId: 'K3',
    kode: '1.01.03.2.03.01.01',
    nama: 'Penyusunan Masterplan Pembangunan Kawasan Terpadu',
  },
  {
    id: 'SK4',
    kegiatanId: 'K4',
    kode: '1.01.04.2.04.01.01',
    nama: 'Pengawasan Kepatuhan Izin Bangunan Gedung',
  },
];

export const initialRekening: RekeningPagu[] = [
  {
    id: 'R1',
    subKegiatanId: 'SK1',
    kode: '5.1.02.01.01.0024',
    nama: 'Belanja Alat/Bahan untuk Kegiatan Kantor- Kertas dan Cover',
    pagu: 75000000,
    tahun: '2026',
  },
  {
    id: 'R2',
    subKegiatanId: 'SK1',
    kode: '5.1.02.01.01.0026',
    nama: 'Belanja Cetak dan Penggandaan',
    pagu: 45000000,
    tahun: '2026',
  },
  {
    id: 'R3',
    subKegiatanId: 'SK2',
    kode: '5.2.04.01.01.0002',
    nama: 'Belanja Modal Jalan, Irigasi dan Jaringan',
    pagu: 1500000000,
    tahun: '2026',
  },
  {
    id: 'R4',
    subKegiatanId: 'SK3',
    kode: '5.1.02.02.01.0005',
    nama: 'Belanja Jasa Konsultansi Perencanaan Konstruksi',
    pagu: 250000000,
    tahun: '2026',
  },
  {
    id: 'R5',
    subKegiatanId: 'SK4',
    kode: '5.1.02.02.01.0008',
    nama: 'Belanja Jasa Konsultansi Pengawasan Konstruksi',
    pagu: 180000000,
    tahun: '2026',
  },
  {
    id: 'R6',
    subKegiatanId: 'SK1',
    kode: '5.1.01.01.01.0001',
    nama: 'Belanja Gaji Pokok ASN dan Tunjangan Pokok',
    pagu: 420000000,
    tahun: '2026',
  },
];

export const initialKontrak: KontrakPekerjaan[] = [
  {
    id: 'KT1',
    bidangId: 'B2',
    uraian: 'Peningkatan Jalan Ruas Utama Km 12-18 Sambirejo',
    namaPenyedia: 'PT Wijaya Karya Utama',
    nomorKontrak: '602.1/KTR/DPU/2026',
    tanggalMulai: '2026-02-01',
    tanggalBerakhir: '2026-09-30',
    nilaiKontrak: 1500000000,
    persentaseFisik: 65,
    tahun: '2026',
  },
  {
    id: 'KT2',
    bidangId: 'B4',
    uraian: 'Pengawasan Teknis Pembangunan Gedung Serbaguna',
    namaPenyedia: 'CV Konsultan Prima Nusantara',
    nomorKontrak: '602.2/KTR/DPU/2026',
    tanggalMulai: '2026-03-10',
    tanggalBerakhir: '2026-08-30',
    nilaiKontrak: 180000000,
    persentaseFisik: 90,
    tahun: '2026',
  },
  {
    id: 'KT3',
    bidangId: 'B3',
    uraian: 'Penyusunan Masterplan Pengembangan Kawasan Strategis',
    namaPenyedia: 'PT Citra Mandiri Konsultindo',
    nomorKontrak: '602.3/KTR/DPU/2026',
    tanggalMulai: '2026-04-01',
    tanggalBerakhir: '2026-11-15',
    nilaiKontrak: 250000000,
    persentaseFisik: 40,
    tahun: '2026',
  },
];

export const initialSpm: RegisterSpm[] = [
  {
    id: 'SPM1',
    nomorSpm: '00001/SPM-LS/2026',
    tanggalSpm: '2026-03-15',
    jenisBelanja: 'LS',
    bidangId: 'B2',
    kontrakId: 'KT1',
    uraianPekerjaan: 'Pembayaran Termyn I Pekerjaan Peningkatan Jalan Ruas Utama Km 12-18',
    persentaseFisik: 35,
    realisasiSpm: 525000000,
    pajak: {
      ppn: 52027027,
      pph21: 0,
      pph22: 7094595,
      pph23: 0,
      pphPasal4: 0,
    },
    rincianBelanja: [
      {
        id: 'RC1',
        bidangId: 'B2',
        programId: 'P2',
        kegiatanId: 'K2',
        subKegiatanId: 'SK2',
        rekeningId: 'R3',
        nilaiRealisasi: 525000000,
      },
    ],
    tahun: '2026',
  },
  {
    id: 'SPM2',
    nomorSpm: '00002/SPM-GU/2026',
    tanggalSpm: '2026-04-10',
    jenisBelanja: 'GU',
    bidangId: 'B1',
    uraianPekerjaan: 'Ganti Uang Persediaan Pembelian ATK Kertas dan Cetak Kantor',
    persentaseFisik: 100,
    realisasiSpm: 35000000,
    pajak: {
      ppn: 3468468,
      pph21: 0,
      pph22: 472973,
      pph23: 0,
      pphPasal4: 0,
    },
    rincianBelanja: [
      {
        id: 'RC2',
        bidangId: 'B1',
        programId: 'P1',
        kegiatanId: 'K1',
        subKegiatanId: 'SK1',
        rekeningId: 'R1',
        nilaiRealisasi: 25000000,
      },
      {
        id: 'RC3',
        bidangId: 'B1',
        programId: 'P1',
        kegiatanId: 'K1',
        subKegiatanId: 'SK1',
        rekeningId: 'R2',
        nilaiRealisasi: 10000000,
      },
    ],
    tahun: '2026',
  },
  {
    id: 'SPM3',
    nomorSpm: '00003/SPM-LS/2026',
    tanggalSpm: '2026-05-20',
    jenisBelanja: 'LS',
    bidangId: 'B4',
    kontrakId: 'KT2',
    uraianPekerjaan: 'Pembayaran Uang Muka Pekerjaan Pengawasan Teknis Pembangunan Gedung',
    persentaseFisik: 50,
    realisasiSpm: 90000000,
    pajak: {
      ppn: 8918919,
      pph21: 0,
      pph22: 0,
      pph23: 1621622,
      pphPasal4: 0,
    },
    rincianBelanja: [
      {
        id: 'RC4',
        bidangId: 'B4',
        programId: 'P4',
        kegiatanId: 'K4',
        subKegiatanId: 'SK4',
        rekeningId: 'R5',
        nilaiRealisasi: 90000000,
      },
    ],
    tahun: '2026',
  },
];
