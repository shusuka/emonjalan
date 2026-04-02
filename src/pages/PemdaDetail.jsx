import { useState, useCallback } from "react";
import {
  CheckCircle, Clock, Upload, FileText, Camera, Users, TrendingUp,
  AlertCircle, Eye, BarChart2, CheckSquare, Zap, X, MessageSquare,
  Download, Send, Phone, ChevronDown, AlertTriangle, Info, Trash2,
  RefreshCw, Plus
} from "lucide-react";
import {
  sampleKegiatan, sampleKontrak, triwulanDocs, fotoPerTW,
  checklistProgresItems, formatRupiah
} from "../data/mockData";

/* ─────────── helpers ─────────── */
function getColor(pct) {
  if (pct >= 95) return "var(--green-light)";
  if (pct >= 80) return "var(--yellow-light)";
  return "var(--red-light)";
}

function ProgBar({ value, color, height = 6 }) {
  return (
    <div className="prog-bar-wrap">
      <div className="prog-bar" style={{ height }}>
        <div className="prog-fill" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
      </div>
      <span className="prog-label" style={{ color }}>{Number(value).toFixed(2)}%</span>
    </div>
  );
}

/* ─────────── Upload modal ─────────── */
function UploadModal({ label, onClose, onConfirm }) {
  const [file, setFile] = useState(null);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, width: 440, maxWidth: "90vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Upload Dokumen</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={18} /></button>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16, background: "var(--surface2)", padding: "10px 14px", borderRadius: 8 }}>{label}</div>
        <div
          className="upload-zone"
          style={{ padding: "32px 20px", marginBottom: 16, cursor: "pointer" }}
          onClick={() => document.getElementById("file-inp").click()}
        >
          <Upload size={28} style={{ marginBottom: 8, opacity: 0.5 }} />
          <div style={{ fontWeight: 600 }}>{file ? file : "Klik untuk pilih file"}</div>
          <div style={{ fontSize: 11, marginTop: 4, color: "var(--text-dim)" }}>PDF, JPG, PNG — maks 10MB</div>
          <input id="file-inp" type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0]?.name || null)} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-outline" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={() => { onConfirm(); onClose(); }}>
            <Upload size={13} /> Upload
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Crosscheck badge ─────────── */
function CrosscheckBtn({ uploaded, verifiedPFID, isPemda, catatan, onCrosscheck, onVerify }) {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState(catatan || "");
  if (!uploaded) return null;
  return (
    <div style={{ position: "relative" }}>
      {isPemda ? (
        <button
          className={`btn btn-xs ${verifiedPFID ? "btn-success" : "btn-warn"}`}
          onClick={() => setOpen(!open)}
        >
          <Eye size={11} /> Crosscheck
        </button>
      ) : (
        <button
          className={`btn btn-xs ${verifiedPFID ? "btn-success" : "btn-primary"}`}
          onClick={() => setOpen(!open)}
        >
          <CheckSquare size={11} /> {verifiedPFID ? "Terverifikasi" : "Verifikasi"}
        </button>
      )}
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 50,
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
          padding: 14, width: 280, boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            {verifiedPFID ? "✓ Dokumen Terverifikasi" : isPemda ? "Status Dokumen" : "Verifikasi Dokumen"}
          </div>
          {catatan && (
            <div style={{ fontSize: 12, background: "var(--yellow-bg)", border: "1px solid var(--yellow)", borderRadius: 6, padding: "8px 10px", marginBottom: 8, color: "var(--yellow-light)" }}>
              <strong>Catatan PFID:</strong> {catatan}
            </div>
          )}
          {!isPemda && !verifiedPFID && (
            <>
              <textarea
                value={cat}
                onChange={e => setCat(e.target.value)}
                placeholder="Catatan crosscheck (opsional)..."
                style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 12, padding: "8px 10px", resize: "vertical", minHeight: 60 }}
              />
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button className="btn btn-outline btn-xs" style={{ flex: 1 }} onClick={() => { onCrosscheck && onCrosscheck(cat, false); setOpen(false); }}>
                  <X size={11} /> Tolak
                </button>
                <button className="btn btn-success btn-xs" style={{ flex: 1 }} onClick={() => { onVerify && onVerify(cat); setOpen(false); }}>
                  <CheckCircle size={11} /> Verifikasi
                </button>
              </div>
            </>
          )}
          {(isPemda || verifiedPFID) && (
            <button className="btn btn-outline btn-xs" style={{ width: "100%", marginTop: 4 }} onClick={() => setOpen(false)}>Tutup</button>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TAB: STATUS
════════════════════════════════════════════════════════════════ */
function TabStatus({ kegiatan }) {
  const timeline = [
    { date: "2024-03-31", status: "Persiapan" },
    { date: "2024-04-30", status: "Proses Pengadaan Barang & Jasa" },
    { date: "2024-05-31", status: "Proses Pengadaan Barang & Jasa" },
    { date: "2024-06-28", status: "Terkontrak" },
    { date: "2024-07-31", status: "Terkontrak" },
    { date: "2024-08-31", status: "Terkontrak" },
    { date: "2024-09-30", status: "Terkontrak" },
    { date: "2024-10-30", status: "Terkontrak" },
    { date: "2024-11-30", status: "Terkontrak" },
    { date: "2024-12-10", status: "Terkontrak" },
  ];
  return (
    <div>
      <div className="alert alert-info">
        <AlertCircle size={14} />
        Status pengadaan terakhir: <strong>Terkontrak</strong> — diupdate 2024-12-10
      </div>
      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Riwayat Status Pengadaan</span></div>
        <div style={{ padding: "4px 0" }}>
          {timeline.map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16, padding: "10px 20px",
              borderBottom: i < timeline.length - 1 ? "1px solid var(--border2)" : "none"
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "var(--green-bg)", border: "2px solid var(--green)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <CheckCircle size={13} color="var(--green-light)" />
              </div>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{t.status}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)" }}>{t.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TAB: DATA KONTRAK
════════════════════════════════════════════════════════════════ */
function TabDataKontrak({ pemda }) {
  const kontrak = sampleKontrak["Provinsi Aceh"];
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
                <td className="link" style={{ fontSize: 12 }}>01-Penanganan Long Segment — Jl. Batas Aceh Timur - Kota Karang Baru</td>
                <td className="right">12.400.000.000</td>
                <td className="right">{formatRupiah(kontrak.nilaiKontrak)}</td>
                <td>{kontrak.tanggalKontrak}</td>
                <td className="center">0</td>
                <td style={{ color: "var(--text-muted)", fontSize: 12 }}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="detail-card" style={{ marginBottom: 20 }}>
        <div className="detail-card-header">
          <span style={{ fontWeight: 700, fontSize: 13 }}>Data Penyedia Jasa &amp; Kontrak</span>
          <span className="badge badge-blue">Terkontrak</span>
        </div>
        <div className="detail-card-body">
          <div className="detail-row">
            <div className="detail-field"><label>Nama Penyedia</label><value>{kontrak.namaPenyedia}</value></div>
            <div className="detail-field"><label>Alamat Penyedia</label><value style={{ fontSize: 13, color: "var(--text-muted)" }}>{kontrak.alamatPenyedia}</value></div>
          </div>
          <div className="detail-row">
            <div className="detail-field"><label>Nomor Kontrak</label><value style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{kontrak.nomorKontrak}</value></div>
            <div className="detail-field"><label>Tanggal Kontrak</label><value>{kontrak.tanggalKontrak}</value></div>
          </div>
          <div className="detail-row">
            <div className="detail-field"><label>Nilai Kontrak (Rp)</label><value style={{ color: "var(--accent-light)", fontFamily: "'DM Mono',monospace" }}>{formatRupiah(kontrak.nilaiKontrak)}</value></div>
            <div className="detail-field"><label>Tanggal SPMK</label><value>{kontrak.tanggalSPMK}</value></div>
          </div>
          <div className="detail-row">
            <div className="detail-field"><label>Masa Pelaksanaan</label><value>{kontrak.masaPelaksanaan} hari kalender</value></div>
            <div className="detail-field"><label>Masa Pemeliharaan</label><value>{kontrak.masaPemeliharaan} hari kalender</value></div>
          </div>
        </div>
      </div>

      {/* Tenaga kerja dari kontrak */}
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">
            <Users size={14} style={{ color: "var(--accent-light)" }} />
            Data Tenaga Kerja (dari Kontrak)
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Sumber: Dokumen Kontrak Penyedia</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>KATEGORI</th>
              <th>JABATAN</th>
              <th className="center">JUMLAH</th>
              <th>KUALIFIKASI / KETERANGAN</th>
            </tr>
          </thead>
          <tbody>
            {kontrak.tenagaKerja.map((t, i) => (
              <tr key={i}>
                <td>
                  <span className={`badge ${t.kategori === "Profesional" ? "badge-blue" : t.kategori === "Semi Profesional" ? "badge-purple" : "badge-green"}`}>
                    {t.kategori}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{t.jabatan}</td>
                <td className="center" style={{ fontWeight: 700, fontSize: 16 }}>{t.jumlah}</td>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.ket}</td>
              </tr>
            ))}
            <tr style={{ background: "var(--surface2)" }}>
              <td colSpan={2} style={{ fontWeight: 800, textAlign: "right", fontSize: 12 }}>TOTAL</td>
              <td className="center" style={{ fontWeight: 800, fontSize: 16, color: "var(--accent-light)" }}>
                {kontrak.tenagaKerja.reduce((s, t) => s + t.jumlah, 0)}
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TAB: DATA PROGRES — dengan checklist per item + upload dokumen
════════════════════════════════════════════════════════════════ */
function TabDataProgres({ kegiatan, triwulan, isPemda, docState, onDocUpload, onDocVerify }) {
  const [checks, setChecks] = useState(kegiatan.checklistItems || {});
  const [expandChecklist, setExpandChecklist] = useState(true);
  const [uploadModal, setUploadModal] = useState(null);

  // Dokumen yang relevan dengan progres, diambil dari triwulanDocs
  const docs = (triwulanDocs[triwulan] || []).filter(d =>
    d.id === "progres_keu" || d.id === "progres_keu_tw2" || d.id === "progres_keu_tw3" || d.id === "progres_keu_tw4"
  );

  // kegiatan penunjang
  const penunjang = [
    { no: 2, nama: "Penyelenggaraan rapat koordinasi di pemerintah daerah (Penugasan)", vol: 1, sat: "Frekuensi", jenis: "Swakelola", paguRK: 106765000, nilaiKontrak: 0, realisasi: 2304000, realPct: 2.16, fisik: 0 },
    { no: 3, nama: "Perjalanan dinas ke/dari lokasi kegiatan (Penugasan)", vol: 4, sat: "Frekuensi", jenis: "Swakelola", paguRK: 110000000, nilaiKontrak: 0, realisasi: 92791098, realPct: 84.36, fisik: 42 },
  ];

  return (
    <div>
      {/* ── Tabel Progres Utama ── */}
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <div className="table-header">
          <span className="table-title"><TrendingUp size={14} style={{ color: "var(--accent-light)" }} /> Data Progres Kegiatan — {triwulan}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>NO.</th>
                <th>KEGIATAN/OUTPUT</th>
                <th className="center">VOL.</th>
                <th>SATUAN</th>
                <th>PENGADAAN</th>
                <th className="right">PAGU RK (Rp)</th>
                <th className="right">NILAI KONTRAK (Rp)</th>
                <th className="right">REALISASI THD PAGU RK</th>
                <th className="center">%</th>
                <th className="center">REALISASI THD KONTRAK</th>
                <th className="center">FISIK (%)</th>
                <th className="center">CHECKLIST</th>
                <th className="center">UPLOAD DOKUMEN</th>
              </tr>
            </thead>
            <tbody>
              {/* Fisik header */}
              <tr>
                <td colSpan={13} style={{ fontWeight: 700, fontSize: 11, color: "var(--green-light)", background: "rgba(46,160,67,0.07)", padding: "7px 14px" }}>
                  KEGIATAN FISIK
                </td>
              </tr>
              {/* Kegiatan fisik utama */}
              <tr>
                <td>1</td>
                <td style={{ maxWidth: 260, fontSize: 12, lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 600 }}>{kegiatan.nama}</div>
                </td>
                <td className="center">{kegiatan.volume}</td>
                <td>{kegiatan.satuan}</td>
                <td><span className="badge badge-blue">{kegiatan.pengadaan}</span></td>
                <td className="right">{formatRupiah(kegiatan.paguRK)}</td>
                <td className="right">{formatRupiah(kegiatan.nilaiKontrak)}</td>
                <td className="right">{formatRupiah(kegiatan.realisasiRP)}</td>
                <td className="center" style={{ fontWeight: 700, color: getColor(kegiatan.realisasiPct) }}>{kegiatan.realisasiPct}</td>
                <td className="center" style={{ fontWeight: 700, color: getColor(kegiatan.realisasiKontrakPct) }}>{kegiatan.realisasiKontrakPct}</td>
                <td className="center">
                  <span className={`badge ${kegiatan.fisik === 100 ? "badge-green" : "badge-yellow"}`}>{kegiatan.fisik}%</span>
                </td>
                {/* Checklist per item */}
                <td className="center">
                  <button
                    className="btn btn-outline btn-xs"
                    onClick={() => setExpandChecklist(!expandChecklist)}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <CheckSquare size={11} />
                    {Object.values(checks).filter(Boolean).length}/{checklistProgresItems.length}
                    <ChevronDown size={10} style={{ transform: expandChecklist ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                  </button>
                </td>
                {/* Upload dokumen */}
                <td className="center">
                  {docs.length > 0 && docs.map(doc => {
                    const d = docState[doc.id] || {};
                    return (
                      <div key={doc.id} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                        {d.uploaded ? (
                          <CrosscheckBtn
                            uploaded={d.uploaded}
                            verifiedPFID={d.verifiedPFID}
                            isPemda={isPemda}
                            catatan={d.catatan}
                            onVerify={(cat) => onDocVerify(doc.id, cat)}
                            onCrosscheck={(cat, ok) => { }}
                          />
                        ) : isPemda ? (
                          <button className="btn btn-primary btn-xs" onClick={() => setUploadModal(doc)}>
                            <Upload size={11} /> Upload Progres
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Belum diupload</span>
                        )}
                      </div>
                    );
                  })}
                </td>
              </tr>

              {/* Expanded checklist per item kegiatan */}
              {expandChecklist && (
                <tr>
                  <td colSpan={13} style={{ padding: 0, background: "var(--surface2)" }}>
                    <div style={{ padding: "12px 20px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                        Checklist Kepatuhan Kegiatan Fisik
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 8 }}>
                        {checklistProgresItems.map(item => (
                          <label key={item.id} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            background: "var(--surface)", border: `1px solid ${checks[item.id] ? "var(--green)" : "var(--border)"}`,
                            borderRadius: 8, padding: "9px 12px", cursor: isPemda ? "default" : "pointer",
                            transition: "border-color 0.15s"
                          }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                              background: checks[item.id] ? "var(--green-bg)" : "transparent",
                              border: `1.5px solid ${checks[item.id] ? "var(--green)" : "var(--border)"}`,
                              display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                              {checks[item.id] && <CheckCircle size={13} color="var(--green-light)" />}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: checks[item.id] ? "var(--text)" : "var(--text-muted)" }}>
                              {item.label}
                            </span>
                            {!isPemda && (
                              <input
                                type="checkbox"
                                checked={!!checks[item.id]}
                                onChange={e => setChecks(s => ({ ...s, [item.id]: e.target.checked }))}
                                style={{ display: "none" }}
                              />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {/* Penunjang header */}
              <tr>
                <td colSpan={13} style={{ fontWeight: 700, fontSize: 11, color: "var(--accent-light)", background: "rgba(26,127,224,0.05)", padding: "7px 14px" }}>
                  KEGIATAN PENUNJANG
                </td>
              </tr>
              {penunjang.map(p => (
                <tr key={p.no}>
                  <td>{p.no}</td>
                  <td style={{ fontSize: 12, maxWidth: 260 }}>{p.nama}</td>
                  <td className="center">{p.vol}</td>
                  <td>{p.sat}</td>
                  <td><span className="badge badge-purple">{p.jenis}</span></td>
                  <td className="right">{formatRupiah(p.paguRK)}</td>
                  <td className="right">0</td>
                  <td className="right">{formatRupiah(p.realisasi)}</td>
                  <td className="center" style={{ color: getColor(p.realPct), fontWeight: 700 }}>{p.realPct}</td>
                  <td className="center">0</td>
                  <td className="center">{p.fisik}</td>
                  <td className="center">-</td>
                  <td className="center">-</td>
                </tr>
              ))}

              {/* Total */}
              <tr style={{ background: "var(--surface2)", borderTop: "2px solid var(--border)" }}>
                <td colSpan={5} style={{ textAlign: "right", fontWeight: 800, textTransform: "uppercase", fontSize: 12 }}>TOTAL</td>
                <td className="right" style={{ fontWeight: 800 }}>12.616.765.000</td>
                <td className="right" style={{ fontWeight: 800 }}>12.212.272.000</td>
                <td className="right" style={{ fontWeight: 800 }}>12.307.367.098</td>
                <td className="center" style={{ fontWeight: 800, color: "var(--green-light)" }}>97,55</td>
                <td className="center" style={{ fontWeight: 800, color: "var(--green-light)" }}>100,00</td>
                <td className="center" style={{ fontWeight: 800, color: "var(--green-light)" }}>98,65</td>
                <td /><td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {uploadModal && (
        <UploadModal
          label={uploadModal.label}
          onClose={() => setUploadModal(null)}
          onConfirm={() => { onDocUpload(uploadModal.id); setUploadModal(null); }}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TAB: FOTO KEGIATAN — sesuai TW
════════════════════════════════════════════════════════════════ */
function TabFoto({ kegiatan, triwulan, isPemda }) {
  const fotoDefs = fotoPerTW[triwulan] || [];
  const fotoState = kegiatan.foto?.[triwulan] || {};
  const [local, setLocal] = useState(fotoState);
  const [uploadModal, setUploadModal] = useState(null);

  return (
    <div>
      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        <Info size={14} />
        Foto untuk <strong>{triwulan}</strong>: {fotoDefs.map(f => f.label).join(", ")}.
        Setiap foto wajib memuat logo PU, logo Pemda, keterangan lokasi, STA, dan progres pekerjaan.
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title"><Camera size={14} style={{ color: "var(--accent-light)" }} /> Foto Kegiatan — {triwulan}</span>
          {isPemda && (
            <button className="btn btn-primary btn-sm" onClick={() => setUploadModal({ label: "Foto Kegiatan" })}>
              <Upload size={12} /> Upload Foto
            </button>
          )}
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "var(--surface2)", border: "1px solid var(--green)", borderRadius: 8, padding: "8px 14px", marginBottom: 16, fontSize: 12, color: "var(--green-light)", fontWeight: 600 }}>
            Ruas: {kegiatan.ruas} · Kecamatan: {kegiatan.kecamatan} · Desa: {kegiatan.desa}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${fotoDefs.length + 1}, 1fr)`, gap: 14 }}>
            {fotoDefs.map(foto => {
              const state = local[foto.id] || {};
              return (
                <div key={foto.id} style={{
                  border: `2px solid ${state.uploaded ? "var(--green)" : foto.wajib ? "var(--yellow)" : "var(--border)"}`,
                  borderRadius: 10, overflow: "hidden", background: "var(--surface2)"
                }}>
                  <div style={{
                    padding: "8px 12px", fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    background: state.uploaded ? "var(--green-bg)" : foto.wajib ? "var(--yellow-bg)" : "var(--surface2)",
                    color: state.uploaded ? "var(--green-light)" : foto.wajib ? "var(--yellow-light)" : "var(--text-muted)",
                    borderBottom: "1px solid var(--border2)", display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <span>{foto.label}</span>
                    {foto.wajib && <span style={{ fontSize: 9, background: "var(--red-bg)", color: "var(--red-light)", padding: "2px 6px", borderRadius: 99 }}>WAJIB</span>}
                  </div>
                  {state.uploaded ? (
                    <div style={{ height: 140, background: "linear-gradient(135deg, #1a3a2a 0%, #0d1f16 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Camera size={32} color="var(--green)" opacity={0.5} />
                      <span style={{ fontSize: 11, color: "var(--green-light)" }}>Terupload</span>
                    </div>
                  ) : (
                    <div
                      className="upload-zone"
                      style={{ margin: 12, height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: isPemda ? "pointer" : "default" }}
                      onClick={() => isPemda && setUploadModal(foto)}
                    >
                      {isPemda ? (
                        <>
                          <Upload size={20} />
                          <span>Upload {foto.label}</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Belum diupload</span>
                      )}
                    </div>
                  )}
                  <div style={{ padding: "8px 12px", borderTop: "1px solid var(--border2)" }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{foto.desc}</div>
                    {/* Crosscheck PFID */}
                    {state.uploaded && (
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <CrosscheckBtn
                          uploaded={state.uploaded}
                          verifiedPFID={state.verified}
                          isPemda={isPemda}
                          catatan={state.catatan}
                          onVerify={() => setLocal(s => ({ ...s, [foto.id]: { ...s[foto.id], verified: true } }))}
                        />
                      </div>
                    )}
                    {state.catatan && (
                      <div style={{ fontSize: 11, background: "var(--yellow-bg)", color: "var(--yellow-light)", borderRadius: 5, padding: "5px 8px", marginTop: 6 }}>
                        ⚠ {state.catatan}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Add photo slot */}
            <div style={{
              border: "2px dashed var(--border)", borderRadius: 10,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 200, cursor: "pointer", gap: 6, opacity: 0.6
            }}>
              <Plus size={22} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Tambah foto</span>
            </div>
          </div>
        </div>
      </div>

      {uploadModal && (
        <UploadModal
          label={uploadModal.label || "Foto Kegiatan"}
          onClose={() => setUploadModal(null)}
          onConfirm={() => {
            if (uploadModal.id) setLocal(s => ({ ...s, [uploadModal.id]: { ...(s[uploadModal.id] || {}), uploaded: true } }));
            setUploadModal(null);
          }}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TAB: REALISASI OUTPUT — dengan opsi status & catatan
════════════════════════════════════════════════════════════════ */
const STATUS_OUTPUT_OPTIONS = [
  { value: "Terlaksana", color: "var(--green-light)", bg: "var(--green-bg)", border: "var(--green)" },
  { value: "Terkendala", color: "var(--yellow-light)", bg: "var(--yellow-bg)", border: "var(--yellow)" },
  { value: "Tidak Terlaksana", color: "var(--red-light)", bg: "var(--red-bg)", border: "var(--red)" },
];

function TabRealisasiOutput({ kegiatan, isPemda }) {
  const [statusOutput, setStatusOutput] = useState(kegiatan.statusOutput || "Terlaksana");
  const [catatan, setCatatan] = useState(kegiatan.catatanOutput || "");
  const [verifikasi, setVerifikasi] = useState(kegiatan.verifikasiOutput || false);
  const [editCatatan, setEditCatatan] = useState(false);

  const statusOpt = STATUS_OUTPUT_OPTIONS.find(s => s.value === statusOutput) || STATUS_OUTPUT_OPTIONS[0];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, gap: 8 }}>
        <button className="btn btn-outline btn-sm">📥 Cetak Excel</button>
      </div>
      <div className="table-wrap" style={{ marginBottom: 20 }}>
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
                <th colSpan={3} className="center" style={{ borderBottom: "1px solid var(--border2)" }}>DOKUMEN</th>
                <th rowSpan={2} className="center">VERIFIKASI</th>
                <th rowSpan={2} className="center" style={{ minWidth: 160 }}>STATUS VERIFIKATOR</th>
                <th rowSpan={2} className="center">CROSSCHECK</th>
              </tr>
              <tr>
                <th>TIPE PERMUKAAN</th>
                <th className="right">PANJANG SESUAI RK</th>
                <th>SATUAN</th>
                <th>TIPE PERMUKAAN</th>
                <th className="right">PANJANG DAK</th>
                <th>SATUAN</th>
                <th className="center">PHO</th>
                <th className="center">SPTJM</th>
                <th className="center">UPLOAD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={19} style={{ fontWeight: 700, fontSize: 11, color: "var(--accent-light)", background: "rgba(26,127,224,0.05)", padding: "7px 14px" }}>
                  Penanganan Jalan (Provinsi)
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td style={{ fontSize: 11, lineHeight: 1.5 }}>{kegiatan.tipeTematik}</td>
                <td style={{ fontSize: 11 }}>{kegiatan.menuKegiatan}</td>
                <td style={{ fontSize: 11 }}>{kegiatan.rincianKegiatan}</td>
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
                    : <button className="btn btn-success btn-xs"><Eye size={10} /> Lihat</button>
                  }
                </td>
                {/* Verifikasi checkbox */}
                <td className="center">
                  <div
                    style={{
                      width: 24, height: 24, borderRadius: 6, margin: "0 auto",
                      background: verifikasi ? "var(--purple-bg)" : "transparent",
                      border: `2px solid ${verifikasi ? "var(--purple)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: !isPemda ? "pointer" : "default"
                    }}
                    onClick={() => !isPemda && setVerifikasi(!verifikasi)}
                  >
                    {verifikasi && <CheckCircle size={14} color="var(--purple)" />}
                  </div>
                </td>
                {/* Status verifikator dengan dropdown */}
                <td className="center">
                  {isPemda ? (
                    <span className={`badge ${statusOutput === "Terlaksana" ? "badge-green" : statusOutput === "Terkendala" ? "badge-yellow" : "badge-red"}`}>
                      {statusOutput}
                    </span>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                      <select
                        value={statusOutput}
                        onChange={e => setStatusOutput(e.target.value)}
                        style={{
                          background: statusOpt.bg, color: statusOpt.color,
                          border: `1px solid ${statusOpt.border}`, borderRadius: 6,
                          padding: "4px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer",
                          appearance: "none", textAlign: "center"
                        }}
                      >
                        {STATUS_OUTPUT_OPTIONS.map(s => (
                          <option key={s.value} value={s.value} style={{ background: "var(--surface2)", color: "var(--text)" }}>{s.value}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </td>
                {/* Crosscheck */}
                <td className="center">
                  <CrosscheckBtn uploaded={true} verifiedPFID={verifikasi} isPemda={isPemda} catatan={catatan} onVerify={() => setVerifikasi(true)} />
                </td>
              </tr>

              {/* Sub-row peningkatan */}
              <tr style={{ background: "rgba(255,213,40,0.04)" }}>
                <td colSpan={4} />
                <td style={{ fontSize: 11 }}>Peningkatan/Rekonstruksi</td>
                <td style={{ background: "var(--yellow-bg)", textAlign: "center", fontWeight: 700, fontSize: 11, color: "var(--yellow-light)" }}>AC WC</td>
                <td style={{ background: "var(--yellow-bg)", textAlign: "center", fontWeight: 700, fontSize: 11, color: "var(--yellow-light)" }}>AC WC</td>
                <td className="right">1.50</td>
                <td>km</td>
                <td style={{ background: "var(--yellow-bg)", textAlign: "center", fontWeight: 700, fontSize: 11, color: "var(--yellow-light)" }}>AC WC</td>
                <td className="right" style={{ background: "var(--yellow-bg)", fontWeight: 700, color: "var(--yellow-light)" }}>1.50</td>
                <td colSpan={8}></td>
              </tr>

              <tr style={{ background: "var(--surface2)" }}>
                <td colSpan={7} style={{ textAlign: "right", fontWeight: 800, textTransform: "uppercase", fontSize: 12 }}>Total Jalan</td>
                <td className="right" style={{ fontWeight: 800 }}>1.50</td>
                <td></td>
                <td></td>
                <td className="right" style={{ fontWeight: 800 }}>1.50</td>
                <td colSpan={8}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Catatan Verifikator */}
      {!isPemda && (
        <div className="detail-card">
          <div className="detail-card-header">
            <span style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={14} color="var(--accent-light)" /> Catatan Verifikator PFID
            </span>
            <button className="btn btn-outline btn-xs" onClick={() => setEditCatatan(!editCatatan)}>
              {editCatatan ? "Simpan" : "Edit Catatan"}
            </button>
          </div>
          <div style={{ padding: 16 }}>
            {editCatatan ? (
              <textarea
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                placeholder="Tulis catatan hasil verifikasi realisasi output..."
                style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "10px 14px", resize: "vertical", minHeight: 80 }}
              />
            ) : (
              <div style={{ fontSize: 13, color: catatan ? "var(--text)" : "var(--text-muted)", fontStyle: catatan ? "normal" : "italic" }}>
                {catatan || "Belum ada catatan."}
              </div>
            )}
          </div>
        </div>
      )}

      {isPemda && catatan && (
        <div className="alert alert-warn">
          <AlertTriangle size={14} />
          <div>
            <strong>Catatan dari PFID:</strong> {catatan}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   TAB: KELENGKAPAN DOKUMEN — checklist + laporan Word + kirim WA
════════════════════════════════════════════════════════════════ */
function TabKelengkapan({ kegiatan, triwulan, isPemda, pemda, pemda_info, docState, onDocUpload, onDocVerify }) {
  const docs = triwulanDocs[triwulan] || [];
  const [local, setLocal] = useState(docState);
  const [uploadModal, setUploadModal] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const uploaded = docs.filter(d => local[d.id]?.uploaded).length;
  const verified = docs.filter(d => local[d.id]?.verifiedPFID).length;
  const required = docs.filter(d => d.required);
  const reqDone = required.filter(d => local[d.id]?.uploaded).length;
  const pct = docs.length ? Math.round((uploaded / docs.length) * 100) : 0;

  // Dokumen bermasalah (tidak sesuai / belum upload)
  const notOk = docs.filter(d => {
    const s = local[d.id] || {};
    return (d.required && !s.uploaded) || (s.uploaded && !s.verifiedPFID && s.catatan);
  });

  function handleUpload(id) {
    setLocal(s => ({ ...s, [id]: { ...(s[id] || {}), uploaded: true, verifiedPFID: false } }));
    onDocUpload && onDocUpload(id);
  }
  function handleVerify(id, cat) {
    const today = new Date().toISOString().split("T")[0];
    setLocal(s => ({ ...s, [id]: { ...(s[id] || {}), verifiedPFID: true, tanggalVerif: today, catatan: cat || "" } }));
    onDocVerify && onDocVerify(id, cat);
  }
  function handleReject(id, cat) {
    setLocal(s => ({ ...s, [id]: { ...(s[id] || {}), verifiedPFID: false, catatan: cat } }));
  }

  function generateReport() {
    setGeneratingReport(true);
    setTimeout(() => { setGeneratingReport(false); setReportGenerated(true); }, 1800);
  }

  const waNumber = pemda_info?.noHPOPD?.replace(/^0/, "62") || "";
  const waMsg = encodeURIComponent(
    `Yth. ${pemda_info?.namaOPD || pemda}\n\nBersama ini kami sampaikan hasil monitoring kelengkapan dokumen DAK Bidang Jalan ${triwulan} dari PFID Kementerian PUPR.\n\nTerdapat ${notOk.length} dokumen yang perlu ditindaklanjuti. Mohon segera melengkapi dokumen yang belum sesuai.\n\nDetail terlampir. Terima kasih.`
  );

  return (
    <div>
      {/* ── Summary cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Dokumen Diupload", val: `${uploaded}/${docs.length}`, color: "var(--accent-light)" },
          { label: "Terverifikasi PFID", val: `${verified}/${docs.length}`, color: verified === docs.length ? "var(--green-light)" : "var(--yellow-light)" },
          { label: "Wajib Terpenuhi", val: `${reqDone}/${required.length}`, color: reqDone === required.length ? "var(--green-light)" : "var(--red-light)" },
          { label: "Belum Sesuai", val: notOk.length, color: notOk.length === 0 ? "var(--green-light)" : "var(--red-light)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
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

      {/* Checklist panel */}
      <div className="checklist-panel" style={{ marginBottom: 24 }}>
        <div className="checklist-header">
          <span className="checklist-title">
            <FileText size={14} color="var(--accent-light)" />
            Kelengkapan Dokumen — {triwulan}
          </span>
          {!isPemda && uploaded > 0 && (
            <button className="btn btn-success btn-sm">
              <CheckSquare size={12} /> Verifikasi Semua Sekaligus
            </button>
          )}
        </div>

        {docs.map(doc => {
          const d = local[doc.id] || {};
          return (
            <div className="checklist-item" key={doc.id}>
              {/* Status icon */}
              <div className={`check-icon ${d.verifiedPFID ? "verified" : d.uploaded ? "done" : "empty"}`}>
                {d.verifiedPFID ? <CheckCircle size={12} /> : d.uploaded ? <CheckCircle size={12} /> : null}
              </div>

              {/* Label + meta */}
              <div className="check-info">
                <div className="check-label">
                  {doc.label}
                  {doc.required && <span className="check-required"> *wajib</span>}
                </div>
                <div className="check-meta" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 3 }}>
                  {d.verifiedPFID && <span className="pfid-stamp pfid-verified">✓ Diverifikasi PFID {d.tanggalVerif}</span>}
                  {!d.verifiedPFID && d.uploaded && !d.catatan && <span className="pfid-stamp pfid-pending">⏳ Menunggu verifikasi PFID</span>}
                  {!d.verifiedPFID && d.uploaded && d.catatan && <span className="pfid-stamp" style={{ background: "var(--yellow-bg)", color: "var(--yellow-light)", border: "1px solid var(--yellow)", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>⚠ Tidak sesuai</span>}
                  {!d.uploaded && <span className="pfid-stamp pfid-none">Belum diupload</span>}
                  {doc.keterangan && <span style={{ fontSize: 11, color: "var(--text-dim)" }}>· {doc.keterangan}</span>}
                </div>
                {d.catatan && (
                  <div style={{ fontSize: 12, color: "var(--yellow-light)", background: "var(--yellow-bg)", borderRadius: 6, padding: "6px 10px", marginTop: 6, border: "1px solid rgba(210,153,34,0.3)" }}>
                    <strong>Catatan PFID:</strong> {d.catatan}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="check-actions">
                {d.uploaded && <button className="btn btn-outline btn-xs"><Eye size={11} /> Lihat</button>}

                {/* Upload button (PEMDA only) */}
                {isPemda && !d.uploaded && (
                  <button className="btn btn-primary btn-xs" onClick={() => setUploadModal(doc)}>
                    <Upload size={11} /> Upload
                  </button>
                )}
                {isPemda && d.uploaded && !d.verifiedPFID && (
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Menunggu PFID</span>
                )}

                {/* Crosscheck button (PFID only) */}
                {!isPemda && d.uploaded && (
                  <CrosscheckBtn
                    uploaded={d.uploaded}
                    verifiedPFID={d.verifiedPFID}
                    isPemda={isPemda}
                    catatan={d.catatan}
                    onVerify={(cat) => handleVerify(doc.id, cat)}
                    onCrosscheck={(cat) => handleReject(doc.id, cat)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ════ LAPORAN HASIL VERIFIKASI ════ */}
      <div style={{ borderTop: "2px dashed var(--border)", paddingTop: 24, marginTop: 8 }}>
        <div className="section-title">
          <FileText size={14} />
          Laporan Hasil Verifikasi PFID
        </div>

        {notOk.length === 0 ? (
          <div style={{ background: "var(--green-bg)", border: "1px solid var(--green)", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <CheckCircle size={20} color="var(--green-light)" />
            <div>
              <div style={{ fontWeight: 700, color: "var(--green-light)" }}>Semua dokumen sudah sesuai</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Tidak ada dokumen yang perlu ditindaklanjuti untuk {triwulan}</div>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <div style={{ background: "var(--red-bg)", border: "1px solid var(--red)", borderRadius: 10, padding: "14px 20px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: "var(--red-light)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={16} /> {notOk.length} Dokumen Belum Sesuai
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {notOk.map((doc, i) => {
                  const d = local[doc.id] || {};
                  return (
                    <div key={doc.id} style={{ fontSize: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "var(--red-light)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                      <span>
                        <strong>{doc.label}</strong>
                        {d.catatan && <span style={{ color: "var(--text-muted)" }}> — {d.catatan}</span>}
                        {!d.uploaded && <span style={{ color: "var(--red-light)" }}> — Belum diupload</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Generate report buttons */}
        {!isPemda && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              onClick={generateReport}
              disabled={generatingReport}
              style={{ display: "flex", alignItems: "center", gap: 7 }}
            >
              {generatingReport ? <RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={13} />}
              {generatingReport ? "Membuat laporan..." : "Generate Laporan Word"}
            </button>

            {reportGenerated && (
              <>
                <span style={{ fontSize: 12, color: "var(--green-light)", display: "flex", alignItems: "center", gap: 5 }}>
                  <CheckCircle size={13} /> Laporan_Verifikasi_{triwulan}_{pemda?.replace(/\s/g, "_")}.docx siap
                </span>
                <button className="btn btn-success btn-sm">
                  <Download size={12} /> Download
                </button>
                {pemda_info?.noHPOPD && (
                  <a
                    href={`https://wa.me/${waNumber}?text=${waMsg}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm"
                    style={{ background: "#25D366", color: "#fff", border: "none", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Phone size={12} /> Kirim via WhatsApp
                    <span style={{ fontSize: 10, opacity: 0.8 }}>({pemda_info.noHPOPD})</span>
                  </a>
                )}
              </>
            )}
          </div>
        )}

        {reportGenerated && !isPemda && (
          <div className="alert alert-info" style={{ marginTop: 14 }}>
            <Info size={14} />
            Laporan memuat daftar dokumen yang belum sesuai beserta catatan PFID. Link WhatsApp akan membuka pesan otomatis ke nomor HP OPD ({pemda_info?.namaOPD}).
          </div>
        )}
      </div>

      {uploadModal && (
        <UploadModal
          label={uploadModal.label}
          onClose={() => setUploadModal(null)}
          onConfirm={() => { handleUpload(uploadModal.id); setUploadModal(null); }}
        />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PEMDA DETAIL
════════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "status", label: "Status", icon: Clock },
  { id: "kontrak", label: "Data Kontrak", icon: FileText },
  { id: "progres", label: "Data Progres", icon: TrendingUp },
  { id: "foto", label: "Foto Kegiatan", icon: Camera },
  { id: "output", label: "Realisasi Output", icon: BarChart2 },
  { id: "kelengkapan", label: "Kelengkapan Dok.", icon: CheckSquare, highlight: true },
];

export default function PemdaDetail({ pemda, provinsi, triwulan, setPage }) {
  const [tab, setTab] = useState("kelengkapan");
  const [isPemda, setIsPemda] = useState(false);
  const kegiatan = sampleKegiatan["Provinsi Aceh"]?.[0] || {};
  const pemda_info = { namaOPD: "Dinas PUPR Provinsi Aceh", noHPOPD: "6281234567890" };

  // Shared doc state (lifted up)
  const [docState, setDocState] = useState(kegiatan.docs?.[triwulan] || {});

  function onDocUpload(id) {
    setDocState(s => ({ ...s, [id]: { ...(s[id] || {}), uploaded: true, verifiedPFID: false } }));
  }
  function onDocVerify(id, cat) {
    const today = new Date().toISOString().split("T")[0];
    setDocState(s => ({ ...s, [id]: { ...(s[id] || {}), verifiedPFID: true, tanggalVerif: today, catatan: cat || s[id]?.catatan || "" } }));
  }

  // Count pending for badge
  const docs = triwulanDocs[triwulan] || [];
  const pendingVerif = docs.filter(d => docState[d.id]?.uploaded && !docState[d.id]?.verifiedPFID).length;
  const belumUpload = docs.filter(d => d.required && !docState[d.id]?.uploaded).length;

  return (
    <div>
      {/* Page header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>{pemda}</h1>
          <p>Bidang Jalan · {provinsi} · {triwulan}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>TAMPILAN:</span>
          <button className={`btn btn-sm ${!isPemda ? "btn-primary" : "btn-outline"}`} onClick={() => setIsPemda(false)}>
            <Zap size={12} /> PFID / Pusat
          </button>
          <button className={`btn btn-sm ${isPemda ? "btn-primary" : "btn-outline"}`} onClick={() => setIsPemda(true)}>
            <Users size={12} /> PEMDA
          </button>
        </div>
      </div>

      {/* Kegiatan summary */}
      <div style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--radius-lg)", padding: "14px 20px", marginBottom: 20, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Paket Kegiatan Aktif</div>
          <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.5 }}>01 — Penanganan Long Segment Jl. Batas Aceh Timur - Kota Karang Baru</div>
        </div>
        {[
          { label: "Realisasi Keuangan", val: "97.55%", color: "var(--green-light)" },
          { label: "Progres Fisik", val: "98.65%", color: "var(--green-light)" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: s.color }}>{s.val}</div>
          </div>
        ))}
        <span className="badge badge-blue" style={{ padding: "5px 14px", fontSize: 12 }}>Terkontrak</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-outline btn-sm">📄 DPA</button>
          {isPemda && <button className="btn btn-primary btn-sm"><Upload size={12} /> Upload DPA</button>}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <t.icon size={13} />
            {t.label}
            {t.id === "kelengkapan" && (pendingVerif > 0 || belumUpload > 0) && (
              <span className="tab-badge warn">{pendingVerif + belumUpload}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "status" && <TabStatus kegiatan={kegiatan} />}
      {tab === "kontrak" && <TabDataKontrak pemda={pemda} />}
      {tab === "progres" && (
        <TabDataProgres
          kegiatan={kegiatan} triwulan={triwulan} isPemda={isPemda}
          docState={docState} onDocUpload={onDocUpload} onDocVerify={onDocVerify}
        />
      )}
      {tab === "foto" && <TabFoto kegiatan={kegiatan} triwulan={triwulan} isPemda={isPemda} />}
      {tab === "output" && <TabRealisasiOutput kegiatan={kegiatan} isPemda={isPemda} />}
      {tab === "kelengkapan" && (
        <TabKelengkapan
          kegiatan={kegiatan} triwulan={triwulan} isPemda={isPemda}
          pemda={pemda} pemda_info={pemda_info}
          docState={docState} onDocUpload={onDocUpload} onDocVerify={onDocVerify}
        />
      )}
    </div>
  );
}
