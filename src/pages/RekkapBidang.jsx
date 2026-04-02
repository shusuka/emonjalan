import { useState } from "react";
import { TrendingUp, Users, Building2, AlertTriangle } from "lucide-react";
import { provinsiData, formatRupiah } from "../data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function getColor(pct) {
  if (pct >= 95) return "var(--green-light)";
  if (pct >= 80) return "var(--yellow-light)";
  return "var(--red-light)";
}

function ProgressBar({ value, color }) {
  return (
    <div className="prog-bar-wrap">
      <div className="prog-bar">
        <div className="prog-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="prog-label" style={{ color }}>{value.toFixed(2)}%</span>
    </div>
  );
}

const wilayahFilter = {
  "Semua Wilayah": null,
  "Wilayah Tengah": ["Sumatera Barat", "Jambi", "Sumatera Selatan"],
  "Wilayah Timur": ["Riau", "Sumatera Utara"],
  "Wilayah Barat": ["Aceh", "Bengkulu", "Lampung"],
};

export default function RekkapBidang({ triwulan, setPage }) {
  const [wilayah, setWilayah] = useState("Semua Wilayah");

  const filtered = provinsiData.filter(p => {
    if (!wilayahFilter[wilayah]) return true;
    return wilayahFilter[wilayah].includes(p.nama);
  });

  const totalAlokasi = filtered.reduce((s, p) => s + p.alokasi, 0);
  const totalRealisasi = filtered.reduce((s, p) => s + p.realisasiRP, 0);
  const avgKeu = filtered.reduce((s, p) => s + p.realisasiPct, 0) / filtered.length;
  const avgFisik = filtered.reduce((s, p) => s + p.progresFisik, 0) / filtered.length;
  const totalPekerja = filtered.reduce((s, p) => s + p.pekerja, 0);
  const belowTarget = filtered.filter(p => p.progresFisik < 95).length;

  const chartData = filtered.map(p => ({
    name: p.nama.replace("Sumatera", "Sumatra").split(" ")[0],
    keuangan: p.realisasiPct,
    fisik: p.progresFisik,
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Rekapitulasi Pelaksanaan DAK</h1>
        <p>Bidang Jalan · Tahun Anggaran 2024 · {triwulan}</p>
      </div>

      {/* Summary bar */}
      <div className="summary-bar">
        <div className="summary-cell">
          <div className="summary-label">Total Alokasi DAK</div>
          <div className="summary-val" style={{ color: "var(--accent-light)" }}>
            Rp {(totalAlokasi / 1e12).toFixed(2)}T
          </div>
          <div className="summary-sub">{filtered.length} provinsi</div>
        </div>
        <div className="summary-cell">
          <div className="summary-label">Realisasi Keuangan</div>
          <div className="summary-val" style={{ color: getColor(avgKeu) }}>
            {avgKeu.toFixed(1)}%
          </div>
          <div className="summary-sub">Rp {(totalRealisasi / 1e12).toFixed(2)}T</div>
        </div>
        <div className="summary-cell">
          <div className="summary-label">Progres Fisik</div>
          <div className="summary-val" style={{ color: getColor(avgFisik) }}>
            {avgFisik.toFixed(1)}%
          </div>
          <div className="summary-sub">Rata-rata nasional</div>
        </div>
        <div className="summary-cell">
          <div className="summary-label">Tenaga Kerja</div>
          <div className="summary-val">{totalPekerja.toLocaleString("id-ID")}</div>
          <div className="summary-sub">
            {belowTarget > 0 && <span style={{ color: "var(--yellow-light)" }}>⚠ {belowTarget} provinsi &lt;95%</span>}
            {belowTarget === 0 && <span className="text-green">✓ Semua on track</span>}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <div className="table-header">
          <span className="table-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={15} style={{ color: "var(--accent-light)" }} />
            Progres per Provinsi — {triwulan}
          </span>
        </div>
        <div style={{ padding: "16px 20px 20px" }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barGap={2} barSize={14}>
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v + "%"} />
              <Tooltip
                contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "var(--text)", fontWeight: 700 }}
                formatter={(v, name) => [v.toFixed(2) + "%", name === "keuangan" ? "Realisasi Keuangan" : "Progres Fisik"]}
              />
              <Bar dataKey="keuangan" radius={[3, 3, 0, 0]} fill="var(--accent)">
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.keuangan >= 95 ? "var(--accent)" : entry.keuangan >= 80 ? "var(--yellow)" : "var(--red)"} />
                ))}
              </Bar>
              <Bar dataKey="fisik" radius={[3, 3, 0, 0]} fill="var(--green)">
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fisik >= 95 ? "var(--green)" : entry.fisik >= 80 ? "#d29922" : "var(--red)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--accent)" }} /> Realisasi Keuangan
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--green)" }} /> Progres Fisik
            </div>
          </div>
        </div>
      </div>

      {/* Wilayah filter */}
      <div className="wilayah-tabs">
        {Object.keys(wilayahFilter).map(w => (
          <button key={w} className={`wilayah-btn ${wilayah === w ? "active" : ""}`} onClick={() => setWilayah(w)}>
            {w}
          </button>
        ))}
      </div>

      {/* Main table */}
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Rekapitulasi per Provinsi</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Klik provinsi untuk detail</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>NO</th>
                <th>PROVINSI</th>
                <th className="right">ALOKASI DAK (Rp)</th>
                <th className="right">PAGU RK (Rp)</th>
                <th className="right">REALISASI (Rp)</th>
                <th style={{ minWidth: 140 }}>REALISASI %</th>
                <th style={{ minWidth: 140 }}>PROGRES FISIK</th>
                <th className="center">PROFESIONAL</th>
                <th className="center">SEMI PROF.</th>
                <th className="center">PEKERJA</th>
                <th className="center">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} onClick={() => setPage({ view: "provinsi", provinsi: p.nama })}>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{i + 1}</td>
                  <td className="link">{p.nama}</td>
                  <td className="right">{formatRupiah(p.alokasi)}</td>
                  <td className="right">{formatRupiah(p.paguRK)}</td>
                  <td className="right">{formatRupiah(p.realisasiRP)}</td>
                  <td><ProgressBar value={p.realisasiPct} color={getColor(p.realisasiPct)} /></td>
                  <td><ProgressBar value={p.progresFisik} color={getColor(p.progresFisik)} /></td>
                  <td className="center">{p.profesional.toLocaleString("id-ID")}</td>
                  <td className="center">{p.semiProfesional.toLocaleString("id-ID")}</td>
                  <td className="center">{p.pekerja.toLocaleString("id-ID")}</td>
                  <td className="center">
                    <span className={`badge ${p.progresFisik >= 95 ? "badge-green" : p.progresFisik >= 80 ? "badge-yellow" : "badge-red"}`}>
                      {p.progresFisik >= 95 ? "On Track" : p.progresFisik >= 80 ? "Perhatian" : "Terlambat"}
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
