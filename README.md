# eMonitoring DAK — Bidang Jalan TA 2024

Sistem monitoring pelaksanaan Dana Alokasi Khusus (DAK) Bidang Jalan untuk PFID Kementerian PUPR.

## Fitur
- Dashboard nasional per provinsi + chart interaktif
- Selector Triwulan TW1–TW4 (konten menyesuaikan)
- **Data Kontrak**: Tenaga kerja otomatis dari data kontrak penyedia
- **Data Progres**: Tabel progres + checklist kepatuhan per item kegiatan + upload dokumen progres inline
- **Foto Kegiatan**: Disesuaikan per TW (TW1=0%, TW2=0%+50%, TW3=0%+50%+100%, TW4=semua) + crosscheck
- **Realisasi Output**: Status verifikator (Terlaksana/Terkendala/Tidak Terlaksana) + catatan PFID
- **Kelengkapan Dokumen**: Checklist lengkap per TW + upload PEMDA + verifikasi/crosscheck PFID + laporan Word + kirim WhatsApp ke OPD
- Mode tampilan PFID (verifikator) vs PEMDA (pelapor)
- Generate laporan Word otomatis + link WhatsApp ke nomor HP OPD

## Generate Laporan Word (CLI)
```bash
node generate_report.js TW4
```

## Deploy ke Vercel
1. Push ke GitHub
2. Connect Vercel → Build: `npm run build`, Output: `dist`
3. `vercel.json` sudah include untuk SPA routing
