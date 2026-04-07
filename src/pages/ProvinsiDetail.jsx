import { useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { pemda_aceh, formatRupiah } from "../data/mockData";

function getColor(pct) {
  if (pct >= 95) return "var(--green-light)";
  if (pct >= 80) return "var(--yellow-light)";
  return "var(--red-light)";
}

function ProgressBar({ value, color }) {
  return (
    <div className="prog-bar-wrap">
      <div className="prog-bar">
        <div className="prog-fill" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
      </div>
      <span className="prog-label" style={{ color }}>{value.toFixed(2)}%</span>
    </div>
  );
}

export default function ProvinsiDetail({ provinsi, triwulan, setPage }) {
  const [viewMode, setViewMode] = useState("perPemda");
  const data = pemda_aceh; // Use Aceh data as sample for all provinces

  const totalAlokasi = data.reduce((s, p) => s + p.alokasi, 0);
  const totalRealisasi = data.reduce((s, p) => s + p.realisasiRP, 0);
  const avgFisik = data.reduce((s, p) => s + p.progresFisik, 0) / data.length;
  const done100 = data.filter(p => p.progresFisik === 100).length;

  return (
    <div>
      <div className="page-header">
        <h1>Provinsi {provinsi}</h1>
        <p>Bidang Jalan · {triwulan} · {data.length} PEMDA</p>
      </div>

      <div className="summary-bar" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <div className="summary-cell">
          <div className="summary-label">Total Alokasi</div>
          <div className="summary-val" style={{ color: "var(--accent-light)", fontSize: 18 }}>
            Rp {(totalAlokasi / 1e9).toFixed(1)}M
          </div>
          <div className="summary-sub">{data.length} kabupaten/kota</div>
        </div>
        <div className="summary-cell">
          <div className="summary-label">Realisasi</div>
          <div className="summary-val" style={{ fontSize: 18, color: getColor((totalRealisasi / totalAlokasi) * 100) }}>
            {((totalRealisasi / totalAlokasi) * 100).toFixed(1)}%
          </div>
          <div className="summary-sub">Rp {(totalRealisasi / 1e9).toFixed(1)}M</div>
        </div>
        <div className="summary-cell">
          <div className="summary-label">Progres Fisik</div>
          <div className="summary-val" style={{ fontSize: 18, color: getColor(avgFisik) }}>
            {avgFisik.toFixed(1)}%
          </div>
          <div className="summary-sub">Rata-rata provinsi</div>
        </div>
        <div className="summary-cell">
          <div className="summary-label">Selesai 100%</div>
          <div className="summary-val" style={{ fontSize: 18, color: done100 === data.length ? "var(--green-light)" : "var(--yellow-light)" }}>
            {done100} / {data.length}
          </div>
          <div className="summary-sub">PEMDA telah selesai</div>
        </div>
      </div>



      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Rekapitulasi PEMDA — {provinsi}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="badge badge-green"><CheckCircle size={11} /> {done100} Selesai</span>
            {data.filter(p => p.realisasiPct < 80).length > 0 &&
              <span className="badge badge-yellow"><AlertTriangle size={11} /> {data.filter(p => p.realisasiPct < 80).length} Perhatian</span>
            }
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 50 }}>NO</th>
                <th>PEMDA</th>
                <th className="right">ALOKASI DAK (Rp)</th>
                <th className="right">PAGU RK (Rp)</th>
                <th className="right">REALISASI (Rp)</th>
                <th style={{ minWidth: 140 }}>REALISASI %</th>
                <th style={{ minWidth: 140 }}>PROGRES FISIK</th>
                <th className="center">PROF.</th>
                <th className="center">SEMI</th>
                <th className="center">PEKERJA</th>
                <th className="center">FISIK</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.no} onClick={() => setPage({ view: "pemda", pemda: p.nama, provinsi })}>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{p.no}</td>
                  <td className="link">{p.nama}</td>
                  <td className="right">{formatRupiah(p.alokasi)}</td>
                  <td className="right">{formatRupiah(p.paguRK)}</td>
                  <td className="right">{formatRupiah(p.realisasiRP)}</td>
                  <td><ProgressBar value={p.realisasiPct} color={getColor(p.realisasiPct)} /></td>
                  <td><ProgressBar value={p.progresFisik} color={getColor(p.progresFisik)} /></td>
                  <td className="center">{p.profesional}</td>
                  <td className="center">{p.semiProfesional}</td>
                  <td className="center">{p.pekerja}</td>
                  <td className="center">
                    <span className={`badge ${p.progresFisik === 100 ? "badge-green" : p.progresFisik >= 90 ? "badge-blue" : "badge-yellow"}`}>
                      {p.progresFisik.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
