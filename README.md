# eMonitoring DAK — Bidang Jalan TA 2024

Sistem monitoring pelaksanaan Dana Alokasi Khusus (DAK) Bidang Jalan berbasis web untuk Kementerian PUPR / PFID.

## Fitur Utama
- Dashboard rekapitulasi per provinsi dengan chart interaktif
- Filter wilayah (Tengah, Timur, Barat)
- Selector Triwulan (TW1-TW4)
- Checklist kelengkapan dokumen per triwulan (sesuai hasil rapat PFID)
- Sistem upload dokumen untuk PEMDA
- Verifikasi dokumen oleh PFID dengan timestamping
- Mode tampilan PEMDA vs PFID/Pusat
- Data progres keuangan & fisik
- Foto kegiatan (0%, 50%, 100%)
- Realisasi output terverifikasi

## Tech Stack
- React + Vite + Tailwind CSS
- Recharts untuk visualisasi data
- Deploy: Vercel

## Cara Deploy
1. Push ke GitHub
2. Connect ke Vercel
3. Build command: `npm run build`
4. Output dir: `dist`
