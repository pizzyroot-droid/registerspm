// Formatting utilities for Indonesian currency, dates, and numbers

export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  return new Intl.NumberFormat('id-ID').format(amount);
}

export function formatDateIndo(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  // Convert to YYYY-MM-DD for date input
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateTaxEstimates(realisasi: number) {
  if (!realisasi || realisasi <= 0) {
    return { ppn: 0, pph21: 0, pph22: 0, pph23: 0, pphPasal4: 0 };
  }
  // Standard estimates:
  // PPN 11% = (Realisasi * 11) / 111 (or 11% of DPP)
  const dpp = Math.round(realisasi / 1.11);
  const ppn = Math.round(dpp * 0.11);
  const pph22 = Math.round(dpp * 0.015); // PPh 22 1.5%
  const pph23 = Math.round(dpp * 0.02);  // PPh 23 2%
  
  return {
    ppn,
    pph21: 0,
    pph22,
    pph23: 0,
    pphPasal4: 0,
  };
}

export function getDaysRemaining(endDateStr: string): number {
  if (!endDateStr) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(endDateStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStatusContract(endDateStr: string, persentaseFisik: number) {
  if (persentaseFisik >= 100) {
    return {
      label: 'Selesai 100%',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badge: 'bg-emerald-500',
      isMendekati: false,
      isSelesai: true
    };
  }
  const days = getDaysRemaining(endDateStr);
  if (days < 0) {
    return {
      label: `Keterlambatan (${Math.abs(days)} hr)`,
      color: 'bg-rose-100 text-rose-800 border-rose-200',
      badge: 'bg-rose-500',
      isMendekati: true,
      isSelesai: false
    };
  }
  if (days <= 30) {
    return {
      label: `Mendekati Deadline (${days} hr)`,
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      badge: 'bg-amber-500',
      isMendekati: true,
      isSelesai: false
    };
  }
  return {
    label: `Dalam Proses (${days} hr lagi)`,
    color: 'bg-sky-100 text-sky-800 border-sky-200',
    badge: 'bg-sky-500',
    isMendekati: false,
    isSelesai: false
  };
}
