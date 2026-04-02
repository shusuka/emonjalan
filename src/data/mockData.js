export const provinsiData = [
  { id: 1, nama: "Aceh", alokasi: 321590314000, paguRK: 314758262979, realisasiRP: 297598462834, realisasiPct: 94.55, progresFisik: 99.78, profesional: 239, semiProfesional: 516, pekerja: 1564 },
  { id: 2, nama: "Sumatera Utara", alokasi: 908735127000, paguRK: 908730936899, realisasiRP: 823457155804, realisasiPct: 90.62, progresFisik: 96.05, profesional: 387, semiProfesional: 642, pekerja: 4371 },
  { id: 3, nama: "Sumatera Barat", alokasi: 260133969000, paguRK: 260133745154, realisasiRP: 249851464061, realisasiPct: 96.05, progresFisik: 99.74, profesional: 195, semiProfesional: 1280, pekerja: 792 },
  { id: 4, nama: "Riau", alokasi: 313598619000, paguRK: 301480182000, realisasiRP: 253507247067, realisasiPct: 84.09, progresFisik: 91.43, profesional: 119, semiProfesional: 207, pekerja: 522 },
  { id: 5, nama: "Jambi", alokasi: 285000000000, paguRK: 280000000000, realisasiRP: 265000000000, realisasiPct: 94.64, progresFisik: 98.20, profesional: 145, semiProfesional: 320, pekerja: 890 },
  { id: 6, nama: "Sumatera Selatan", alokasi: 420000000000, paguRK: 415000000000, realisasiRP: 398000000000, realisasiPct: 95.90, progresFisik: 99.10, profesional: 210, semiProfesional: 480, pekerja: 1200 },
  { id: 7, nama: "Bengkulu", alokasi: 195000000000, paguRK: 192000000000, realisasiRP: 178000000000, realisasiPct: 92.71, progresFisik: 96.50, profesional: 98, semiProfesional: 210, pekerja: 560 },
  { id: 8, nama: "Lampung", alokasi: 350000000000, paguRK: 345000000000, realisasiRP: 330000000000, realisasiPct: 95.65, progresFisik: 98.80, profesional: 175, semiProfesional: 390, pekerja: 980 },
];

export const pemda_aceh = [
  { no: 11, nama: "Provinsi Aceh", alokasi: 19448788000, paguRK: 12616765000, realisasiRP: 12307367098, realisasiPct: 97.55, progresFisik: 98.65, profesional: 5, semiProfesional: 3, pekerja: 43, namaOPD: "Dinas PUPR Provinsi Aceh", noHPOPD: "6281234567890", emailOPD: "pupr@acehprov.go.id" },
  { no: 21, nama: "Kab. Aceh Besar", alokasi: 17313905000, paguRK: 17313905000, realisasiRP: 16945814925, realisasiPct: 97.87, progresFisik: 100.00, profesional: 26, semiProfesional: 40, pekerja: 280, namaOPD: "Dinas PU Kab. Aceh Besar", noHPOPD: "6281987654321", emailOPD: "pu@acebbesar.go.id" },
  { no: 31, nama: "Kab. Pidie", alokasi: 19857992000, paguRK: 19857992000, realisasiRP: 19512587000, realisasiPct: 98.26, progresFisik: 100.00, profesional: 22, semiProfesional: 54, pekerja: 110, namaOPD: "Dinas PU Kab. Pidie", noHPOPD: "6281345678901", emailOPD: "pu@pidie.go.id" },
  { no: 41, nama: "Kab. Aceh Timur", alokasi: 11636093000, paguRK: 11636093000, realisasiRP: 11539868000, realisasiPct: 99.17, progresFisik: 100.00, profesional: 4, semiProfesional: 5, pekerja: 4, namaOPD: "Dinas PU Kab. Aceh Timur", noHPOPD: "6281456789012", emailOPD: "pu@acehtimur.go.id" },
  { no: 51, nama: "Kab. Aceh Selatan", alokasi: 36866156000, paguRK: 36866156000, realisasiRP: 27860787180, realisasiPct: 75.57, progresFisik: 100.00, profesional: 19, semiProfesional: 32, pekerja: 250, namaOPD: "Dinas PU Kab. Aceh Selatan", noHPOPD: "6281567890123", emailOPD: "pu@acehselatan.go.id" },
  { no: 61, nama: "Kab. Aceh Barat", alokasi: 19906371000, paguRK: 19906371000, realisasiRP: 19227679163, realisasiPct: 96.59, progresFisik: 100.00, profesional: 8, semiProfesional: 17, pekerja: 51, namaOPD: "Dinas PU Kab. Aceh Barat", noHPOPD: "6281678901234", emailOPD: "pu@acehbarat.go.id" },
];

