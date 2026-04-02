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
  { no: 11, nama: "Provinsi Aceh", alokasi: 19448788000, paguRK: 12616765000, realisasiRP: 12307367098, realisasiPct: 97.55, progresFisik: 98.65, profesional: 5, semiProfesional: 3, pekerja: 43 },
  { no: 21, nama: "Kab. Aceh Besar", alokasi: 17313905000, paguRK: 17313905000, realisasiRP: 16945814925, realisasiPct: 97.87, progresFisik: 100.00, profesional: 26, semiProfesional: 40, pekerja: 280 },
  { no: 31, nama: "Kab. Pidie", alokasi: 19857992000, paguRK: 19857992000, realisasiRP: 19512587000, realisasiPct: 98.26, progresFisik: 100.00, profesional: 22, semiProfesional: 54, pekerja: 110 },
  { no: 41, nama: "Kab. Aceh Timur", alokasi: 11636093000, paguRK: 11636093000, realisasiRP: 11539868000, realisasiPct: 99.17, progresFisik: 100.00, profesional: 4, semiProfesional: 5, pekerja: 4 },
  { no: 51, nama: "Kab. Aceh Selatan", alokasi: 36866156000, paguRK: 36866156000, realisasiRP: 27860787180, realisasiPct: 75.57, progresFisik: 100.00, profesional: 19, semiProfesional: 32, pekerja: 250 },
  { no: 61, nama: "Kab. Aceh Barat", alokasi: 19906371000, paguRK: 19906371000, realisasiRP: 19227679163, realisasiPct: 96.59, progresFisik: 100.00, profesional: 8, semiProfesional: 17, pekerja: 51 },
];

export const triwulanDocs = {
  TW1: [
    { id: "ded", label: "DED Final RK (Layout/Stripmap, Typical Cross Section, RAB)", required: true },
    { id: "kontrak_spmk", label: "SPMK (Surat Perintah Mulai Kerja)", required: true },
    { id: "kontrak_penawaran", label: "Dokumen Penawaran RAB dan Gambar Rencana", required: true },
    { id: "kontrak_penunjukan", label: "Surat Penunjukan Penyedia", required: true },
    { id: "kontrak_perjanjian", label: "Surat Perjanjian/Kontrak", required: true },
    { id: "kurva_s", label: "Kurva S (sudah ditandatangani)", required: true },
    { id: "dpa", label: "DPA (sudah ditandatangani)", required: true },
    { id: "foto_0pct", label: "Foto Dokumentasi 0% (dengan logo PU, Pemda, keterangan lokasi, STA, progres)", required: true },
    { id: "adendum", label: "Adendum Kontrak (jika ada)", required: false },
    { id: "progres_keu", label: "Data Progres Keuangan dan Fisik", required: true },
  ],
  TW2: [
    { id: "kontrak_tw2", label: "Kontrak (bagi Pemda yang belum kontrak di TW I)", required: false },
    { id: "kurva_s_tw2", label: "Kurva S (sudah ditandatangani, jika ada update)", required: false },
    { id: "foto_0_100", label: "Foto Dokumentasi 0% s/d 100% (dengan logo PU, Pemda, keterangan lokasi, STA, progres)", required: true },
    { id: "adendum_tw2", label: "Adendum Kontrak (jika ada)", required: false },
    { id: "progres_keu_tw2", label: "Data Progres Keuangan dan Fisik", required: true },
  ],
  TW3: [
    { id: "kontrak_tw3", label: "Kontrak (bagi Pemda yang belum kontrak di TW II)", required: false },
    { id: "kurva_s_tw3", label: "Kurva S (update terbaru, jika ada)", required: false },
    { id: "foto_tw3", label: "Foto Dokumentasi 0% s/d 100% (dengan logo PU, Pemda, keterangan lokasi, STA, progres)", required: true },
    { id: "adendum_tw3", label: "Adendum Kontrak + Penjelasan Item Pekerjaan Tambah/Kurang", required: false },
    { id: "pho", label: "Dokumen PHO (jika progres sudah 100%)", required: false },
    { id: "progres_keu_tw3", label: "Data Progres Keuangan dan Fisik", required: true },
  ],
  TW4: [
    { id: "foto_100", label: "Foto Dokumentasi 100% (dengan logo PU, Pemda, keterangan lokasi, STA, progres)", required: true },
    { id: "pho_tw4", label: "Dokumen PHO", required: true },
    { id: "as_built", label: "Dokumen As Built Drawing", required: true },
    { id: "progres_keu_tw4", label: "Data Progres Keuangan dan Fisik", required: true },
    { id: "video", label: "Video Hasil Penanganan 100% (Video PKRMS dianjurkan)", required: true },
  ],
};

export const sampleKegiatan = {
  "Provinsi Aceh": [
    {
      no: 1,
      nama: "Penanganan Long Segment (pemeliharaan rutin, pemeliharaan berkala, peningkatan/rekonstruksi) Jl. Batas Aceh Timur - Kota Karang Baru",
      volume: 1.5,
      satuan: "km",
      pengadaan: "Kontraktual",
      paguRK: 12400000000,
      nilaiKontrak: 12212272000,
      realisasiRP: 12212272000,
      realisasiPct: 98.49,
      realisasiKontrakPct: 100.00,
      fisik: 100.00,
      statusPengadaan: "Terkontrak",
      tanggalKontrak: "28 Jun 2024",
      tipeTematik: "05-Jalan - Tematik Penguatan Kawasan Sentra Produksi Pangan",
      tipePermukaan: "AC WC",
      panjangSesuaiRK: 1.50,
      capaianOutput: 1.50,
      verifikasi: true,
      statusOutput: "Terlaksana",
      docs: {
        TW1: { ded: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-07-15" }, kontrak_spmk: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-07-15" }, kontrak_penawaran: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-07-15" }, kontrak_penunjukan: { uploaded: true, verifiedPFID: false }, kontrak_perjanjian: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-07-15" }, kurva_s: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-07-15" }, dpa: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-07-15" }, foto_0pct: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-07-15" }, progres_keu: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-07-15" } },
        TW2: { foto_0_100: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-10-01" }, progres_keu_tw2: { uploaded: true, verifiedPFID: true, tanggalVerif: "2024-10-01" } },
        TW3: { foto_tw3: { uploaded: true, verifiedPFID: false }, pho: { uploaded: false, verifiedPFID: false }, progres_keu_tw3: { uploaded: true, verifiedPFID: false } },
        TW4: { foto_100: { uploaded: true, verifiedPFID: false }, pho_tw4: { uploaded: true, verifiedPFID: false }, as_built: { uploaded: true, verifiedPFID: false }, progres_keu_tw4: { uploaded: true, verifiedPFID: false }, video: { uploaded: false, verifiedPFID: false } },
      }
    }
  ]
};

export const formatRupiah = (val) => {
  if (!val) return "-";
  return new Intl.NumberFormat("id-ID").format(val);
};
