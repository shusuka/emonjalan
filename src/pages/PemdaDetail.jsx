import { useState } from "react";
import {
  CheckCircle, Clock, Upload, FileText, Camera, TrendingUp,
  AlertCircle, Eye, BarChart2, CheckSquare, Zap, X, MessageSquare,
  Download, Phone, ChevronDown, AlertTriangle, Info, RefreshCw, Plus,
  Lock, Link2, Play, Users
} from "lucide-react";
import {
  sampleKegiatan, sampleKontrak, sampleStatusHistory,
  DOCS_KONTRAK, DOCS_PASCA_KONTRAK_PER_TW,
  FOTO_SLOTS, PDF_DOK_SLOTS,
  checklistProgresItems, STATUS_PENGADAAN, formatRupiah
} from "../data/mockData";
import {
  TabStatus, CrosscheckBtn, DocRow, UploadModal, VideoLinkModal,
  getColor, isTerkontrak, getStatusColor, S
} from "./PemdaHelpers";

/* ════════════════════════════════════════════
   TAB: DATA KONTRAK
   - Info kontrak + tenaga kerja
   - Jika terkontrak: upload semua DOCS_KONTRAK + DOCS_PASCA_KONTRAK_PER_TW
   - DPA hanya di Data Progres
════════════════════════════════════════════ */
function TabDataKontrak({ isPemda, terkontrak, triwulan, docState, onDocChange }) {
  const kontrak = sampleKontrak["Provinsi Aceh"];

  // Gabungkan dokumen kontrak + pasca kontrak per TW
  const docsKontrak = DOCS_KONTRAK;
  const docsPascaSemua = DOCS_PASCA_KONTRAK_PER_TW.SEMUA;
  const docsPascaTW = DOCS_PASCA_KONTRAK_PER_TW[triwulan] || [];
  // TW1 memiliki kurva_s_tw1 tapi DPA pindah ke Data Progres — filter dpa_tw1 keluar
  const allUploadDocs = terkontrak
    ? [...docsKontrak, ...docsPascaSemua, ...docsPascaTW.filter(d => d.id !== "dpa_tw1")]
    : [];

  return (
    <div>
      {!terkontrak && (
        <div className="alert alert-warn" style={{ marginBottom: 20 }}>
          <Lock size={14} /> Upload dokumen kontrak baru tersedia setelah status <strong>Terkontrak</strong>. Silakan update status pengadaan di tab Status.
        </div>
      )}

      {/* Info kontrak */}
      <div className="detail-card" style={{ marginBottom: 20 }}>
        <div className="detail-card-header">
          <span style={{ fontWeight: 700, fontSize: 13 }}>Data Penyedia &amp; Kontrak</span>
          <span className={`badge ${terkontrak ? "badge-green" : "badge-yellow"}`}>
            {terkontrak ? "Terkontrak" : "Belum Kontrak"}
          </span>
        </div>
        <div className="detail-card-body">
          {terkontrak ? (
            <>
              <div className="detail-row">
                <div className="detail-field"><label>Nama Penyedia</label><value>{kontrak.namaPenyedia}</value></div>
                <div className="detail-field"><label>Alamat Penyedia</label><value style={{ fontSize: 13, color: S.muted }}>{kontrak.alamatPenyedia}</value></div>
              </div>
              <div className="detail-row">
                <div className="detail-field"><label>Nomor Kontrak</label><value style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{kontrak.nomorKontrak}</value></div>
                <div className="detail-field"><label>Tanggal Kontrak</label><value>{kontrak.tanggalKontrak}</value></div>
              </div>
              <div className="detail-row">
                <div className="detail-field"><label>Nilai Kontrak (Rp)</label><value style={{ color: S.accent, fontFamily: "'DM Mono',monospace" }}>{formatRupiah(kontrak.nilaiKontrak)}</value></div>
                <div className="detail-field"><label>Tanggal SPMK</label><value>{kontrak.tanggalSPMK}</value></div>
              </div>
              <div className="detail-row">
                <div className="detail-field"><label>Masa Pelaksanaan</label><value>{kontrak.masaPelaksanaan} hari kalender</value></div>
                <div className="detail-field"><label>Masa Pemeliharaan</label><value>{kontrak.masaPemeliharaan} hari kalender</value></div>
              </div>
            </>
          ) : (
            <div style={{ color: S.muted, fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              Data kontrak tersedia setelah status Terkontrak
            </div>
          )}
        </div>
      </div>

      {/* Tenaga Kerja (dari kontrak) */}
      {terkontrak && (
        <div className="table-wrap" style={{ marginBottom: 20 }}>
          <div className="table-header">
            <span className="table-title"><Users size={14} style={{ color: S.accent }} /> Data Tenaga Kerja (dari Kontrak)</span>
            <span style={{ fontSize: 11, color: S.muted }}>Sumber: Dokumen Kontrak Penyedia</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>KATEGORI</th>
                <th>JABATAN</th>
                <th className="center">JUMLAH</th>
                <th>KUALIFIKASI</th>
              </tr>
            </thead>
            <tbody>
              {kontrak.tenagaKerja.map((t, i) => (
                <tr key={i}>
                  <td><span className={`badge ${t.kategori === "Profesional" ? "badge-blue" : t.kategori === "Semi Profesional" ? "badge-purple" : "badge-green"}`}>{t.kategori}</span></td>
                  <td style={{ fontWeight: 500 }}>{t.jabatan}</td>
                  <td className="center" style={{ fontWeight: 700, fontSize: 16 }}>{t.jumlah}</td>
                  <td style={{ fontSize: 12, color: S.muted }}>{t.ket}</td>
                </tr>
              ))}
              <tr style={{ background: S.surface2 }}>
                <td colSpan={2} style={{ textAlign: "right", fontWeight: 800, fontSize: 12 }}>TOTAL</td>
                <td className="center" style={{ fontWeight: 800, fontSize: 16, color: S.accent }}>
                  {kontrak.tenagaKerja.reduce((s, t) => s + t.jumlah, 0)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Dokumen kontrak upload */}
      {terkontrak && (
        <div>
          <div className="section-title">
            <FileText size={13} />
            Kelengkapan Dokumen Kontrak — {triwulan}
          </div>
          <div className="checklist-panel">
            <div className="checklist-header">
              <span className="checklist-title">
                <FileText size={14} color={S.accent} />
                Upload Dokumen Kontrak &amp; Administrasi
              </span>
            </div>
            {allUploadDocs.map(doc => {
              const st = docState[doc.id] || {};
              return (
                <DocRow key={doc.id} doc={doc} state={st} isPemda={isPemda}
                  onUpload={() => onDocChange(doc.id, { uploaded: true, verifiedPFID: false, catatan: "" })}
                  onVerify={() => onDocChange(doc.id, { ...st, verifiedPFID: true, tanggalVerif: new Date().toISOString().split("T")[0] })}
                  onReject={(cat) => onDocChange(doc.id, { ...st, verifiedPFID: false, catatan: cat })}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   TAB: DATA PROGRES
   - Tabel progres + checklist per item
   - Upload DPA (hanya di sini)
   - Upload data progres keuangan & fisik
════════════════════════════════════════════ */
function TabDataProgres({ isPemda, terkontrak, triwulan, kegiatan, docState, onDocChange }) {
  const [checks, setChecks] = useState(kegiatan.checklistItems || {});
  const [expandChk, setExpandChk] = useState(false);
  const [dpaState, setDpaState] = useState({ uploaded: false, verified: false });
  const [progresModal, setProgresModal] = useState(false);

  const penunjang = [
    { no: 2, nama: "Penyelenggaraan rapat koordinasi di pemerintah daerah (Penugasan)", vol: 1, sat: "Frekuensi", jenis: "Swakelola", paguRK: 106765000, realisasi: 2304000, realPct: 2.16, fisik: 0 },
    { no: 3, nama: "Perjalanan dinas ke/dari lokasi kegiatan (Penugasan)", vol: 4, sat: "Frekuensi", jenis: "Swakelola", paguRK: 110000000, realisasi: 92791098, realPct: 84.36, fisik: 42 },
  ];

  const progresDocId = { TW1: "progres_keu", TW2: "progres_keu_tw2", TW3: "progres_keu_tw3", TW4: "progres_keu_tw4" }[triwulan] || "progres_keu";
  const progresState = docState[progresDocId] || {};

  return (
    <div>
      {/* DPA hanya di Data Progres */}
      <div style={{ background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>DPA (Dokumen Pelaksanaan Anggaran)</div>
          <div style={{ fontSize: 12, color: S.text }}>Wajib ditandatangani dan diupload di bagian ini</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {dpaState.uploaded && <button className="btn btn-outline btn-sm"><Eye size={12} /> Lihat DPA</button>}
          {dpaState.uploaded && (
            <span className={`badge ${dpaState.verified ? "badge-green" : "badge-yellow"}`}>
              {dpaState.verified ? "✓ Terverifikasi" : "⏳ Menunggu Verifikasi"}
            </span>
          )}
          {isPemda && !dpaState.uploaded && (
            <button className="btn btn-primary btn-sm" onClick={() => setDpaState({ uploaded: true, verified: false })}>
              <Upload size={12} /> Upload DPA
            </button>
          )}
          {!isPemda && dpaState.uploaded && !dpaState.verified && (
            <button className="btn btn-success btn-sm" onClick={() => setDpaState(s => ({ ...s, verified: true }))}>
              <CheckCircle size={12} /> Verifikasi DPA
            </button>
          )}
        </div>
      </div>

      {/* Warning jika belum kontrak tapi tetap bisa isi progres */}
      {!terkontrak && (
        <div className="alert alert-warn" style={{ marginBottom: 16 }}>
          <AlertTriangle size={14} />
          <div>
            <strong>Perhatian:</strong> Status pengadaan belum Terkontrak. Data progres dapat diisi, namun kelengkapan dokumen kontrak belum bisa dilengkapi.
          </div>
        </div>
      )}

      {/* Tabel progres */}
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <div className="table-header">
          <span className="table-title"><TrendingUp size={14} style={{ color: S.accent }} /> Data Progres — {triwulan}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>NO.</th>
                <th>KEGIATAN/OUTPUT</th>
                <th className="center">VOL</th>
                <th>SATUAN</th>
                <th>PENGADAAN</th>
                <th className="right">PAGU RK (Rp)</th>
                <th className="right">NILAI KONTRAK (Rp)</th>
                <th className="right">REALISASI THD PAGU RK</th>
                <th className="center">%</th>
                <th className="center">REALISASI THD KONTRAK</th>
                <th className="center">FISIK (%)</th>
                <th className="center">CHECKLIST</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={12} style={{ fontWeight: 700, fontSize: 11, color: S.green, background: "rgba(46,160,67,0.07)", padding: "7px 14px" }}>KEGIATAN FISIK</td>
              </tr>
              <tr>
                <td>1</td>
                <td style={{ maxWidth: 260, fontSize: 12, lineHeight: 1.6, fontWeight: 600 }}>{kegiatan.nama}</td>
                <td className="center">{kegiatan.volume}</td>
                <td>{kegiatan.satuan}</td>
                <td><span className="badge badge-blue">{kegiatan.pengadaan}</span></td>
                <td className="right">{formatRupiah(kegiatan.paguRK)}</td>
                <td className="right">{formatRupiah(kegiatan.nilaiKontrak)}</td>
                <td className="right">{formatRupiah(kegiatan.realisasiRP)}</td>
                <td className="center" style={{ fontWeight: 700, color: getColor(kegiatan.realisasiPct) }}>{kegiatan.realisasiPct}</td>
                <td className="center" style={{ fontWeight: 700, color: getColor(kegiatan.realisasiKontrakPct) }}>{kegiatan.realisasiKontrakPct}</td>
                <td className="center"><span className={`badge ${kegiatan.fisik === 100 ? "badge-green" : "badge-yellow"}`}>{kegiatan.fisik}%</span></td>
                <td className="center">
                  <button className="btn btn-outline btn-xs" onClick={() => setExpandChk(!expandChk)} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckSquare size={11} />
                    {Object.values(checks).filter(Boolean).length}/{checklistProgresItems.length}
                    <ChevronDown size={10} style={{ transform: expandChk ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                  </button>
                </td>
              </tr>
              {expandChk && (
                <tr>
                  <td colSpan={12} style={{ padding: 0, background: S.surface2 }}>
                    <div style={{ padding: "14px 20px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Checklist Kepatuhan Kegiatan Fisik</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 8 }}>
                        {checklistProgresItems.map(item => (
                          <label key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, background: S.surface, border: `1px solid ${checks[item.id] ? "var(--green)" : S.border}`, borderRadius: 8, padding: "9px 12px", cursor: !isPemda ? "pointer" : "default", transition: "border-color 0.15s" }}
                            onClick={() => !isPemda && setChecks(s => ({ ...s, [item.id]: !s[item.id] }))}>
                            <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, background: checks[item.id] ? "var(--green-bg)" : "transparent", border: `1.5px solid ${checks[item.id] ? "var(--green)" : S.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {checks[item.id] && <CheckCircle size={13} color={S.green} />}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: checks[item.id] ? S.text : S.muted }}>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={12} style={{ fontWeight: 700, fontSize: 11, color: S.accent, background: "rgba(26,127,224,0.05)", padding: "7px 14px" }}>KEGIATAN PENUNJANG</td>
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
                </tr>
              ))}
              <tr style={{ background: S.surface2, borderTop: `2px solid ${S.border}` }}>
                <td colSpan={5} style={{ textAlign: "right", fontWeight: 800, textTransform: "uppercase", fontSize: 12 }}>TOTAL</td>
                <td className="right" style={{ fontWeight: 800 }}>12.616.765.000</td>
                <td className="right" style={{ fontWeight: 800 }}>12.212.272.000</td>
                <td className="right" style={{ fontWeight: 800 }}>12.307.367.098</td>
                <td className="center" style={{ fontWeight: 800, color: S.green }}>97,55</td>
                <td className="center" style={{ fontWeight: 800, color: S.green }}>100,00</td>
                <td className="center" style={{ fontWeight: 800, color: S.green }}>98,65</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload data progres keuangan & fisik */}
      <div className="detail-card">
        <div className="detail-card-header">
          <span style={{ fontWeight: 700, fontSize: 13 }}>Upload Data Progres Keuangan &amp; Fisik</span>
          {progresState.uploaded && (
            <span className={`badge ${progresState.verifiedPFID ? "badge-green" : "badge-yellow"}`}>
              {progresState.verifiedPFID ? "✓ Terverifikasi" : "⏳ Menunggu Verifikasi"}
            </span>
          )}
        </div>
        <div style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, fontSize: 12, color: S.muted }}>
            Upload laporan realisasi keuangan dan fisik per {triwulan}. Format: Excel atau PDF.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {progresState.uploaded && <button className="btn btn-outline btn-sm"><Eye size={12} /> Lihat</button>}
            {isPemda && !progresState.uploaded && (
              <button className="btn btn-primary btn-sm" onClick={() => setProgresModal(true)}>
                <Upload size={12} /> Upload Progres
              </button>
            )}
            {!isPemda && progresState.uploaded && !progresState.verifiedPFID && (
              <CrosscheckBtn uploaded small
                verifiedPFID={progresState.verifiedPFID} isPemda={isPemda}
                catatan={progresState.catatan}
                onVerify={() => onDocChange(progresDocId, { ...progresState, verifiedPFID: true, tanggalVerif: new Date().toISOString().split("T")[0] })}
                onReject={cat => onDocChange(progresDocId, { ...progresState, catatan: cat })}
              />
            )}
          </div>
        </div>
      </div>
      {progresModal && (
        <UploadModal label="Data Progres Keuangan & Fisik" onClose={() => setProgresModal(false)}
          onConfirm={() => { onDocChange(progresDocId, { uploaded: true, verifiedPFID: false, catatan: "" }); setProgresModal(false); }} />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   TAB: FOTO KEGIATAN
   - Selalu 3 slot: 0%, 50%, 100% untuk semua TW
   - Metadata: logo PU, logo Pemda, lokasi, STA, progres, tanggal
   - PDF dokumentasi per slot (tidak wajib)
   - TW4: validasi video (link)
════════════════════════════════════════════ */
function TabFotoKegiatan({ isPemda, triwulan, kegiatan }) {
  const [fotoState, setFotoState] = useState({
    foto_0: { uploaded: false, tanggal: "", catatan: "", verified: false },
    foto_50: { uploaded: false, tanggal: "", catatan: "", verified: false },
    foto_100: { uploaded: false, tanggal: "", catatan: "", verified: false },
  });
  const [pdfState, setPdfState] = useState({
    pdf_0: { uploaded: false }, pdf_50: { uploaded: false }, pdf_100: { uploaded: false },
  });
  const [videoLink, setVideoLink] = useState("");
  const [videoVerified, setVideoVerified] = useState(false);
  const [uploadModal, setUploadModal] = useState(null);
  const [videoModal, setVideoModal] = useState(false);
  const [metaEdit, setMetaEdit] = useState(null); // slot id being edited

  const META_FIELDS = [
    { id: "logo_pu", label: "Logo PU terpasang di foto" },
    { id: "logo_pemda", label: "Logo Pemda terpasang di foto" },
    { id: "ket_lokasi", label: "Keterangan lokasi tercantum" },
    { id: "ket_sta", label: "Keterangan STA tercantum" },
    { id: "ket_progres", label: "Keterangan progres tercantum" },
  ];

  function setFoto(id, patch) { setFotoState(s => ({ ...s, [id]: { ...s[id], ...patch } })); }
  function setPdf(id, patch) { setPdfState(s => ({ ...s, [id]: { ...s[id], ...patch } })); }

  return (
    <div>
      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        <Info size={14} />
        Setiap foto wajib memuat: logo PU, logo Pemda, keterangan lokasi, keterangan STA, keterangan progres, dan tanggal kegiatan.
      </div>

      {/* 3 slot foto */}
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <div className="table-header">
          <span className="table-title"><Camera size={14} style={{ color: S.accent }} /> Foto Kegiatan — {triwulan}</span>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: S.surface2, border: `1px solid var(--green)`, borderRadius: 8, padding: "8px 14px", marginBottom: 18, fontSize: 12, color: S.green, fontWeight: 600 }}>
            Ruas: {kegiatan.ruas} · Kecamatan: {kegiatan.kecamatan} · Desa: {kegiatan.desa}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {FOTO_SLOTS.map(slot => {
              const st = fotoState[slot.id];
              const metaDone = st.meta ? Object.values(st.meta).filter(Boolean).length : 0;
              return (
                <div key={slot.id} style={{ border: `2px solid ${st.uploaded ? (st.verified ? "var(--green)" : "var(--yellow)") : S.border}`, borderRadius: 12, overflow: "hidden", background: S.surface2 }}>
                  {/* Header */}
                  <div style={{ padding: "10px 14px", background: st.uploaded ? (st.verified ? "var(--green-bg)" : "var(--yellow-bg)") : S.surface2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${S.border2}` }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: st.uploaded ? (st.verified ? S.green : S.yellow) : S.muted }}>{slot.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, background: "var(--red-bg)", color: S.red, padding: "2px 7px", borderRadius: 99 }}>WAJIB</span>
                  </div>

                  {/* Preview area */}
                  {st.uploaded ? (
                    <div style={{ height: 130, background: "linear-gradient(135deg, #1a3a2a 0%, #0d1f16 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <Camera size={30} color={S.green} opacity={0.6} />
                      <span style={{ fontSize: 11, color: S.green }}>Foto terupload</span>
                      {st.tanggal && <span style={{ fontSize: 10, color: S.muted, fontFamily: "'DM Mono',monospace" }}>{st.tanggal}</span>}
                    </div>
                  ) : (
                    <div style={{ height: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, opacity: 0.6 }}>
                      <Camera size={28} color={S.muted} />
                      <span style={{ fontSize: 11, color: S.muted }}>Belum ada foto</span>
                    </div>
                  )}

                  {/* Metadata checklist */}
                  <div style={{ padding: "10px 14px", borderTop: `1px solid ${S.border2}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Kelengkapan Foto</div>
                    {META_FIELDS.map(f => {
                      const ok = st.meta?.[f.id];
                      return (
                        <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}
                          onClick={() => isPemda && setFoto(slot.id, { meta: { ...st.meta, [f.id]: !ok } })}>
                          <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, background: ok ? "var(--green-bg)" : "transparent", border: `1.5px solid ${ok ? "var(--green)" : S.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: isPemda ? "pointer" : "default" }}>
                            {ok && <CheckCircle size={11} color={S.green} />}
                          </div>
                          <span style={{ fontSize: 10, color: ok ? S.text : S.muted }}>{f.label}</span>
                        </div>
                      );
                    })}
                    {/* Tanggal kegiatan */}
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Tanggal Kegiatan</div>
                      {isPemda ? (
                        <input type="date" value={st.tanggal} onChange={e => setFoto(slot.id, { tanggal: e.target.value })}
                          style={{ width: "100%", background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, color: S.text, padding: "5px 8px", fontSize: 11 }} />
                      ) : (
                        <span style={{ fontSize: 11, color: S.muted, fontFamily: "'DM Mono',monospace" }}>{st.tanggal || "-"}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ padding: "10px 14px", borderTop: `1px solid ${S.border2}`, display: "flex", gap: 6, justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {st.uploaded && <button className="btn btn-outline btn-xs"><Eye size={11} /> Lihat</button>}
                      {isPemda && !st.uploaded && (
                        <button className="btn btn-primary btn-xs" onClick={() => setUploadModal(slot)}>
                          <Upload size={11} /> Upload
                        </button>
                      )}
                      {isPemda && st.uploaded && (
                        <button className="btn btn-warn btn-xs" onClick={() => setUploadModal(slot)}>
                          <Upload size={11} /> Ganti
                        </button>
                      )}
                    </div>
                    {/* Crosscheck PFID */}
                    {!isPemda && st.uploaded && (
                      <CrosscheckBtn uploaded verifiedPFID={st.verified} isPemda={isPemda} catatan={st.catatan}
                        onVerify={() => setFoto(slot.id, { verified: true })}
                        onReject={cat => setFoto(slot.id, { verified: false, catatan: cat })}
                        small />
                    )}
                    {isPemda && st.catatan && !st.verified && (
                      <span style={{ fontSize: 10, color: S.yellow }}>⚠ {st.catatan}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PDF Dokumentasi per slot (tidak wajib) */}
      <div className="table-wrap" style={{ marginBottom: 20 }}>
        <div className="table-header">
          <span className="table-title"><FileText size={14} style={{ color: S.accent }} /> Dokumentasi PDF (Tidak Wajib)</span>
          <span style={{ fontSize: 11, color: S.muted }}>Upload PDF dokumentasi untuk setiap tahap</span>
        </div>
        <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {PDF_DOK_SLOTS.map(pdf => {
            const ps = pdfState[pdf.id];
            return (
              <div key={pdf.id} style={{ background: S.surface2, border: `1px solid ${ps.uploaded ? S.border : S.border2}`, borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 8 }}>{pdf.label}</div>
                {ps.uploaded ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>✓ Terupload</span>
                    <button className="btn btn-outline btn-xs"><Eye size={11} /> Lihat</button>
                    {!isPemda && (
                      <CrosscheckBtn uploaded small verifiedPFID={ps.verified} isPemda={isPemda}
                        onVerify={() => setPdf(pdf.id, { verified: true })}
                        onReject={cat => setPdf(pdf.id, { catatan: cat })} />
                    )}
                  </div>
                ) : isPemda ? (
                  <button className="btn btn-outline btn-xs" style={{ width: "100%" }} onClick={() => setPdf(pdf.id, { uploaded: true })}>
                    <Upload size={11} /> Upload PDF
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: S.dim }}>Belum diupload</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TW4: Validasi Video */}
      {triwulan === "TW4" && (
        <div className="detail-card">
          <div className="detail-card-header">
            <span style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <Play size={14} color={S.accent} /> Validasi Video Hasil Penanganan 100% — TW4
            </span>
            {videoLink && (
              <span className={`badge ${videoVerified ? "badge-green" : "badge-yellow"}`}>
                {videoVerified ? "✓ Link Tervalidasi" : "⏳ Menunggu Validasi"}
              </span>
            )}
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 12 }}>
              Video PKRMS sangat dianjurkan. Masukkan link YouTube, Google Drive, atau platform lainnya.
            </div>
            {videoLink ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: 8, padding: "9px 14px", display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 200 }}>
                  <Link2 size={13} color={S.muted} />
                  <a href={videoLink} target="_blank" rel="noreferrer" style={{ color: S.accent, fontSize: 12, wordBreak: "break-all" }}>{videoLink}</a>
                </div>
                {isPemda && (
                  <button className="btn btn-outline btn-sm" onClick={() => setVideoModal(true)}>
                    <Edit3 size={12} /> Edit Link
                  </button>
                )}
                {!isPemda && !videoVerified && (
                  <button className="btn btn-success btn-sm" onClick={() => setVideoVerified(true)}>
                    <CheckCircle size={12} /> Validasi Link
                  </button>
                )}
                {videoVerified && <span className="badge badge-green">✓ Divalidasi PFID</span>}
              </div>
            ) : isPemda ? (
              <button className="btn btn-primary btn-sm" onClick={() => setVideoModal(true)}>
                <Link2 size={12} /> Masukkan Link Video
              </button>
            ) : (
              <span style={{ fontSize: 12, color: S.dim }}>Link video belum diisi oleh PEMDA</span>
            )}
          </div>
        </div>
      )}

      {uploadModal && (
        <UploadModal
          label={`${uploadModal.label} — Ruas: ${kegiatan.ruas}`}
          onClose={() => setUploadModal(null)}
          onConfirm={() => { setFoto(uploadModal.id, { uploaded: true }); setUploadModal(null); }}
        />
      )}
      {videoModal && (
        <VideoLinkModal existing={videoLink} onClose={() => setVideoModal(false)} onConfirm={link => setVideoLink(link)} />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   TAB: REALISASI OUTPUT
════════════════════════════════════════════ */
const STATUS_OUTPUT_OPTS = [
  { value: "Terlaksana", bg: "var(--green-bg)", color: S.green, border: "var(--green)" },
  { value: "Terkendala", bg: "var(--yellow-bg)", color: S.yellow, border: "var(--yellow)" },
  { value: "Tidak Terlaksana", bg: "var(--red-bg)", color: S.red, border: "var(--red)" },
];

function TabRealisasiOutput({ kegiatan, isPemda }) {
  const [statusOutput, setStatusOutput] = useState(kegiatan.statusOutput || "Terlaksana");
  const [catatan, setCatatan] = useState(kegiatan.catatanOutput || "");
  const [verifikasi, setVerifikasi] = useState(kegiatan.verifikasiOutput || false);
  const [editCat, setEditCat] = useState(false);
  const opt = STATUS_OUTPUT_OPTS.find(s => s.value === statusOutput) || STATUS_OUTPUT_OPTS[0];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
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
                <th colSpan={3} className="center" style={{ borderBottom: `1px solid ${S.border2}` }}>TARGET OUTPUT</th>
                <th colSpan={3} className="center" style={{ borderBottom: `1px solid ${S.border2}` }}>CAPAIAN OUTPUT</th>
                <th colSpan={3} className="center" style={{ borderBottom: `1px solid ${S.border2}` }}>DOKUMEN</th>
                <th rowSpan={2} className="center">VERIFIKASI</th>
                <th rowSpan={2} className="center" style={{ minWidth: 150 }}>STATUS VERIFIKATOR</th>
                <th rowSpan={2} className="center">CROSSCHECK</th>
              </tr>
              <tr>
                <th>TIPE PERMUKAAN</th><th className="right">PANJANG SESUAI RK</th><th>SATUAN</th>
                <th>TIPE PERMUKAAN</th><th className="right">PANJANG DAK</th><th>SATUAN</th>
                <th className="center">PHO</th><th className="center">SPTJM</th><th className="center">UPLOAD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={19} style={{ fontWeight: 700, fontSize: 11, color: S.accent, background: "rgba(26,127,224,0.05)", padding: "7px 14px" }}>Penanganan Jalan (Provinsi)</td>
              </tr>
              <tr>
                <td>1</td>
                <td style={{ fontSize: 11, lineHeight: 1.5 }}>{kegiatan.tipeTematik}</td>
                <td style={{ fontSize: 11 }}>{kegiatan.menuKegiatan}</td>
                <td style={{ fontSize: 11 }}>{kegiatan.rincianKegiatan}</td>
                <td style={{ fontSize: 11 }}>Jl. Batas Aceh Timur - Kota Karang Baru</td>
                <td></td><td></td>
                <td className="right">1.50</td><td>km</td><td></td>
                <td className="right">1.50</td><td>km</td>
                <td className="center"><button className="btn btn-danger btn-xs"><FileText size={10} /> PDF</button></td>
                <td className="center"><button className="btn btn-danger btn-xs"><FileText size={10} /> PDF</button></td>
                <td className="center">{isPemda ? <button className="btn btn-primary btn-xs"><Upload size={10} /> Upload</button> : <button className="btn btn-success btn-xs"><Eye size={10} /> Lihat</button>}</td>
                <td className="center">
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: verifikasi ? "var(--purple-bg)" : "transparent", border: `2px solid ${verifikasi ? "var(--purple)" : S.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: !isPemda ? "pointer" : "default", margin: "0 auto" }}
                    onClick={() => !isPemda && setVerifikasi(!verifikasi)}>
                    {verifikasi && <CheckCircle size={13} color={S.purple} />}
                  </div>
                </td>
                <td className="center">
                  {isPemda ? (
                    <span className={`badge ${statusOutput === "Terlaksana" ? "badge-green" : statusOutput === "Terkendala" ? "badge-yellow" : "badge-red"}`}>{statusOutput}</span>
                  ) : (
                    <select value={statusOutput} onChange={e => setStatusOutput(e.target.value)}
                      style={{ background: opt.bg, color: opt.color, border: `1px solid ${opt.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: 700 }}>
                      {STATUS_OUTPUT_OPTS.map(s => <option key={s.value} value={s.value} style={{ background: "var(--surface2)", color: "var(--text)" }}>{s.value}</option>)}
                    </select>
                  )}
                </td>
                <td className="center">
                  <CrosscheckBtn uploaded verifiedPFID={verifikasi} isPemda={isPemda} catatan={catatan}
                    onVerify={() => setVerifikasi(true)} onReject={c => setCatatan(c)} small />
                </td>
              </tr>
              <tr style={{ background: "rgba(255,213,40,0.04)" }}>
                <td colSpan={4} /><td style={{ fontSize: 11 }}>Peningkatan/Rekonstruksi</td>
                <td style={{ background: "var(--yellow-bg)", textAlign: "center", fontWeight: 700, fontSize: 11, color: S.yellow }}>AC WC</td>
                <td style={{ background: "var(--yellow-bg)", textAlign: "center", fontWeight: 700, fontSize: 11, color: S.yellow }}>AC WC</td>
                <td className="right">1.50</td><td>km</td>
                <td style={{ background: "var(--yellow-bg)", textAlign: "center", fontWeight: 700, fontSize: 11, color: S.yellow }}>AC WC</td>
                <td className="right" style={{ background: "var(--yellow-bg)", fontWeight: 700, color: S.yellow }}>1.50</td>
                <td colSpan={8}></td>
              </tr>
              <tr style={{ background: S.surface2 }}>
                <td colSpan={7} style={{ textAlign: "right", fontWeight: 800, textTransform: "uppercase", fontSize: 12 }}>Total Jalan</td>
                <td className="right" style={{ fontWeight: 800 }}>1.50</td>
                <td></td><td></td>
                <td className="right" style={{ fontWeight: 800 }}>1.50</td>
                <td colSpan={8}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {!isPemda && (
        <div className="detail-card">
          <div className="detail-card-header">
            <span style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={14} color={S.accent} /> Catatan Verifikator PFID
            </span>
            <button className="btn btn-outline btn-xs" onClick={() => setEditCat(!editCat)}>{editCat ? "Simpan" : "Edit"}</button>
          </div>
          <div style={{ padding: 16 }}>
            {editCat ? (
              <textarea value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Catatan hasil verifikasi realisasi output..."
                style={{ width: "100%", background: S.surface2, border: `1px solid ${S.border}`, borderRadius: 8, color: S.text, fontSize: 13, padding: "10px 14px", resize: "vertical", minHeight: 80 }} />
            ) : (
              <div style={{ fontSize: 13, color: catatan ? S.text : S.muted, fontStyle: catatan ? "normal" : "italic" }}>{catatan || "Belum ada catatan."}</div>
            )}
          </div>
        </div>
      )}
      {isPemda && catatan && <div className="alert alert-warn" style={{ marginTop: 12 }}><AlertTriangle size={14} /><div><strong>Catatan dari PFID:</strong> {catatan}</div></div>}
    </div>
  );
}

/* ════════════════════════════════════════════
   TAB: KELENGKAPAN DOKUMEN
   - Hanya muncul setelah Terkontrak
   - Isi: adendum, update kurva S, foto dokumentasi progres fisik
   - Laporan Word + kirim WA
════════════════════════════════════════════ */
function TabKelengkapan({ isPemda, terkontrak, triwulan, pemda, pemda_info, docState, onDocChange }) {
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  // Dokumen kelengkapan = DOCS_PASCA_KONTRAK_PER_TW.SEMUA + per TW (exclude doc yang sudah ada di kontrak)
  const docsBase = DOCS_PASCA_KONTRAK_PER_TW.SEMUA;
  const docsTW = (DOCS_PASCA_KONTRAK_PER_TW[triwulan] || []).filter(d => d.id !== "dpa_tw1");
  const allDocs = [...docsBase, ...docsTW];

  const uploaded = allDocs.filter(d => docState[d.id]?.uploaded).length;
  const verified = allDocs.filter(d => docState[d.id]?.verifiedPFID).length;
  const reqDocs = allDocs.filter(d => d.required);
  const reqDone = reqDocs.filter(d => docState[d.id]?.uploaded).length;
  const notOk = allDocs.filter(d => {
    const st = docState[d.id] || {};
    return (d.required && !st.uploaded) || (st.uploaded && !st.verifiedPFID && st.catatan);
  });
  const pct = allDocs.length ? Math.round((uploaded / allDocs.length) * 100) : 0;

  const waNumber = pemda_info?.noHPOPD || "";
  const waMsg = encodeURIComponent(
    `Yth. ${pemda_info?.namaOPD || pemda}\n\nBersama ini kami sampaikan hasil monitoring kelengkapan dokumen DAK Bidang Jalan ${triwulan} dari PFID Kementerian PUPR.\n\nTerdapat ${notOk.length} dokumen yang perlu ditindaklanjuti. Mohon segera melengkapi dokumen yang belum sesuai.\n\nDetail terlampir. Terima kasih.`
  );

  if (!terkontrak) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <Lock size={40} color={S.muted} style={{ marginBottom: 16 }} />
        <div style={{ fontSize: 16, fontWeight: 700, color: S.muted, marginBottom: 8 }}>Belum Bisa Diakses</div>
        <div style={{ fontSize: 13, color: S.dim, maxWidth: 360, margin: "0 auto" }}>
          Kelengkapan dokumen hanya bisa diisi setelah status pengadaan menjadi <strong style={{ color: S.yellow }}>Terkontrak</strong>.
          Silakan update status terlebih dahulu di tab <strong>Status</strong>.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Dokumen Diupload", val: `${uploaded}/${allDocs.length}`, color: S.accent },
          { label: "Terverifikasi PFID", val: `${verified}/${allDocs.length}`, color: verified === allDocs.length ? S.green : S.yellow },
          { label: "Wajib Terpenuhi", val: `${reqDone}/${reqDocs.length}`, color: reqDone === reqDocs.length ? S.green : S.red },
          { label: "Belum Sesuai", val: notOk.length, color: notOk.length === 0 ? S.green : S.red },
        ].map(card => (
          <div key={card.label} style={{ background: S.surface, border: `1px solid ${S.border2}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: S.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: card.color }}>{card.val}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: S.muted, fontWeight: 600 }}>Kelengkapan Dokumen {triwulan}</span>
          <span style={{ color: getColor(pct), fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: S.border, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: getColor(pct), borderRadius: 99, transition: "width 0.6s" }} />
        </div>
      </div>

      {/* Checklist */}
      <div className="checklist-panel" style={{ marginBottom: 24 }}>
        <div className="checklist-header">
          <span className="checklist-title">
            <FileText size={14} color={S.accent} />
            Kelengkapan Dokumen Setelah Kontrak — {triwulan}
          </span>
          {!isPemda && uploaded > 0 && (
            <button className="btn btn-success btn-sm" onClick={() => {
              allDocs.filter(d => docState[d.id]?.uploaded && !docState[d.id]?.verifiedPFID).forEach(d =>
                onDocChange(d.id, { ...docState[d.id], verifiedPFID: true, tanggalVerif: new Date().toISOString().split("T")[0] })
              );
            }}>
              <CheckSquare size={12} /> Verifikasi Semua Sekaligus
            </button>
          )}
        </div>
        {allDocs.map(doc => {
          const st = docState[doc.id] || {};
          return (
            <DocRow key={doc.id} doc={doc} state={st} isPemda={isPemda}
              onUpload={() => onDocChange(doc.id, { uploaded: true, verifiedPFID: false, catatan: "" })}
              onVerify={() => onDocChange(doc.id, { ...st, verifiedPFID: true, tanggalVerif: new Date().toISOString().split("T")[0] })}
              onReject={cat => onDocChange(doc.id, { ...st, verifiedPFID: false, catatan: cat })}
            />
          );
        })}
      </div>

      {/* ── LAPORAN HASIL VERIFIKASI ── */}
      <div style={{ borderTop: `2px dashed ${S.border}`, paddingTop: 24, marginTop: 8 }}>
        <div className="section-title"><FileText size={13} />Laporan Hasil Verifikasi PFID</div>

        {notOk.length === 0 ? (
          <div style={{ background: "var(--green-bg)", border: "1px solid var(--green)", borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <CheckCircle size={20} color={S.green} />
            <div>
              <div style={{ fontWeight: 700, color: S.green }}>Semua dokumen sudah sesuai</div>
              <div style={{ fontSize: 12, color: S.muted, marginTop: 2 }}>Tidak ada dokumen yang perlu ditindaklanjuti untuk {triwulan}.</div>
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--red-bg)", border: "1px solid var(--red)", borderRadius: 10, padding: "14px 20px", marginBottom: 20 }}>
            <div style={{ fontWeight: 700, color: S.red, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={16} /> {notOk.length} Dokumen Belum Sesuai
            </div>
            {notOk.map((doc, i) => {
              const st = docState[doc.id] || {};
              return (
                <div key={doc.id} style={{ fontSize: 12, display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: S.red, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span>
                    <strong>{doc.label}</strong>
                    {st.catatan && <span style={{ color: S.muted }}> — {st.catatan}</span>}
                    {!st.uploaded && <span style={{ color: S.red }}> — Belum diupload</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {!isPemda && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => { setGeneratingReport(true); setTimeout(() => { setGeneratingReport(false); setReportDone(true); }, 1800); }} disabled={generatingReport}>
              {generatingReport ? <RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={13} />}
              {generatingReport ? "Membuat laporan..." : "Generate Laporan Word"}
            </button>
            {reportDone && (
              <>
                <span style={{ fontSize: 12, color: S.green, display: "flex", alignItems: "center", gap: 5 }}>
                  <CheckCircle size={13} /> Laporan_{triwulan}_{pemda?.replace(/\s/g, "_")}.docx siap
                </span>
                <button className="btn btn-success btn-sm"><Download size={12} /> Download</button>
                {pemda_info?.noHPOPD && (
                  <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noreferrer"
                    className="btn btn-sm" style={{ background: "#25D366", color: "#fff", border: "none", display: "flex", alignItems: "center", gap: 6 }}>
                    <Phone size={12} /> Kirim via WhatsApp
                    <span style={{ fontSize: 10, opacity: 0.8 }}>({pemda_info.noHPOPD})</span>
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN: PEMDA DETAIL
════════════════════════════════════════════ */
const TABS = [
  { id: "status", label: "Status", icon: Clock },
  { id: "kontrak", label: "Data Kontrak", icon: FileText },
  { id: "progres", label: "Data Progres", icon: TrendingUp },
  { id: "foto", label: "Foto Kegiatan", icon: Camera },
  { id: "output", label: "Realisasi Output", icon: BarChart2 },
  { id: "kelengkapan", label: "Kelengkapan Dok.", icon: CheckSquare, highlight: true },
];

export default function PemdaDetail({ pemda, provinsi, triwulan, setPage }) {
  const [tab, setTab] = useState("status");
  const [isPemda, setIsPemda] = useState(false);
  const kegiatan = sampleKegiatan["Provinsi Aceh"]?.[0] || {};
  const pemda_info = { namaOPD: "Dinas PUPR Provinsi Aceh", noHPOPD: "6281234567890" };

  // Status history state
  const [statusHistory, setStatusHistory] = useState(sampleStatusHistory);
  const latestStatus = statusHistory.length ? statusHistory[statusHistory.length - 1].status : "Persiapan";
  const terkontrak = isTerkontrak(latestStatus);

  // Shared doc state
  const [docState, setDocState] = useState({});
  function onDocChange(id, patch) {
    setDocState(s => ({ ...s, [id]: { ...(s[id] || {}), ...patch } }));
  }

  // Badge counts
  const allKelengkapanDocs = terkontrak ? [
    ...DOCS_PASCA_KONTRAK_PER_TW.SEMUA,
    ...(DOCS_PASCA_KONTRAK_PER_TW[triwulan] || []).filter(d => d.id !== "dpa_tw1"),
  ] : [];
  const pendingVerif = allKelengkapanDocs.filter(d => docState[d.id]?.uploaded && !docState[d.id]?.verifiedPFID).length;
  const belumUpload = allKelengkapanDocs.filter(d => d.required && !docState[d.id]?.uploaded).length;

  const sc = getStatusColor(latestStatus);

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>{pemda}</h1>
          <p>Bidang Jalan · {provinsi} · {triwulan}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: S.muted, fontWeight: 600 }}>TAMPILAN:</span>
          <button className={`btn btn-sm ${!isPemda ? "btn-primary" : "btn-outline"}`} onClick={() => setIsPemda(false)}>
            <Zap size={12} /> PFID / Pusat
          </button>
          <button className={`btn btn-sm ${isPemda ? "btn-primary" : "btn-outline"}`} onClick={() => setIsPemda(true)}>
            <Users size={12} /> PEMDA
          </button>
        </div>
      </div>

      {/* Kegiatan summary bar */}
      <div style={{ background: S.surface2, border: `1px solid ${S.border2}`, borderRadius: "var(--radius-lg)", padding: "14px 20px", marginBottom: 20, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 10, color: S.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Paket Kegiatan</div>
          <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.5 }}>01 — Penanganan Long Segment Jl. Batas Aceh Timur - Kota Karang Baru</div>
        </div>
        {[
          { label: "Realisasi Keuangan", val: "97.55%", color: S.green },
          { label: "Progres Fisik", val: "98.65%", color: S.green },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: S.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: s.color }}>{s.val}</div>
          </div>
        ))}
        {/* Status badge */}
        <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 9, color: S.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status Pengadaan</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: sc.color }}>{latestStatus}</div>
        </div>
      </div>

      {/* Warning jika belum kontrak */}
      {!terkontrak && (
        <div className="alert alert-warn" style={{ marginBottom: 16 }}>
          <AlertTriangle size={14} />
          <div>
            <strong>Segera lakukan kontrak!</strong> Kelengkapan dokumen kontrak belum bisa diisi. Data progres masih bisa diupdate.
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t => {
          const isLocked = t.id === "kelengkapan" && !terkontrak;
          return (
            <button key={t.id} className={`tab-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}
              style={{ opacity: isLocked && !isPemda ? 1 : 1 }}>
              <t.icon size={13} />
              {t.label}
              {t.id === "kelengkapan" && !terkontrak && <Lock size={10} style={{ marginLeft: 2, color: S.muted }} />}
              {t.id === "kelengkapan" && terkontrak && (pendingVerif + belumUpload) > 0 && (
                <span className="tab-badge warn">{pendingVerif + belumUpload}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "status" && (
        <TabStatus isPemda={isPemda} statusHistory={statusHistory} onUpdateHistory={setStatusHistory} />
      )}
      {tab === "kontrak" && (
        <TabDataKontrak isPemda={isPemda} terkontrak={terkontrak} triwulan={triwulan} docState={docState} onDocChange={onDocChange} />
      )}
      {tab === "progres" && (
        <TabDataProgres isPemda={isPemda} terkontrak={terkontrak} triwulan={triwulan} kegiatan={kegiatan} docState={docState} onDocChange={onDocChange} />
      )}
      {tab === "foto" && (
        <TabFotoKegiatan isPemda={isPemda} triwulan={triwulan} kegiatan={kegiatan} />
      )}
      {tab === "output" && (
        <TabRealisasiOutput kegiatan={kegiatan} isPemda={isPemda} />
      )}
      {tab === "kelengkapan" && (
        <TabKelengkapan isPemda={isPemda} terkontrak={terkontrak} triwulan={triwulan}
          pemda={pemda} pemda_info={pemda_info} docState={docState} onDocChange={onDocChange} />
      )}
    </div>
  );
}