// STATUS PENGADAAN
export const STATUS_PENGADAAN = ["Persiapan", "Proses Pengadaan Barang & Jasa", "Terkontrak"];

// Dokumen yang masuk Data Kontrak (jika sudah terkontrak), SEMUA TW
export const DOCS_KONTRAK = [
  { id: "ded", label: "DED Final RK (Layout/Stripmap, Typical Cross Section, RAB)", required: true, keterangan: "Dokumen perencanaan teknis lengkap" },
  { id: "spmk", label: "SPMK (Surat Perintah Mulai Kerja)", required: true, keterangan: "Ditandatangani PPK dan penyedia" },
  { id: "dok_penawaran", label: "Dokumen Penawaran RAB dan Gambar Rencana", required: true, keterangan: "" },
  { id: "sppbj", label: "Surat Penunjukan Penyedia Barang/Jasa (SPPBJ)", required: true, keterangan: "" },
  { id: "surat_perjanjian", label: "Surat Perjanjian/Kontrak", required: true, keterangan: "Ditandatangani kedua pihak" },
];

// Kelengkapan dokumen setelah terkontrak (semua TW) — adendum, update kurva S, foto dokumentasi progres fisik
export const DOCS_PASCA_KONTRAK_PER_TW = {
  // Semua TW yang sudah terkontrak: ini selalu muncul
  SEMUA: [
    { id: "adendum", label: "Adendum Kontrak (jika ada)", required: false, keterangan: "Ditandatangani jika terdapat perubahan kontrak" },
    { id: "update_kurva_s", label: "Update Kurva S (jika ada revisi)", required: false, keterangan: "Kurva S terbaru yang sudah ditandatangani" },
    { id: "foto_dok_progres", label: "Foto Dokumentasi Progres Fisik", required: true, keterangan: "Foto progres terbaru di lapangan" },
  ],
  TW1: [
    { id: "kurva_s_tw1", label: "Kurva S Awal (sudah ditandatangani)", required: true, keterangan: "" },
    { id: "dpa_tw1", label: "DPA (sudah ditandatangani)", required: true, keterangan: "" }, // DPA tetap di Data Progres tapi dokumennya di sini
  ],
  TW3: [
    { id: "pho_tw3", label: "Dokumen PHO (jika progres sudah 100%)", required: false, keterangan: "" },
  ],
  TW4: [
    { id: "pho_tw4", label: "Dokumen PHO", required: true, keterangan: "" },
    { id: "as_built", label: "As Built Drawing", required: true, keterangan: "" },
  ],
};

// Checklist per item progres fisik
export const checklistProgresItems = [
  { id: "vol_sesuai", label: "Volume pekerjaan sesuai kontrak" },
  { id: "mutu_ok", label: "Mutu pekerjaan sesuai spesifikasi teknis" },
  { id: "k3_ok", label: "K3 diterapkan di lapangan" },
  { id: "lingkungan_ok", label: "Penanganan lingkungan sesuai ketentuan" },
  { id: "uang_muka_ok", label: "Pengembalian uang muka sesuai progres keuangan" },
];

// Foto kegiatan: semua TW tetap 0%, 50%, 100%
export const FOTO_SLOTS = [
  { id: "foto_0", label: "Foto 0%", pct: 0 },
  { id: "foto_50", label: "Foto 50%", pct: 50 },
  { id: "foto_100", label: "Foto 100%", pct: 100 },
];

// PDF dokumentasi per slot foto
export const PDF_DOK_SLOTS = [
  { id: "pdf_0", label: "Dokumentasi PDF 0%" },
  { id: "pdf_50", label: "Dokumentasi PDF 50%" },
  { id: "pdf_100", label: "Dokumentasi PDF 100%" },
];

