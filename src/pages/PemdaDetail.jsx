import { useState } from "react";
import { CheckCircle, Clock, Upload, FileText, Camera, Users, TrendingUp, AlertCircle, X, Eye, BarChart2, CheckSquare, Zap } from "lucide-react";
import { sampleKegiatan, triwulanDocs, formatRupiah } from "../data/mockData";

function getColor(pct) {
  if (pct >= 95) return "var(--green-light)";
  if (pct >= 80) return "var(--yellow-light)";
  return "var(--red-light)";
}

// ── STATUS tab ──────────────────────────────────────────────────────────────
function TabStatus({ kegiatan }) {
  const timeline = [
    { date: "2024-03-31", status: "Persiapan", done: true },
    { date: "2024-04-30", status: "Proses Pengadaan Barang & Jasa", done: true },
    { date: "2024-05-31", status: "Proses Pengadaan Barang & Jasa", done: true },
    { date: "2024-06-28", status: "Terkontrak", done: true },
    { date: "2024-07-31", status: "Terkontrak", done: true },
    { date: "2024-08-31", status: "Terkontrak", done: true },
    { date: "2024-09-30", status: "Terkontrak", done: true },
    { date: "2024-10-30", status: "Terkontrak", done: true },
    { date: "2024-11-30", status: "Terkontrak", done: true },
    { date: "2024-12-10", status: "Terkontrak", done: true },
  ];
  return (
    <div>
      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <AlertCircle size={14} />
        Status pengadaan terakhir: <strong>Terkontrak</strong> — diupdate 2024-12-10
      </div>
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Riwayat Status Pengadaan</span>
        </div>
        <div style={{ padding: "8px 0" }}>
          {timeline.map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16, padding: "10px 20px",
              borderBottom: i < timeline.length - 1 ? "1px solid var(--border2)" : "none",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: t.done ? "var(--green-bg)" : "var(--surface2)",
                border: `2px solid ${t.done ? "var(--green)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {t.done && <CheckCircle size={13} color="var(--green-light)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{t.status}</div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>{t.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DOKUMEN CHECKLIST tab ────────────────────────────────────────────────────
function DocChecklistItem({ doc, uploaded, verifiedPFID, tanggalVerif, isPemda, onUpload, onVerify }) {
  return (
    <div className="checklist-item">
      <div className={`check-icon ${verifiedPFID ? "verified" : uploaded ? "done" : "empty"}`}>
        {verifiedPFID ? <CheckCircle size={12} /> : uploaded ? <CheckCircle size={12} /> : null}
      </div>
      <div className="check-info">
        <div className="check-label">
          {doc.label}
          {doc.required && <span className="check-required">*wajib</span>}
        </div>
        <div className="check-meta">
          {verifiedPFID && <span className="pfid-stamp pfid-verified">✓ Diverifikasi PFID {tanggalVerif}</span>}
          {!verifiedPFID && uploaded && <span className="pfid-stamp pfid-pending">⏳ Menunggu verifikasi PFID</span>}
          {!uploaded && <span className="pfid-stamp pfid-none">Belum diupload</span>}
        </div>
      </div>
      <div className="check-actions">
        {uploaded && (
          <button className="btn btn-outline btn-xs"><Eye size={11} /> Lihat</button>
        )}
        {isPemda && !uploaded && (
          <button className="btn btn-primary btn-xs" onClick={onUpload}>
            <Upload size={11} /> Upload
          </button>
        )}
        {isPemda && uploaded && !verifiedPFID && (
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Menunggu PFID</span>
        )}
        {!isPemda && uploaded && !verifiedPFID && (
          <button className="btn btn-success btn-xs" onClick={onVerify}>
            <CheckCircle size={11} /> Verifikasi
          </button>
        )}
      </div>
    </div>
  );
}

function TabChecklist({ kegiatan, triwulan, isPemda }) {
  const docs = triwulanDocs[triwulan] || [];
  const docState = kegiatan.docs?.[triwulan] || {};
  const [localState, setLocalState] = useState(docState);

  const uploaded = docs.filter(d => localState[d.id]?.uploaded).length;
  const verified = docs.filter(d => localState[d.id]?.verifiedPFID).length;
  const required = docs.filter(d => d.required).length;
  const reqDone = docs.filter(d => d.required && localState[d.id]?.uploaded).length;

  function handleUpload(id) {
    setLocalState(s => ({ ...s, [id]: { ...(s[id] || {}), uploaded: true, verifiedPFID: false } }));
  }
  function handleVerify(id) {
    const today = new Date().toISOString().split("T")[0];
    setLocalState(s => ({ ...s, [id]: { ...(s[id] || {}), verifiedPFID: true, tanggalVerif: today } }));
  }

  const pct = docs.length ? Math.round((uploaded / docs.length) * 100) : 0;
  const allVerified = verified === docs.length;

  return (
    <div>
      {/* Progress summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Dokumen Diupload", val: `${uploaded}/${docs.length}`, color: "var(--accent-light)" },
          { label: "Terverifikasi PFID", val: `${verified}/${docs.length}`, color: verified === docs.length ? "var(--green-light)" : "var(--yellow-light)" },
          { label: "Wajib Terpenuhi", val: `${reqDone}/${required}`, color: reqDone === required ? "var(--green-light)" : "var(--red-light)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Kelengkapan Dokumen {triwulan}</span>
          <span style={{ color: getColor(pct), fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: getColor(pct), borderRadius: 99, transition: "width 0.6s" }} />
        </div>
      </div>

      {allVerified && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          <CheckCircle size={14} /> Semua dokumen telah diverifikasi PFID untuk {triwulan}
        </div>
      )}

      {!isPemda && uploaded > 0 && verified < docs.length && (
        <div className="alert alert-warn" style={{ marginBottom: 16 }}>
          <AlertCircle size={14} /> {uploaded - verified} dokumen menunggu verifikasi PFID
        </div>
      )}

      {/* Checklist */}
      <div className="checklist-panel">
        <div className="checklist-header">
          <span className="checklist-title">
            <FileText size={14} color="var(--accent-light)" />
            Kelengkapan Dokumen {triwulan}
          </span>
          {!isPemda && uploaded > 0 && (
            <button className="btn btn-success btn-sm" onClick={() => docs.forEach(d => handleVerify(d.id))}>
              <CheckSquare size={12} /> Verifikasi Semua
            </button>
          )}
        </div>
        {docs.map(doc => (
          <DocChecklistItem
            key={doc.id}
            doc={doc}
            uploaded={!!localState[doc.id]?.uploaded}
            verifiedPFID={!!localState[doc.id]?.verifiedPFID}
            tanggalVerif={localState[doc.id]?.tanggalVerif}
            isPemda={isPemda}
            onUpload={() => handleUpload(doc.id)}
            onVerify={() => handleVerify(doc.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── DATA PROGRES tab ─────────────────────────────────────────────────────────
function TabProgres({ kegiatan }) {
  return (
    <div>
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Data Progres Kegiatan</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>NO.</th>
                <th>KEGIATAN/OUTPUT</th>
                <th className="center">VOLUME</th>
                <th>SATUAN</th>
                <th>PENGADAAN</th>
                <th className="right">PAGU RK (Rp)</th>
                <th className="right">NILAI KONTRAK EMON (Rp)</th>
                <th className="right">REALISASI THD PAGU RK (Rp)</th>
                <th className="center">%</th>
                <th className="center">REALISASI THD KONTRAK</th>
                <th className="center">FISIK (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "rgba(46,160,67,0.05)" }}>
                <td colSpan={11} style={{ fontWeight: 700, fontSize: 11, color: "var(--green-light)", textTransform: "uppercase", padding: "8px 14px" }}>
                  Kegiatan Fisik
                </td>
              </tr>
              <tr onClick={() => {}}>
                <td>1</td>
                <td style={{ maxWidth: 280, lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{kegiatan.nama}</div>
                </td>
                <td className="center">{kegiatan.volume}</td>
                <td>{kegiatan.satuan}</td>
                <td><span className="badge badge-blue">{kegiatan.pengadaan}</span></td>
                <td className="right">{formatRupiah(kegiatan.paguRK)}</td>
                <td className="right">{formatRupiah(kegiatan.nilaiKontrak)}</td>
                <td className="right">{formatRupiah(kegiatan.realisasiRP)}</td>
                <td className="center">
                  <span style={{ color: getColor(kegiatan.realisasiPct), fontWeight: 700, fontFamily: "var(--font-mono)" }}>{kegiatan.realisasiPct}</span>
                </td>
                <td className="center">
                  <span style={{ color: getColor(kegiatan.realisasiKontrakPct), fontWeight: 700 }}>{kegiatan.realisasiKontrakPct}</span>
                </td>
                <td className="center">
                  <span className={`badge ${kegiatan.fisik === 100 ? "badge-green" : "badge-yellow"}`}>{kegiatan.fisik}%</span>
                </td>
              </tr>
              <tr style={{ background: "rgba(26,127,224,0.04)" }}>
                <td colSpan={11} style={{ fontWeight: 700, fontSize: 11, color: "var(--accent-light)", textTransform: "uppercase", padding: "8px 14px" }}>
                  Kegiatan Penunjang
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Penyelenggaraan rapat koordinasi di pemerintah daerah (Penugasan)</td>
                <td className="center">1</td>
                <td>Frekuensi</td>
                <td><span className="badge badge-purple">Swakelola</span></td>
                <td className="right">106.765.000</td>
                <td className="right">0</td>
                <td className="right">2.304.000</td>
                <td className="center" style={{ color: "var(--red-light)", fontWeight: 700 }}>2,16</td>
                <td className="center">0</td>
                <td className="center">0</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Perjalanan dinas ke/dari lokasi kegiatan dalam rangka perencanaan, pengendalian, dan pengawasan (Penugasan)</td>
                <td className="center">4</td>
                <td>Frekuensi</td>
                <td><span className="badge badge-purple">Swakelola</span></td>
                <td className="right">110.000.000</td>
                <td className="right">0</td>
                <td className="right">92.791.098</td>
                <td className="center" style={{ color: "var(--yellow-light)", fontWeight: 700 }}>84,36</td>
                <td className="center">0</td>
                <td className="center">42</td>
              </tr>
              <tr style={{ background: "var(--surface2)", borderTop: "2px solid var(--border)" }}>
                <td colSpan={5} style={{ fontWeight: 800, textAlign: "right", fontSize: 12, textTransform: "uppercase" }}>TOTAL</td>
                <td className="right" style={{ fontWeight: 800 }}>12.616.765.000</td>
                <td className="right" style={{ fontWeight: 800 }}>12.212.272.000</td>
                <td className="right" style={{ fontWeight: 800 }}>12.307.367.098</td>
                <td className="center" style={{ fontWeight: 800, color: "var(--green-light)" }}>97,55</td>
                <td className="center" style={{ fontWeight: 800, color: "var(--green-light)" }}>100,00</td>
                <td className="center" style={{ fontWeight: 800, color: "var(--green-light)" }}>98,65</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── FOTO KEGIATAN tab ────────────────────────────────────────────────────────
function TabFoto({ isPemda }) {
  const [uploaded, setUploaded] = useState({
    "0%": true,
    "50%": true,
    "100%": true,
  });
  return (
    <div>
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Foto Kegiatan</span>
          {isPemda && <button className="btn btn-primary btn-sm"><Upload size={12} /> Upload Foto</button>}
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "var(--green-bg)", border: "1px solid var(--green)", borderRadius: 8, padding: "8px 14px", marginBottom: 16, fontSize: 12, color: "var(--green-light)", fontWeight: 600 }}>
            Ruas: Batas Aceh Timur-Kota Karang Baru · Kecamatan: - · Desa: -
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {["0%", "50%", "100%"].map((label) => (
              <div key={label} style={{
                border: `2px solid ${uploaded[label] ? "var(--green)" : "var(--border)"}`,
                borderRadius: 10, overflow: "hidden", background: "var(--surface2)",
              }}>
                <div style={{ background: uploaded[label] ? "var(--green-bg)" : "var(--surface2)", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: uploaded[label] ? "var(--green-light)" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border2)" }}>
                  Progres {label}
                </div>
                {uploaded[label] ? (
                  <div style={{ height: 140, background: "linear-gradient(135deg, #1a3a2a 0%, #0d1f16 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Camera size={32} color="var(--green)" opacity={0.5} />
                  </div>
                ) : (
                  <div className="upload-zone" style={{ margin: 12, height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Upload size={20} />
                    <span>Upload foto {label}</span>
                    <span style={{ fontSize: 10, color: "var(--text-dim)" }}>Wajib: logo PU, Pemda, lokasi, STA, progres</span>
                  </div>
                )}
              </div>
            ))}
            <div style={{ border: "2px dashed var(--border)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 190, cursor: "pointer", gap: 6 }}>
              <Upload size={22} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Tambah foto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── REALISASI OUTPUT tab ─────────────────────────────────────────────────────
function TabRealisasiOutput({ kegiatan, isPemda }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div />
        <button className="btn btn-outline btn-sm">📥 Cetak Excel</button>
      </div>
      <div className="table-wrap">
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th rowSpan={2}>NO</th>
                <th rowSpan={2}>TEMATIK</th>
                <th rowSpan={2}>MENU KEGIATAN</th>
                <th rowSpan={2}>RINCIAN KEGIATAN</th>
                <th rowSpan={2}>DETAIL RINCIAN</th>
                <th rowSpan={2}>TIPE PERMUKAAN EXISTING</th>
                <th colSpan={3} className="center" style={{ borderBottom: "1px solid var(--border2)" }}>TARGET OUTPUT</th>
                <th colSpan={3} className="center" style={{ borderBottom: "1px solid var(--border2)" }}>CAPAIAN OUTPUT</th>
                <th colSpan={3} className="center" style={{ borderBottom: "1px solid var(--border2)" }}>DOKUMEN PENDUKUNG</th>
                <th rowSpan={2} className="center">VERIFIKASI</th>
                <th rowSpan={2} className="center">STATUS</th>
              </tr>
              <tr>
                <th>TIPE PERMUKAAN</th>
                <th className="right">PANJANG SESUAI RK</th>
                <th>SATUAN</th>
                <th>TIPE PERMUKAAN</th>
                <th className="right">PANJANG PENANGANAN DAK</th>
                <th>SATUAN</th>
                <th className="center">PHO</th>
                <th className="center">SPTJM</th>
                <th className="center">UPLOAD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={17} style={{ fontWeight: 700, fontSize: 11, color: "var(--accent-light)", textTransform: "uppercase", padding: "8px 14px", background: "rgba(26,127,224,0.05)" }}>
                  Penanganan Jalan (Provinsi)
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td style={{ fontSize: 11, lineHeight: 1.5 }}>{kegiatan.tipeTematik}</td>
                <td style={{ fontSize: 11 }}>01-Penanganan Jalan (Provinsi)</td>
                <td style={{ fontSize: 11 }}>01-Penanganan Long Segment</td>
                <td style={{ fontSize: 11 }}>Jl. Batas Aceh Timur - Kota Karang Baru</td>
                <td></td>
                <td></td>
                <td className="right">1.50</td>
                <td>km</td>
                <td></td>
                <td className="right">1.50</td>
                <td>km</td>
                <td className="center"><button className="btn btn-danger btn-xs"><FileText size={10} /> PDF</button></td>
                <td className="center"><button className="btn btn-danger btn-xs"><FileText size={10} /> PDF</button></td>
                <td className="center">
                  {isPemda
                    ? <button className="btn btn-primary btn-xs"><Upload size={10} /> Upload</button>
                    : <button className="btn btn-success btn-xs"><Upload size={10} /> Lihat</button>
                  }
                </td>
                <td className="center">
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, background: "var(--purple-bg)",
                    border: "2px solid var(--purple)", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: !isPemda ? "pointer" : "default", margin: "0 auto"
                  }}>
                    <CheckCircle size={13} color="var(--purple)" />
                  </div>
                </td>
                <td className="center">
                  <span className="badge badge-green">Terlaksana</span>
                </td>
              </tr>
              <tr style={{ background: "rgba(255,213,40,0.04)" }}>
                <td></td><td></td><td></td>
                <td style={{ fontSize: 11 }}>Peningkatan/Rekonstruksi</td>
                <td></td>
                <td style={{ background: "var(--yellow-bg)", textAlign: "center", fontWeight: 700, fontSize: 11, color: "var(--yellow-light)" }}>AC WC</td>
                <td style={{ background: "var(--yellow-bg)", textAlign: "center", fontWeight: 700, fontSize: 11, color: "var(--yellow-light)" }}>AC WC</td>
                <td className="right">1.50</td>
                <td>km</td>
                <td style={{ background: "var(--yellow-bg)", textAlign: "center", fontWeight: 700, fontSize: 11, color: "var(--yellow-light)" }}>AC WC</td>
                <td className="right" style={{ background: "var(--yellow-bg)", fontWeight: 700, color: "var(--yellow-light)" }}>1.50</td>
                <td></td>
                <td></td><td></td><td></td><td></td><td></td>
              </tr>
              <tr style={{ background: "var(--surface2)" }}>
                <td colSpan={7} style={{ textAlign: "right", fontWeight: 800, textTransform: "uppercase", fontSize: 12 }}>Total Jalan</td>
                <td className="right" style={{ fontWeight: 800 }}>1.50</td>
                <td></td>
                <td></td>
                <td className="right" style={{ fontWeight: 800 }}>1.50</td>
                <td colSpan={6}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── DATA KONTRAK tab ─────────────────────────────────────────────────────────
function TabDataKontrak({ kegiatan }) {
  return (
    <div>
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <div className="table-header"><span className="table-title">Paket Kegiatan</span></div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>NO.</th>
                <th>PAKET KEGIATAN</th>
                <th className="right">PAGU RK</th>
                <th className="right">NILAI KONTRAK</th>
                <th>TANGGAL KONTRAK</th>
                <th className="center">ADDENDUM</th>
                <th>ALASAN ADDENDUM</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td className="link" style={{ fontSize: 12, lineHeight: 1.5 }}>01-Penanganan Long Segment (pemeliharaan rutin, pemeliharaan berkala, peningkatan/rekonstruksi) - (Jl. Batas Aceh Timur - Kota Karang Baru)</td>
                <td className="right">12.400.000.000</td>
                <td className="right">12.212.272.000</td>
                <td>28 Jun 2024</td>
                <td className="center">0</td>
                <td style={{ color: "var(--text-muted)", fontSize: 12 }}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-card-header">
          <span style={{ fontWeight: 700, fontSize: 13 }}>Data Penyedia Jasa</span>
          <span className="badge badge-green"><CheckCircle size={11} /> Terkontrak</span>
        </div>
        <div className="detail-card-body">
          <div className="detail-row">
            <div className="detail-field"><label>Nama Penyedia</label><value style={{ fontSize: 14, fontWeight: 600 }}>PT. Cahaya Konstruksi Aceh</value></div>
            <div className="detail-field"><label>Alamat Penyedia</label><value style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Jl. T. Nyak Arief No. 12, Banda Aceh</value></div>
          </div>
          <div className="detail-row">
            <div className="detail-field"><label>Tanggal Kontrak</label><value>28 Juni 2024</value></div>
            <div className="detail-field"><label>Nomor Kontrak</label><value style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>600/PKT-01/DAK/2024</value></div>
          </div>
          <div className="detail-row">
            <div className="detail-field"><label>Nilai Kontrak (Rp)</label><value style={{ color: "var(--accent-light)", fontFamily: "var(--font-mono)" }}>12.212.272.000</value></div>
            <div className="detail-field"><label>Tanggal SPMK</label><value>01 Juli 2024</value></div>
          </div>
          <div className="detail-row">
            <div className="detail-field"><label>Masa Pelaksanaan</label><value>150 hari kalender</value></div>
            <div className="detail-field"><label>Masa Pemeliharaan</label><value>180 hari kalender</value></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DATA TENAGA KERJA tab ────────────────────────────────────────────────────
function TabTenagaKerja() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Profesional / Tenaga Ahli", val: 5, color: "var(--accent-light)", desc: "Project Manager, Site Engineer, dll" },
          { label: "Semi Profesional", val: 3, color: "var(--purple)", desc: "Mandor, Pengawas Lapangan" },
          { label: "Pekerja", val: 43, color: "var(--green-light)", desc: "Tenaga harian lapangan" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-card-sub">{s.desc}</div>
          </div>
        ))}
      </div>
      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Rincian Tenaga Kerja</span></div>
        <table>
          <thead>
            <tr>
              <th>KATEGORI</th>
              <th>JABATAN</th>
              <th className="center">JUMLAH</th>
              <th>KETERANGAN</th>
            </tr>
          </thead>
          <tbody>
            {[
              { kat: "Profesional", jabatan: "Project Manager", jml: 1, ket: "Sertifikat SKA" },
              { kat: "Profesional", jabatan: "Site Engineer", jml: 2, ket: "Sertifikat SKA" },
              { kat: "Profesional", jabatan: "Quality Control", jml: 2, ket: "Sertifikat SKT" },
              { kat: "Semi Profesional", jabatan: "Mandor", jml: 2, ket: "Pengalaman 5 tahun" },
              { kat: "Semi Profesional", jabatan: "Pengawas Lapangan", jml: 1, ket: "" },
              { kat: "Pekerja", jabatan: "Operator Alat Berat", jml: 8, ket: "" },
              { kat: "Pekerja", jabatan: "Pekerja Harian", jml: 35, ket: "Lokal setempat" },
            ].map((r, i) => (
              <tr key={i}>
                <td><span className={`badge ${r.kat === "Profesional" ? "badge-blue" : r.kat === "Semi Profesional" ? "badge-purple" : "badge-green"}`}>{r.kat}</span></td>
                <td>{r.jabatan}</td>
                <td className="center" style={{ fontWeight: 700 }}>{r.jml}</td>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.ket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── MAIN PEMDA DETAIL ────────────────────────────────────────────────────────
const TABS = [
  { id: "status", label: "Status", icon: Clock },
  { id: "kontrak", label: "Data Kontrak", icon: FileText },
  { id: "progres", label: "Data Progres", icon: TrendingUp },
  { id: "tenaga", label: "Data Tenaga Kerja", icon: Users },
  { id: "foto", label: "Foto Kegiatan", icon: Camera },
  { id: "output", label: "Realisasi Output", icon: BarChart2 },
  { id: "checklist", label: "Kelengkapan Dok.", icon: CheckSquare, highlight: true },
];

export default function PemdaDetail({ pemda, provinsi, triwulan, setPage }) {
  const [tab, setTab] = useState("checklist");
  const [isPemda, setIsPemda] = useState(false); // toggle: PEMDA view vs PFID view
  const kegiatan = sampleKegiatan["Provinsi Aceh"]?.[0] || {};

  // Count pending docs
  const docs = triwulanDocs[triwulan] || [];
  const docState = kegiatan.docs?.[triwulan] || {};
  const pendingVerif = docs.filter(d => docState[d.id]?.uploaded && !docState[d.id]?.verifiedPFID).length;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>{pemda}</h1>
          <p>Bidang Jalan · {provinsi} · {triwulan}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Mode tampilan:</span>
          <button className={`btn ${!isPemda ? "btn-primary" : "btn-outline"}`} onClick={() => setIsPemda(false)}>
            <Zap size={13} /> PFID / Pusat
          </button>
          <button className={`btn ${isPemda ? "btn-primary" : "btn-outline"}`} onClick={() => setIsPemda(true)}>
            <Users size={13} /> PEMDA
          </button>
        </div>
      </div>

      {/* Summary header */}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", padding: "14px 20px", marginBottom: 20, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Paket Kegiatan</div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>01-Penanganan Long Segment — Jl. Batas Aceh Timur-Kota Karang Baru</div>
        </div>
        {[
          { label: "Realisasi Keuangan", val: "97.55%", color: "var(--green-light)" },
          { label: "Progres Fisik", val: "98.65%", color: "var(--green-light)" },
          { label: "Status", val: "Terkontrak", badge: "badge-blue" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            {s.badge
              ? <span className={`badge ${s.badge}`}>{s.val}</span>
              : <div style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.val}</div>
            }
          </div>
        ))}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm">📄 DPA</button>
          <button className="btn btn-primary btn-sm"><Upload size={12} /> Upload DPA</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <t.icon size={13} />
            {t.label}
            {t.id === "checklist" && pendingVerif > 0 && (
              <span className="tab-badge warn">{pendingVerif}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "status" && <TabStatus kegiatan={kegiatan} />}
      {tab === "kontrak" && <TabDataKontrak kegiatan={kegiatan} />}
      {tab === "progres" && <TabProgres kegiatan={kegiatan} />}
      {tab === "tenaga" && <TabTenagaKerja />}
      {tab === "foto" && <TabFoto isPemda={isPemda} />}
      {tab === "output" && <TabRealisasiOutput kegiatan={kegiatan} isPemda={isPemda} />}
      {tab === "checklist" && <TabChecklist kegiatan={kegiatan} triwulan={triwulan} isPemda={isPemda} />}
    </div>
  );
}
