export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT BACKEND FOR REGISTER SPM & REKAPITULASI BELANJA
 * 
 * CARA PENGGUNAAN:
 * 1. Buka Google Spreadsheet baru di Google Drive Anda.
 * 2. Klik menu Extensi (Extensions) > Apps Script.
 * 3. Hapus semua kode default, lalu Paste seluruh kode ini.
 * 4. Klik "Simpan" (Icon Diskette).
 * 5. Jalankan fungsi "setupDatabaseSheets" sekali untuk membuat sheet & header otomatis.
 * 6. Klik "Terapkan" (Deploy) > "Terapkan sebagai Aplikasi Web" (New Deployment).
 * 7. Pada "Siapa yang memiliki akses" (Who has access), pilih: "SIAPA SAJA" (Anyone).
 * 8. Klik Deploy, Berikan Izin Akun, lalu Copy "URL Aplikasi Web" (Web App URL).
 * 9. Paste URL tersebut di aplikasi ini pada menu Master Data > Integrasi Spreadsheet.
 */

function setupDatabaseSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = {
    "bidang": ["id", "kode", "nama"],
    "program": ["id", "bidangId", "kode", "nama"],
    "kegiatan": ["id", "programId", "kode", "nama"],
    "subkegiatan": ["id", "kegiatanId", "kode", "nama"],
    "rekening": ["id", "subKegiatanId", "kode", "nama", "pagu", "tahun"],
    "spm": ["id", "nomorSpm", "tanggalSpm", "jenisBelanja", "bidangId", "kontrakId", "uraianPekerjaan", "persentaseFisik", "realisasiSpm", "pajakJson", "rincianJson", "tahun"],
    "kontrak": ["id", "bidangId", "uraian", "namaPenyedia", "nomorKontrak", "tanggalMulai", "tanggalBerakhir", "nilaiKontrak", "persentaseFisik", "tahun"],
    "user": ["username", "passwordHash", "namaLengkap", "jabatan"]
  };

  for (var name in sheets) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(sheets[name]);
      sheet.getRange(1, 1, 1, sheets[name].length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
    }
  }
}

function doGet(e) {
  try {
    setupDatabaseSheets();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result = {
      status: "success",
      timestamp: new Date().toISOString(),
      data: {
        bidang: readSheet(ss, "bidang"),
        program: readSheet(ss, "program"),
        kegiatan: readSheet(ss, "kegiatan"),
        subkegiatan: readSheet(ss, "subkegiatan"),
        rekening: readSheet(ss, "rekening"),
        spm: readSpmSheet(ss),
        kontrak: readSheet(ss, "kontrak"),
        user: readSheet(ss, "user")
      }
    };
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    setupDatabaseSheets();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var payload = contents.data;

    if (action === "sync_all" && payload) {
      if (payload.bidang) writeSheet(ss, "bidang", ["id", "kode", "nama"], payload.bidang);
      if (payload.program) writeSheet(ss, "program", ["id", "bidangId", "kode", "nama"], payload.program);
      if (payload.kegiatan) writeSheet(ss, "kegiatan", ["id", "programId", "kode", "nama"], payload.kegiatan);
      if (payload.subkegiatan) writeSheet(ss, "subkegiatan", ["id", "kegiatanId", "kode", "nama"], payload.subkegiatan);
      if (payload.rekening) writeSheet(ss, "rekening", ["id", "subKegiatanId", "kode", "nama", "pagu", "tahun"], payload.rekening);
      if (payload.kontrak) writeSheet(ss, "kontrak", ["id", "bidangId", "uraian", "namaPenyedia", "nomorKontrak", "tanggalMulai", "tanggalBerakhir", "nilaiKontrak", "persentaseFisik", "tahun"], payload.kontrak);
      if (payload.user) writeSheet(ss, "user", ["username", "passwordHash", "namaLengkap", "jabatan"], payload.user);
      if (payload.spm) writeSpmSheet(ss, payload.spm);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil disimpan ke Google Spreadsheet!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Action tidak dikenal" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetCaseInsensitive(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (sheet) return sheet;
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toLowerCase().trim() === sheetName.toLowerCase().trim()) {
      return sheets[i];
    }
  }
  return null;
}

function readSheet(ss, sheetName) {
  var sheet = getSheetCaseInsensitive(ss, sheetName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    var hasContent = false;
    for (var j = 0; j < headers.length; j++) {
      var headerKey = String(headers[j] || "").trim();
      if (headerKey) {
        var val = data[i][j];
        if (val !== "" && val !== null && val !== undefined) {
          hasContent = true;
        }
        obj[headerKey] = val;
      }
    }
    if (hasContent) {
      rows.push(obj);
    }
  }
  return rows;
}

function readSpmSheet(ss) {
  var rawRows = readSheet(ss, "spm");
  return rawRows.map(function(item) {
    var rawPajak = item.pajakJson || item.pajak_json || item.pajakJsonStr || item.pajak || "";
    var rawRincian = item.rincianJson || item.rincian_json || item.rincianJsonStr || item.rincianBelanja || item.rincian || "";
    
    try {
      if (typeof rawPajak === "string" && rawPajak.trim().length > 0) {
        item.pajak = JSON.parse(rawPajak);
      } else if (typeof rawPajak === "object" && rawPajak !== null) {
        item.pajak = rawPajak;
      } else {
        item.pajak = { ppn:0, pph21:0, pph22:0, pph23:0, pphPasal4:0 };
      }
    } catch(e) {
      item.pajak = { ppn:0, pph21:0, pph22:0, pph23:0, pphPasal4:0 };
    }

    try {
      if (typeof rawRincian === "string" && rawRincian.trim().length > 0) {
        item.rincianBelanja = JSON.parse(rawRincian);
      } else if (Array.isArray(rawRincian)) {
        item.rincianBelanja = rawRincian;
      } else {
        item.rincianBelanja = [];
      }
    } catch(e) {
      item.rincianBelanja = [];
    }

    delete item.pajakJson;
    delete item.rincianJson;
    return item;
  });
}

function writeSheet(ss, sheetName, headers, items) {
  var sheet = getSheetCaseInsensitive(ss, sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.clear();
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
  
  if (items && items.length > 0) {
    var rows = items.map(function(item) {
      return headers.map(function(h) {
        return item[h] !== undefined && item[h] !== null ? item[h] : "";
      });
    });
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

function writeSpmSheet(ss, items) {
  var headers = ["id", "nomorSpm", "tanggalSpm", "jenisBelanja", "bidangId", "kontrakId", "uraianPekerjaan", "persentaseFisik", "realisasiSpm", "pajakJson", "rincianJson", "tahun"];
  var transformed = items.map(function(item) {
    return {
      id: item.id,
      nomorSpm: item.nomorSpm,
      tanggalSpm: item.tanggalSpm,
      jenisBelanja: item.jenisBelanja,
      bidangId: item.bidangId,
      kontrakId: item.kontrakId || "",
      uraianPekerjaan: item.uraianPekerjaan,
      persentaseFisik: item.persentaseFisik || 0,
      realisasiSpm: item.realisasiSpm || 0,
      pajakJson: JSON.stringify(item.pajak || {}),
      rincianJson: JSON.stringify(item.rincianBelanja || []),
      tahun: item.tahun
    };
  });
  writeSheet(ss, "spm", headers, transformed);
}
`;