export const sampleKontrak = {
  "Provinsi Aceh": {
    namaPenyedia: "PT. Cahaya Konstruksi Aceh",
    alamatPenyedia: "Jl. T. Nyak Arief No. 12, Banda Aceh",
    tanggalKontrak: "28 Jun 2024",
    nomorKontrak: "600/PKT-01/DAK/2024",
    nilaiKontrak: 12212272000,
    tanggalSPMK: "01 Jul 2024",
    masaPelaksanaan: 150,
    masaPemeliharaan: 180,
    tenagaKerja: [
      { kategori: "Profesional", jabatan: "Project Manager", jumlah: 1, ket: "SKA Ahli Teknik Jalan - Madya" },
      { kategori: "Profesional", jabatan: "Site Engineer", jumlah: 2, ket: "SKA Ahli Teknik Jalan - Muda" },
      { kategori: "Profesional", jabatan: "Quality Control Engineer", jumlah: 1, ket: "SKA Ahli Teknik Jalan - Muda" },
      { kategori: "Profesional", jabatan: "K3 / HSE Officer", jumlah: 1, ket: "SKA K3 Konstruksi" },
      { kategori: "Semi Profesional", jabatan: "Mandor Jalan", jumlah: 2, ket: "Pengalaman min. 5 tahun" },
      { kategori: "Semi Profesional", jabatan: "Pengawas Lapangan", jumlah: 1, ket: "" },
      { kategori: "Pekerja", jabatan: "Operator Alat Berat", jumlah: 8, ket: "SIO Operator Alat Berat" },
      { kategori: "Pekerja", jabatan: "Pekerja Harian Lapangan", jumlah: 35, ket: "Tenaga lokal setempat" },
    ]
  }
};

// Riwayat status pengadaan per bulan
export const sampleStatusHistory = [
  { bulan: "Maret 2024", tanggal: "2024-03-31", status: "Persiapan" },
  { bulan: "April 2024", tanggal: "2024-04-30", status: "Proses Pengadaan Barang & Jasa" },
  { bulan: "Mei 2024", tanggal: "2024-05-31", status: "Proses Pengadaan Barang & Jasa" },
  { bulan: "Juni 2024", tanggal: "2024-06-28", status: "Terkontrak" },
  { bulan: "Juli 2024", tanggal: "2024-07-31", status: "Terkontrak" },
  { bulan: "Agustus 2024", tanggal: "2024-08-31", status: "Terkontrak" },
  { bulan: "September 2024", tanggal: "2024-09-30", status: "Terkontrak" },
  { bulan: "Oktober 2024", tanggal: "2024-10-30", status: "Terkontrak" },
  { bulan: "November 2024", tanggal: "2024-11-30", status: "Terkontrak" },
  { bulan: "Desember 2024", tanggal: "2024-12-10", status: "Terkontrak" },
];

export const sampleKegiatan = {
  "Provinsi Aceh": [
    {
      no: 1, kodeKegiatan: "01",
      nama: "Penanganan Long Segment (pemeliharaan rutin, pemeliharaan berkala, peningkatan/rekonstruksi) Jl. Batas Aceh Timur - Kota Karang Baru",
      ruas: "Batas Aceh Timur - Kota Karang Baru", kecamatan: "-", desa: "-",
      volume: 1.5, satuan: "km", pengadaan: "Kontraktual",
      paguRK: 12400000000, nilaiKontrak: 12212272000, realisasiRP: 12212272000,
      realisasiPct: 98.49, realisasiKontrakPct: 100.00, fisik: 100.00,
      statusPengadaan: "Terkontrak", tanggalKontrak: "28 Jun 2024",
      tipeTematik: "05-Jalan - Tematik Penguatan Kawasan Sentra Produksi Pangan (Pertanian, Perikanan, dan Hewani)",
      menuKegiatan: "01-Penanganan Jalan (Provinsi)", rincianKegiatan: "01-Penanganan Long Segment",
      tipePermukaan: "AC WC", panjangSesuaiRK: 1.50, capaianOutput: 1.50,
      statusOutput: "Terlaksana", catatanOutput: "", verifikasiOutput: true,
      checklistItems: { vol_sesuai: true, mutu_ok: true, k3_ok: true, lingkungan_ok: false, uang_muka_ok: true },
    }
  ]
};

export const formatRupiah = (val) => {
  if (!val && val !== 0) return "-";
  return new Intl.NumberFormat("id-ID").format(val);
};
