import { useState, useCallback } from "react";
import {
  CheckCircle, Clock, Upload, FileText, Camera, TrendingUp, Eye, BarChart2,
  CheckSquare, Zap, X, MessageSquare, Download, Phone, AlertTriangle,
  Info, RefreshCw, Lock, Link2, Play, Users, ChevronDown, Edit3,
  AlertCircle, Plus
} from "lucide-react";
import {
  sampleKegiatan, sampleKontrak, sampleStatusHistory, sampleRuas,
  DOCS_KONTRAK_RUAS, DOCS_KELENGKAPAN_PER_TW, DOCS_PHO,
  FOTO_SLOTS, PDF_DOK_SLOTS, checklistProgresItems,
  TW_DEADLINE, formatRupiah
} from "../data/mockData";
import {
  S, getColor, isTerkontrak, getStatusColor, getTWDeadlineInfo,
  TabStatus, CrosscheckBtn, DocRow, UploadModal
} from "./PemdaHelpers";

/* ════════════════════════════════════════════
   VIDEO LINK MODAL
════════════════════════════════════════════ */
function VideoLinkModal({ existing, onClose, onConfirm }) {
  const [link, setLink] = useState(existing || "");
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:S.surface,border:`1px solid ${S.border}`,borderRadius:12,padding:28,width:480,maxWidth:"92vw" }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
          <div style={{ fontWeight:700,fontSize:15 }}>Validasi Link Video</div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:S.muted }}><X size={18}/></button>
        </div>
        <div style={{ fontSize:12,color:S.muted,marginBottom:12 }}>Masukkan link video hasil penanganan 100%. Video PKRMS sangat dianjurkan.</div>
        <div style={{ display:"flex",gap:8,marginBottom:16,background:S.surface2,border:`1px solid ${S.border}`,borderRadius:8,padding:"9px 12px",alignItems:"center" }}>
          <Link2 size={14} color={S.muted}/>
          <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://youtube.com/... atau https://drive.google.com/..."
            style={{ background:"none",border:"none",color:S.text,fontSize:13,flex:1,outline:"none" }}/>
        </div>
        {link && (
          <div style={{ background:S.surface2,border:`1px solid ${S.border2}`,borderRadius:8,padding:"9px 12px",marginBottom:16,display:"flex",gap:8,alignItems:"center" }}>
            <Play size={13} color={S.green}/>
            <a href={link} target="_blank" rel="noreferrer" style={{ color:S.accent,fontSize:12,wordBreak:"break-all" }}>{link}</a>
          </div>
        )}
        <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
          <button className="btn btn-outline" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={()=>{ if(link){onConfirm(link);onClose();} }}>
            <CheckCircle size={13}/> Simpan Link
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   TAB: DATA KONTRAK
   - Dropdown pilih ruas dulu
   - Per ruas: upload DOCS_KONTRAK_RUAS
   - Setelah semua dokumen upload baru bisa Save
════════════════════════════════════════════ */
function TabDataKontrak({ isPemda, terkontrak, docState, onDocChange }) {
  const kontrak = sampleKontrak["Provinsi Aceh"];
  const [selectedRuas, setSelectedRuas] = useState("");
  const [savedRuas, setSavedRuas] = useState({}); // { ruasId: true } = sudah disave
  const [showSaveConfirm, setShowSaveConfirm] = useState(null);

  const ruas = sampleRuas;
  const current = ruas.find(r => r.id === selectedRuas);

  function getRuasDocKey(ruasId, docId) { return `kontrak_${ruasId}_${docId}`; }

  function allDocsUploaded(ruasId) {
    return DOCS_KONTRAK_RUAS.filter(d => d.required).every(d => {
      const k = getRuasDocKey(ruasId, d.id);
      return docState[k]?.uploaded;
    });
  }

  function handleSave(ruasId) {
    setSavedRuas(s => ({ ...s, [ruasId]: true }));
    setShowSaveConfirm(ruasId);
    setTimeout(() => setShowSaveConfirm(null), 2500);
  }

  return (
    <div>
      {!terkontrak && (
        <div className="alert alert-warn" style={{ marginBottom:20 }}>
          <Lock size={14}/> Upload dokumen kontrak baru tersedia setelah status <strong>Terkontrak</strong>.
        </div>
      )}

      {/* Info kontrak */}
      {terkontrak && (
        <div className="detail-card" style={{ marginBottom:20 }}>
          <div className="detail-card-header">
            <span style={{ fontWeight:700,fontSize:13 }}>Data Penyedia &amp; Kontrak</span>
            <span className="badge badge-green">Terkontrak</span>
          </div>
          <div className="detail-card-body">
            <div className="detail-row">
              <div className="detail-field"><label>Nama Penyedia</label><value>{kontrak.namaPenyedia}</value></div>
              <div className="detail-field"><label>Alamat</label><value style={{ fontSize:13,color:S.muted }}>{kontrak.alamatPenyedia}</value></div>
            </div>
            <div className="detail-row">
              <div className="detail-field"><label>Nomor Kontrak</label><value style={{ fontFamily:"'DM Mono',monospace",fontSize:13 }}>{kontrak.nomorKontrak}</value></div>
              <div className="detail-field"><label>Tanggal Kontrak</label><value>{kontrak.tanggalKontrak}</value></div>
            </div>
            <div className="detail-row">
              <div className="detail-field"><label>Nilai Kontrak (Rp)</label><value style={{ color:S.accent,fontFamily:"'DM Mono',monospace" }}>{formatRupiah(kontrak.nilaiKontrak)}</value></div>
              <div className="detail-field"><label>Tanggal SPMK</label><value>{kontrak.tanggalSPMK}</value></div>
            </div>
            <div className="detail-row">
              <div className="detail-field"><label>Masa Pelaksanaan</label><value>{kontrak.masaPelaksanaan} hari kalender</value></div>
              <div className="detail-field"><label>Masa Pemeliharaan</label><value>{kontrak.masaPemeliharaan} hari kalender</value></div>
            </div>
          </div>
        </div>
      )}

      {/* Tenaga Kerja dari kontrak */}
      {terkontrak && (
        <div className="table-wrap" style={{ marginBottom:20 }}>
          <div className="table-header">
            <span className="table-title"><Users size={14} style={{ color:S.accent }}/> Data Tenaga Kerja (dari Kontrak)</span>
          </div>
          <table>
            <thead><tr>
              <th>KATEGORI</th><th>JABATAN</th><th className="center">JUMLAH</th><th>KUALIFIKASI</th>
            </tr></thead>
            <tbody>
              {kontrak.tenagaKerja.map((t,i) => (
                <tr key={i}>
                  <td><span className={`badge ${t.kategori==="Profesional"?"badge-blue":t.kategori==="Semi Profesional"?"badge-purple":"badge-green"}`}>{t.kategori}</span></td>
                  <td style={{ fontWeight:500 }}>{t.jabatan}</td>
                  <td className="center" style={{ fontWeight:700,fontSize:16 }}>{t.jumlah}</td>
                  <td style={{ fontSize:12,color:S.muted }}>{t.ket}</td>
                </tr>
              ))}
              <tr style={{ background:S.surface2 }}>
                <td colSpan={2} style={{ textAlign:"right",fontWeight:800,fontSize:12 }}>TOTAL</td>
                <td className="center" style={{ fontWeight:800,fontSize:16,color:S.accent }}>{kontrak.tenagaKerja.reduce((s,t)=>s+t.jumlah,0)}</td>
                <td/>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Upload dokumen per ruas */}
      {terkontrak && (
        <div>
          <div className="section-title"><FileText size={13}/> Upload Dokumen Kontrak per Ruas</div>

          {/* Status ruas yang sudah disave */}
          {ruas.map(r => savedRuas[r.id] && (
            <div key={r.id} style={{ background:"var(--green-bg)",border:"1px solid var(--green)",borderRadius:8,padding:"8px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10,fontSize:12 }}>
              <CheckCircle size={14} color={S.green}/>
              <span style={{ fontWeight:600,color:S.green }}>{r.kode}  -  {r.nama}</span>
              <span style={{ color:S.muted }}>* Dokumen tersimpan</span>
              <button className="btn btn-outline btn-xs" style={{ marginLeft:"auto" }} onClick={()=>{ setSavedRuas(s=>({...s,[r.id]:false})); setSelectedRuas(r.id); }}>Edit</button>
            </div>
          ))}

          {/* Pilih ruas */}
          <div style={{ background:S.surface,border:`1px solid ${S.border2}`,borderRadius:10,padding:20,marginBottom:20 }}>
            <div style={{ fontSize:12,fontWeight:700,color:S.muted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10 }}>Pilih Ruas untuk Upload Dokumen</div>
            <select value={selectedRuas} onChange={e=>{ setSelectedRuas(e.target.value); }}
              style={{ width:"100%",background:S.surface2,border:`1px solid ${S.border}`,borderRadius:8,color:selectedRuas?S.text:S.muted,padding:"10px 14px",fontSize:13,marginBottom:selectedRuas?16:0 }}>
              <option value="">-- Pilih Ruas Terlebih Dahulu --</option>
              {ruas.filter(r=>!savedRuas[r.id]).map(r => (
                <option key={r.id} value={r.id}>{r.kode}  -  {r.nama} ({r.panjang} {r.satuan})</option>
              ))}
            </select>

            {selectedRuas && current && (
              <div>
                {/* Ruas info */}
                <div style={{ background:S.surface2,border:`1px solid var(--accent)`,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:16,flexWrap:"wrap" }}>
                  <div><div style={{ fontSize:10,color:S.muted,fontWeight:700 }}>RUAS</div><div style={{ fontSize:13,fontWeight:700,color:S.accent }}>{current.nama}</div></div>
                  <div><div style={{ fontSize:10,color:S.muted,fontWeight:700 }}>PANJANG</div><div style={{ fontSize:13,fontWeight:700 }}>{current.panjang} {current.satuan}</div></div>
                  <div><div style={{ fontSize:10,color:S.muted,fontWeight:700 }}>PAGU RK</div><div style={{ fontSize:13,fontWeight:700 }}>Rp {formatRupiah(current.paguRK)}</div></div>
                  <div><div style={{ fontSize:10,color:S.muted,fontWeight:700 }}>PENGADAAN</div><div style={{ fontSize:13,fontWeight:700 }}>{current.jenisPengadaan}</div></div>
                </div>

                {/* Dokumen per ruas */}
                <div className="checklist-panel" style={{ marginBottom:12 }}>
                  <div className="checklist-header">
                    <span className="checklist-title"><FileText size={13} color={S.accent}/> Dokumen Ruas: {current.kode}  -  {current.nama.substring(0,40)}...</span>
                  </div>
                  {DOCS_KONTRAK_RUAS.map(doc => {
                    const k = getRuasDocKey(selectedRuas, doc.id);
                    const st = docState[k] || {};
                    return (
                      <DocRow key={doc.id} doc={doc} state={st} isPemda={isPemda}
                        onUpload={()=>onDocChange(k,{ uploaded:true,verifiedPFID:false,catatan:"" })}
                        onVerify={()=>onDocChange(k,{ ...st,verifiedPFID:true,tanggalVerif:new Date().toISOString().split("T")[0] })}
                        onReject={cat=>onDocChange(k,{ ...st,verifiedPFID:false,catatan:cat })}/>
                    );
                  })}
                </div>

                {/* Progress dokumen */}
                {(() => {
                  const total = DOCS_KONTRAK_RUAS.filter(d=>d.required).length;
                  const done = DOCS_KONTRAK_RUAS.filter(d=>d.required).filter(d=>docState[getRuasDocKey(selectedRuas,d.id)]?.uploaded).length;
                  const pct = Math.round(done/total*100);
                  const canSave = done === total;
                  return (
                    <div>
                      <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6 }}>
                        <span style={{ color:S.muted,fontWeight:600 }}>Kelengkapan dokumen wajib</span>
                        <span style={{ color:getColor(pct),fontWeight:700 }}>{done}/{total}</span>
                      </div>
                      <div style={{ height:6,background:S.border,borderRadius:99,overflow:"hidden",marginBottom:14 }}>
                        <div style={{ width:`${pct}%`,height:"100%",background:getColor(pct),borderRadius:99,transition:"width 0.5s" }}/>
                      </div>
                      <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
                        <button className="btn btn-outline" onClick={()=>setSelectedRuas("")}>Batalkan</button>
                        <button className={`btn ${canSave?"btn-primary":"btn-outline"}`} disabled={!canSave}
                          onClick={()=>{ if(canSave) handleSave(selectedRuas); }}
                          style={{ opacity:canSave?1:0.5 }}>
                          {canSave ? <><CheckCircle size={13}/> Simpan Ruas</> : <><Lock size={13}/> Lengkapi dokumen wajib</>}
                        </button>
                      </div>
                      {showSaveConfirm===selectedRuas && (
                        <div className="alert alert-info" style={{ marginTop:10 }}>
                          <CheckCircle size={13}/> Dokumen ruas berhasil disimpan!
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {ruas.every(r=>savedRuas[r.id]) && (
            <div style={{ background:"var(--green-bg)",border:"1px solid var(--green)",borderRadius:10,padding:"14px 20px",display:"flex",alignItems:"center",gap:12 }}>
              <CheckCircle size={20} color={S.green}/>
              <div>
                <div style={{ fontWeight:700,color:S.green }}>Semua ruas telah dilengkapi dokumennya</div>
                <div style={{ fontSize:12,color:S.muted }}>Total {ruas.length} ruas tersimpan</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   TAB: DATA PROGRES
   - Input progres fisik & keuangan oleh PEMDA
   - Cek 100% di TW2-4 dengan propagasi
   - Hapus checklist kepatuhan
════════════════════════════════════════════ */
function TabDataProgres({ isPemda, terkontrak, triwulan, kegiatan, docState, onDocChange, fisik100PerTW, onFisik100Change }) {
  const [dpaUploaded, setDpaUploaded] = useState(false);
  const [dpaVerified, setDpaVerified] = useState(false);
  const [progresModal, setProgresModal] = useState(false);

  // Input progres oleh PEMDA
  const [inputRealisasiPct, setInputRealisasiPct] = useState(String(kegiatan.realisasiPct || ""));
  const [inputFisikPct, setInputFisikPct] = useState(String(kegiatan.fisik || ""));
  const [inputRealisasiRP, setInputRealisasiRP] = useState(String(kegiatan.realisasiRP || ""));
  const [savedProgres, setSavedProgres] = useState(false);

  const progresDocId = { TW1:"progres_keu",TW2:"progres_keu_tw2",TW3:"progres_keu_tw3",TW4:"progres_keu_tw4" }[triwulan]||"progres_keu";
  const progresState = docState[progresDocId]||{};

  // Cek apakah TW sebelumnya sudah 100%
  const prevTWMap = { TW2:"TW1", TW3:"TW2", TW4:"TW3" };
  const prevTW = prevTWMap[triwulan];
  const prevIs100 = prevTW ? !!fisik100PerTW[prevTW] : false;
  const currentIs100 = !!fisik100PerTW[triwulan];
  const isLockedByPrev = (triwulan !== "TW1") && prevIs100;

  const showFisik100Check = triwulan !== "TW1";

  const penunjang=[
    { no:2,nama:"Penyelenggaraan rapat koordinasi (Penugasan)",vol:1,sat:"Frekuensi",jenis:"Swakelola",paguRK:106765000,realisasi:2304000,realPct:2.16,fisik:0 },
    { no:3,nama:"Perjalanan dinas ke/dari lokasi kegiatan (Penugasan)",vol:4,sat:"Frekuensi",jenis:"Swakelola",paguRK:110000000,realisasi:92791098,realPct:84.36,fisik:42 },
  ];

  const displayFisik = currentIs100 ? 100 : (parseFloat(inputFisikPct) || kegiatan.fisik);
  const displayReal = parseFloat(inputRealisasiPct) || kegiatan.realisasiPct;

  return (
    <div>
      {/* DPA hanya di sini */}
      <div style={{ background:S.surface2,border:`1px solid ${S.border2}`,borderRadius:10,padding:"13px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" }}>
        <div style={{ flex:1,minWidth:200 }}>
          <div style={{ fontSize:11,fontWeight:700,color:S.muted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4 }}>DPA (Dokumen Pelaksanaan Anggaran)</div>
          <div style={{ fontSize:12,color:S.text }}>Wajib ditandatangani dan diupload di bagian ini</div>
        </div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          {dpaUploaded && <button className="btn btn-outline btn-sm"><Eye size={12}/> Lihat DPA</button>}
          {dpaUploaded && <span className={`badge ${dpaVerified?"badge-green":"badge-yellow"}`}>{dpaVerified?"v Terverifikasi":"⏳ Menunggu Verifikasi"}</span>}
          {isPemda&&!dpaUploaded && <button className="btn btn-primary btn-sm" onClick={()=>setDpaUploaded(true)}><Upload size={12}/> Upload DPA</button>}
          {!isPemda&&dpaUploaded&&!dpaVerified && <button className="btn btn-success btn-sm" onClick={()=>setDpaVerified(true)}><CheckCircle size={12}/> Verifikasi DPA</button>}
        </div>
      </div>

      {!terkontrak && <div className="alert alert-warn" style={{ marginBottom:16 }}><AlertTriangle size={14}/><div><strong>Perhatian:</strong> Status belum Terkontrak. Data progres dapat diisi namun kelengkapan dokumen kontrak belum bisa dilengkapi.</div></div>}

      {/* ── INPUT PROGRES PEMDA ── */}
      {isPemda && (
        <div style={{ background:S.surface,border:`1px solid ${isLockedByPrev?"var(--text-dim)":S.border2}`,borderRadius:12,padding:"18px 20px",marginBottom:20,opacity:isLockedByPrev?0.5:1,pointerEvents:isLockedByPrev?"none":"auto" }}>
          <div style={{ fontSize:12,fontWeight:700,color:S.muted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
            <TrendingUp size={14} color={S.accent}/> Input Progres {triwulan}
            {isLockedByPrev && <span className="badge badge-green" style={{ marginLeft:8 }}>Auto 100% dari {prevTW}</span>}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:14 }}>
            <div>
              <label style={{ fontSize:11,fontWeight:700,color:S.muted,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em" }}>
                Realisasi Keuangan (%)
              </label>
              <div style={{ display:"flex",alignItems:"center",gap:8,background:S.surface2,border:`1px solid ${S.border}`,borderRadius:8,padding:"8px 12px" }}>
                <input
                  type="number" min="0" max="100" step="0.01"
                  value={currentIs100?"100":inputRealisasiPct}
                  onChange={e=>setInputRealisasiPct(e.target.value)}
                  disabled={isLockedByPrev||currentIs100}
                  style={{ background:"none",border:"none",color:S.text,fontSize:16,fontWeight:700,flex:1,outline:"none",width:"100%" }}
                  placeholder="0.00"
                />
                <span style={{ color:S.muted,fontSize:13 }}>%</span>
              </div>
              {inputRealisasiPct && (
                <div style={{ marginTop:6,height:4,background:S.border,borderRadius:99,overflow:"hidden" }}>
                  <div style={{ width:`${Math.min(parseFloat(inputRealisasiPct)||0,100)}%`,height:"100%",background:getColor(parseFloat(inputRealisasiPct)||0),borderRadius:99 }}/>
                </div>
              )}
            </div>
            <div>
              <label style={{ fontSize:11,fontWeight:700,color:S.muted,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em" }}>
                Progres Fisik (%)
              </label>
              <div style={{ display:"flex",alignItems:"center",gap:8,background:S.surface2,border:`1px solid ${S.border}`,borderRadius:8,padding:"8px 12px" }}>
                <input
                  type="number" min="0" max="100" step="0.01"
                  value={currentIs100?"100":inputFisikPct}
                  onChange={e=>setInputFisikPct(e.target.value)}
                  disabled={isLockedByPrev||currentIs100}
                  style={{ background:"none",border:"none",color:S.text,fontSize:16,fontWeight:700,flex:1,outline:"none",width:"100%" }}
                  placeholder="0.00"
                />
                <span style={{ color:S.muted,fontSize:13 }}>%</span>
              </div>
              {inputFisikPct && (
                <div style={{ marginTop:6,height:4,background:S.border,borderRadius:99,overflow:"hidden" }}>
                  <div style={{ width:`${Math.min(parseFloat(inputFisikPct)||0,100)}%`,height:"100%",background:getColor(parseFloat(inputFisikPct)||0),borderRadius:99 }}/>
                </div>
              )}
            </div>
            <div>
              <label style={{ fontSize:11,fontWeight:700,color:S.muted,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em" }}>
                Realisasi Keuangan (Rp)
              </label>
              <div style={{ display:"flex",alignItems:"center",gap:8,background:S.surface2,border:`1px solid ${S.border}`,borderRadius:8,padding:"8px 12px" }}>
                <span style={{ color:S.muted,fontSize:13 }}>Rp</span>
                <input
                  type="number" min="0"
                  value={inputRealisasiRP}
                  onChange={e=>setInputRealisasiRP(e.target.value)}
                  disabled={isLockedByPrev}
                  style={{ background:"none",border:"none",color:S.text,fontSize:14,fontWeight:600,flex:1,outline:"none",width:"100%" }}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Cek pekerjaan fisik 100% (TW2-4) */}
          {showFisik100Check && (
            <div style={{ background:currentIs100?"var(--green-bg)":"var(--surface2)",border:`1px solid ${currentIs100?"var(--green)":S.border}`,borderRadius:8,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12 }}>
              <div
                style={{ width:24,height:24,borderRadius:7,background:currentIs100?"var(--green-bg)":"transparent",border:`2px solid ${currentIs100?"var(--green)":S.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:isLockedByPrev?"default":"pointer",flexShrink:0,transition:"all 0.2s" }}
                onClick={()=>!isLockedByPrev&&onFisik100Change(triwulan,!currentIs100)}
              >
                {currentIs100 && <CheckCircle size={15} color="var(--green-light)"/>}
              </div>
              <div>
                <div style={{ fontWeight:700,fontSize:13,color:currentIs100?"var(--green-light)":S.text }}>
                  Pekerjaan Fisik Telah 100%
                </div>
                <div style={{ fontSize:11,color:S.muted }}>
                  {isLockedByPrev
                    ? `Otomatis tercentang karena ${prevTW} sudah 100%`
                    : "Centang jika progres fisik sudah mencapai 100%. Akan otomatis mengunci TW berikutnya."}
                </div>
              </div>
              {isLockedByPrev && <span className="badge badge-green" style={{ marginLeft:"auto",flexShrink:0 }}>Auto dari {prevTW}</span>}
            </div>
          )}

          <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
            {savedProgres && <span style={{ fontSize:12,color:S.green,display:"flex",alignItems:"center",gap:5 }}><CheckCircle size={13}/> Tersimpan</span>}
            <button className="btn btn-primary btn-sm" onClick={()=>setSavedProgres(true)}>
              <CheckCircle size={13}/> Simpan Progres
            </button>
          </div>
        </div>
      )}

      {/* Jika locked karena TW sebelumnya sudah 100% */}
      {isPemda && isLockedByPrev && (
        <div className="alert alert-info" style={{ marginBottom:16 }}>
          <Info size={14}/>
          <div>Pekerjaan sudah dinyatakan <strong>100%</strong> sejak {prevTW}. Data progres {triwulan} otomatis 100% dan terkunci.</div>
        </div>
      )}

      <div className="table-wrap" style={{ marginBottom:20 }}>
        <div className="table-header"><span className="table-title"><TrendingUp size={14} style={{ color:S.accent }}/> Rekap Data Progres  -  {triwulan}</span></div>
        <div style={{ overflowX:"auto" }}>
          <table>
            <thead><tr>
              <th>NO.</th><th>KEGIATAN/OUTPUT</th><th className="center">VOL</th><th>SATUAN</th><th>PENGADAAN</th>
              <th className="right">PAGU RK (Rp)</th><th className="right">NILAI KONTRAK (Rp)</th>
              <th className="right">REALISASI (Rp)</th><th className="center">%</th>
              <th className="center">THD KONTRAK</th><th className="center">FISIK (%)</th>
            </tr></thead>
            <tbody>
              <tr><td colSpan={11} style={{ fontWeight:700,fontSize:11,color:S.green,background:"rgba(46,160,67,0.07)",padding:"7px 14px" }}>KEGIATAN FISIK</td></tr>
              <tr>
                <td>1</td>
                <td style={{ maxWidth:260,fontSize:12,lineHeight:1.6,fontWeight:600 }}>{kegiatan.nama}</td>
                <td className="center">{kegiatan.volume}</td><td>{kegiatan.satuan}</td>
                <td><span className="badge badge-blue">{kegiatan.pengadaan}</span></td>
                <td className="right">{formatRupiah(kegiatan.paguRK)}</td>
                <td className="right">{formatRupiah(kegiatan.nilaiKontrak)}</td>
                <td className="right">{inputRealisasiRP ? formatRupiah(parseInt(inputRealisasiRP)) : formatRupiah(kegiatan.realisasiRP)}</td>
                <td className="center" style={{ fontWeight:700,color:getColor(displayReal) }}>{displayReal.toFixed(2)}</td>
                <td className="center" style={{ fontWeight:700,color:getColor(kegiatan.realisasiKontrakPct) }}>{kegiatan.realisasiKontrakPct}</td>
                <td className="center">
                  <span className={`badge ${displayFisik===100?"badge-green":"badge-yellow"}`}>{displayFisik}%</span>
                </td>
              </tr>
              <tr><td colSpan={11} style={{ fontWeight:700,fontSize:11,color:S.accent,background:"rgba(26,127,224,0.05)",padding:"7px 14px" }}>KEGIATAN PENUNJANG</td></tr>
              {penunjang.map(p=>(
                <tr key={p.no}>
                  <td>{p.no}</td><td style={{ fontSize:12,maxWidth:260 }}>{p.nama}</td>
                  <td className="center">{p.vol}</td><td>{p.sat}</td>
                  <td><span className="badge badge-purple">{p.jenis}</span></td>
                  <td className="right">{formatRupiah(p.paguRK)}</td><td className="right">0</td>
                  <td className="right">{formatRupiah(p.realisasi)}</td>
                  <td className="center" style={{ color:getColor(p.realPct),fontWeight:700 }}>{p.realPct}</td>
                  <td className="center">0</td><td className="center">{p.fisik}</td>
                </tr>
              ))}
              <tr style={{ background:S.surface2,borderTop:`2px solid ${S.border}` }}>
                <td colSpan={5} style={{ textAlign:"right",fontWeight:800,textTransform:"uppercase",fontSize:12 }}>TOTAL</td>
                <td className="right" style={{ fontWeight:800 }}>12.616.765.000</td>
                <td className="right" style={{ fontWeight:800 }}>12.212.272.000</td>
                <td className="right" style={{ fontWeight:800 }}>{inputRealisasiRP ? formatRupiah(parseInt(inputRealisasiRP)) : "12.307.367.098"}</td>
                <td className="center" style={{ fontWeight:800,color:getColor(displayReal) }}>{displayReal.toFixed(2)}</td>
                <td className="center" style={{ fontWeight:800,color:S.green }}>100,00</td>
                <td className="center" style={{ fontWeight:800,color:getColor(displayFisik) }}>{displayFisik}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload bukti progres */}
      <div className="detail-card">
        <div className="detail-card-header">
          <span style={{ fontWeight:700,fontSize:13 }}>Upload Bukti Progres Keuangan &amp; Fisik</span>
          {progresState.uploaded&&<span className={`badge ${progresState.verifiedPFID?"badge-green":"badge-yellow"}`}>{progresState.verifiedPFID?"v Terverifikasi":"⏳ Menunggu Verifikasi"}</span>}
        </div>
        <div style={{ padding:16,display:"flex",gap:12,alignItems:"center" }}>
          <div style={{ flex:1,fontSize:12,color:S.muted }}>Upload laporan/bukti realisasi keuangan dan fisik per {triwulan}. Format: Excel atau PDF.</div>
          <div style={{ display:"flex",gap:8 }}>
            {progresState.uploaded&&<button className="btn btn-outline btn-sm"><Eye size={12}/> Lihat</button>}
            {isPemda&&!progresState.uploaded&&<button className="btn btn-primary btn-sm" onClick={()=>setProgresModal(true)}><Upload size={12}/> Upload Bukti</button>}
            {isPemda&&progresState.uploaded&&<button className="btn btn-warn btn-sm" onClick={()=>setProgresModal(true)}><Upload size={12}/> Ganti</button>}
            {!isPemda&&progresState.uploaded&&!progresState.verifiedPFID&&(
              <CrosscheckBtn uploaded small verifiedPFID={progresState.verifiedPFID} isPemda={isPemda} catatan={progresState.catatan}
                onVerify={()=>onDocChange(progresDocId,{...progresState,verifiedPFID:true,tanggalVerif:new Date().toISOString().split("T")[0]})}
                onReject={cat=>onDocChange(progresDocId,{...progresState,catatan:cat})}/>
            )}
          </div>
        </div>
      </div>
      {progresModal&&<UploadModal label="Bukti Progres Keuangan & Fisik" onClose={()=>setProgresModal(false)}
        onConfirm={()=>{ onDocChange(progresDocId,{ uploaded:true,verifiedPFID:false,catatan:"" }); setProgresModal(false); }}/>}
    </div>
  );
}

/* ════════════════════════════════════════════
   TAB: FOTO KEGIATAN
════════════════════════════════════════════ */
const META_FIELDS = [
  { id:"logo_pu", label:"Logo PU terpasang" },
  { id:"logo_pemda", label:"Logo Pemda terpasang" },
  { id:"ket_lokasi", label:"Keterangan lokasi" },
  { id:"ket_sta", label:"Keterangan STA" },
  { id:"ket_progres", label:"Keterangan progres" },
];

function TabFotoKegiatan({ isPemda, triwulan, kegiatan }) {
  const [fotoState, setFotoState] = useState({
    foto_0:{ uploaded:false,tanggal:"",meta:{},verified:false,catatan:"" },
    foto_50:{ uploaded:false,tanggal:"",meta:{},verified:false,catatan:"" },
    foto_100:{ uploaded:false,tanggal:"",meta:{},verified:false,catatan:"" },
  });
  const [pdfState, setPdfState] = useState({ pdf_0:{ uploaded:false },pdf_50:{ uploaded:false },pdf_100:{ uploaded:false } });
  const [videoLink, setVideoLink] = useState("");
  const [videoVerified, setVideoVerified] = useState(false);
  const [uploadModal, setUploadModal] = useState(null);
  const [videoModal, setVideoModal] = useState(false);
  function setFoto(id,patch){ setFotoState(s=>({ ...s,[id]:{ ...s[id],...patch } })); }
  function setPdf(id,patch){ setPdfState(s=>({ ...s,[id]:{ ...s[id],...patch } })); }
  return (
    <div>
      <div className="alert alert-info" style={{ marginBottom:16 }}>
        <Info size={14}/>
        Setiap foto wajib memuat: <strong>logo PU * logo Pemda * keterangan lokasi * keterangan STA * keterangan progres * tanggal kegiatan</strong>
      </div>
      <div className="table-wrap" style={{ marginBottom:20 }}>
        <div className="table-header"><span className="table-title"><Camera size={14} style={{ color:S.accent }}/> Foto Kegiatan  -  {triwulan}</span></div>
        <div style={{ padding:20 }}>
          <div style={{ background:S.surface2,border:`1px solid var(--green)`,borderRadius:8,padding:"8px 14px",marginBottom:18,fontSize:12,color:S.green,fontWeight:600 }}>
            Ruas: {kegiatan.ruas} * Kecamatan: {kegiatan.kecamatan} * Desa: {kegiatan.desa}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
            {FOTO_SLOTS.map(slot=>{
              const st = fotoState[slot.id];
              const metaDone = Object.values(st.meta||{}).filter(Boolean).length;
              return (
                <div key={slot.id} style={{ border:`2px solid ${st.uploaded?(st.verified?"var(--green)":"var(--yellow)"):S.border}`,borderRadius:12,overflow:"hidden",background:S.surface2 }}>
                  <div style={{ padding:"10px 14px",background:st.uploaded?(st.verified?"var(--green-bg)":"var(--yellow-bg)"):S.surface2,display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${S.border2}` }}>
                    <span style={{ fontWeight:800,fontSize:13,color:st.uploaded?(st.verified?S.green:S.yellow):S.muted }}>{slot.label}</span>
                    <span style={{ fontSize:10,fontWeight:700,background:"var(--red-bg)",color:S.red,padding:"2px 7px",borderRadius:99 }}>WAJIB</span>
                  </div>
                  {st.uploaded ? (
                    <div style={{ height:120,background:"linear-gradient(135deg,#1a3a2a 0%,#0d1f16 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6 }}>
                      <Camera size={28} color={S.green} opacity={0.6}/>
                      <span style={{ fontSize:11,color:S.green }}>Foto terupload</span>
                      {st.tanggal&&<span style={{ fontSize:10,color:S.muted,fontFamily:"'DM Mono',monospace" }}>{st.tanggal}</span>}
                    </div>
                  ) : (
                    <div style={{ height:120,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,opacity:0.5 }}>
                      <Camera size={26} color={S.muted}/><span style={{ fontSize:11,color:S.muted }}>Belum ada foto</span>
                    </div>
                  )}
                  {/* Meta checklist */}
                  <div style={{ padding:"10px 14px",borderTop:`1px solid ${S.border2}` }}>
                    <div style={{ fontSize:10,fontWeight:700,color:S.muted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6 }}>
                      Kelengkapan Foto ({metaDone}/{META_FIELDS.length})
                    </div>
                    {META_FIELDS.map(f=>{
                      const ok=st.meta?.[f.id];
                      return (
                        <div key={f.id} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4,cursor:isPemda?"pointer":"default" }}
                          onClick={()=>isPemda&&setFoto(slot.id,{ meta:{ ...st.meta,[f.id]:!ok } })}>
                          <div style={{ width:15,height:15,borderRadius:4,flexShrink:0,background:ok?"var(--green-bg)":"transparent",border:`1.5px solid ${ok?"var(--green)":S.border}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                            {ok&&<CheckCircle size={10} color={S.green}/>}
                          </div>
                          <span style={{ fontSize:10,color:ok?S.text:S.muted }}>{f.label}</span>
                        </div>
                      );
                    })}
                    {/* Tanggal */}
                    <div style={{ marginTop:8 }}>
                      <div style={{ fontSize:10,fontWeight:700,color:S.muted,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4 }}>Tanggal Kegiatan</div>
                      {isPemda ? (
                        <input type="date" value={st.tanggal} onChange={e=>setFoto(slot.id,{ tanggal:e.target.value })}
                          style={{ width:"100%",background:S.surface,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,padding:"5px 8px",fontSize:11 }}/>
                      ) : <span style={{ fontSize:11,color:S.muted,fontFamily:"'DM Mono',monospace" }}>{st.tanggal||"-"}</span>}
                    </div>
                  </div>
                  {/* Actions */}
                  <div style={{ padding:"10px 14px",borderTop:`1px solid ${S.border2}`,display:"flex",gap:6,justifyContent:"space-between",alignItems:"center" }}>
                    <div style={{ display:"flex",gap:6 }}>
                      {st.uploaded&&<button className="btn btn-outline btn-xs"><Eye size={11}/> Lihat</button>}
                      {isPemda&&<button className={`btn btn-xs ${st.uploaded?"btn-warn":"btn-primary"}`} onClick={()=>setUploadModal(slot)}>
                        <Upload size={11}/> {st.uploaded?"Ganti":"Upload"}
                      </button>}
                    </div>
                    {!isPemda&&st.uploaded&&(
                      <CrosscheckBtn uploaded verifiedPFID={st.verified} isPemda={isPemda} catatan={st.catatan}
                        onVerify={()=>setFoto(slot.id,{ verified:true })}
                        onReject={cat=>setFoto(slot.id,{ verified:false,catatan:cat })} small/>
                    )}
                    {isPemda&&st.catatan&&!st.verified&&<span style={{ fontSize:10,color:S.yellow }}>⚠ {st.catatan}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* PDF dokumentasi (tidak wajib) */}
      <div className="table-wrap" style={{ marginBottom:20 }}>
        <div className="table-header">
          <span className="table-title"><FileText size={14} style={{ color:S.accent }}/> Dokumentasi PDF (Tidak Wajib)</span>
        </div>
        <div style={{ padding:16,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
          {PDF_DOK_SLOTS.map(pdf=>{
            const ps=pdfState[pdf.id];
            return (
              <div key={pdf.id} style={{ background:S.surface2,border:`1px solid ${ps.uploaded?S.border:S.border2}`,borderRadius:8,padding:14 }}>
                <div style={{ fontSize:11,fontWeight:700,color:S.muted,marginBottom:8 }}>{pdf.label}</div>
                {ps.uploaded ? (
                  <div style={{ display:"flex",gap:6,alignItems:"center",flexWrap:"wrap" }}>
                    <span className="badge badge-green" style={{ fontSize:10 }}>v Terupload</span>
                    <button className="btn btn-outline btn-xs"><Eye size={11}/> Lihat</button>
                    {!isPemda&&<CrosscheckBtn uploaded small verifiedPFID={ps.verified} isPemda={isPemda}
                      onVerify={()=>setPdf(pdf.id,{ verified:true })} onReject={cat=>setPdf(pdf.id,{ catatan:cat })}/>}
                  </div>
                ) : isPemda ? (
                  <button className="btn btn-outline btn-xs" style={{ width:"100%" }} onClick={()=>setPdf(pdf.id,{ uploaded:true })}>
                    <Upload size={11}/> Upload PDF
                  </button>
                ) : <span style={{ fontSize:11,color:S.dim }}>Belum diupload</span>}
              </div>
            );
          })}
        </div>
      </div>
      {/* TW4: link video */}
      {triwulan==="TW4"&&(
        <div className="detail-card">
          <div className="detail-card-header">
            <span style={{ fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8 }}>
              <Play size={14} color={S.accent}/> Validasi Video Hasil Penanganan 100%  -  TW4
            </span>
            {videoLink&&<span className={`badge ${videoVerified?"badge-green":"badge-yellow"}`}>{videoVerified?"v Tervalidasi":"⏳ Menunggu Validasi"}</span>}
          </div>
          <div style={{ padding:16 }}>
            <div style={{ fontSize:12,color:S.muted,marginBottom:12 }}>Video PKRMS sangat dianjurkan. Link YouTube, Google Drive, atau platform lainnya.</div>
            {videoLink ? (
              <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
                <div style={{ background:S.surface2,border:`1px solid ${S.border2}`,borderRadius:8,padding:"9px 14px",display:"flex",gap:8,alignItems:"center",flex:1 }}>
                  <Link2 size={13} color={S.muted}/>
                  <a href={videoLink} target="_blank" rel="noreferrer" style={{ color:S.accent,fontSize:12,wordBreak:"break-all" }}>{videoLink}</a>
                </div>
                {isPemda&&<button className="btn btn-outline btn-sm" onClick={()=>setVideoModal(true)}><Edit3 size={12}/> Edit</button>}
                {!isPemda&&!videoVerified&&<button className="btn btn-success btn-sm" onClick={()=>setVideoVerified(true)}><CheckCircle size={12}/> Validasi</button>}
                {videoVerified&&<span className="badge badge-green">v Divalidasi PFID</span>}
              </div>
            ) : isPemda ? (
              <button className="btn btn-primary btn-sm" onClick={()=>setVideoModal(true)}><Link2 size={12}/> Masukkan Link Video</button>
            ) : <span style={{ fontSize:12,color:S.dim }}>Link video belum diisi PEMDA</span>}
          </div>
        </div>
      )}
      {uploadModal&&<UploadModal label={`${uploadModal.label}  -  Ruas: ${kegiatan.ruas}`} onClose={()=>setUploadModal(null)}
        onConfirm={()=>{ setFoto(uploadModal.id,{ uploaded:true }); setUploadModal(null); }}/>}
      {videoModal&&<VideoLinkModal existing={videoLink} onClose={()=>setVideoModal(false)} onConfirm={l=>setVideoLink(l)}/>}
    </div>
  );
}

/* ════════════════════════════════════════════
   TAB: REALISASI OUTPUT
════════════════════════════════════════════ */
const STATUS_OUTPUT_OPTS=[
  { value:"Terlaksana",bg:"var(--green-bg)",color:S.green,border:"var(--green)" },
  { value:"Terkendala",bg:"var(--yellow-bg)",color:S.yellow,border:"var(--yellow)" },
  { value:"Tidak Terlaksana",bg:"var(--red-bg)",color:S.red,border:"var(--red)" },
];
function TabRealisasiOutput({ kegiatan, isPemda }) {
  const [statusOutput,setStatusOutput]=useState(kegiatan.statusOutput||"Terlaksana");
  const [catatan,setCatatan]=useState(kegiatan.catatanOutput||"");
  const [verifikasi,setVerifikasi]=useState(kegiatan.verifikasiOutput||false);
  const [editCat,setEditCat]=useState(false);
  const opt=STATUS_OUTPUT_OPTS.find(s=>s.value===statusOutput)||STATUS_OUTPUT_OPTS[0];
  return (
    <div>
      <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:16 }}><button className="btn btn-outline btn-sm">📥 Cetak Excel</button></div>
      <div className="table-wrap" style={{ marginBottom:20 }}>
        <div style={{ overflowX:"auto" }}>
          <table>
            <thead>
              <tr>
                <th rowSpan={2}>NO</th><th rowSpan={2}>TEMATIK</th><th rowSpan={2}>MENU KEGIATAN</th>
                <th rowSpan={2}>RINCIAN KEGIATAN</th><th rowSpan={2}>DETAIL RINCIAN</th><th rowSpan={2}>TIPE EXISTING</th>
                <th colSpan={3} className="center" style={{ borderBottom:`1px solid ${S.border2}` }}>TARGET OUTPUT</th>
                <th colSpan={3} className="center" style={{ borderBottom:`1px solid ${S.border2}` }}>CAPAIAN OUTPUT</th>
                <th colSpan={3} className="center" style={{ borderBottom:`1px solid ${S.border2}` }}>DOKUMEN</th>
                <th rowSpan={2} className="center">VERIFIKASI</th>
                <th rowSpan={2} className="center" style={{ minWidth:145 }}>STATUS VERIFIKATOR</th>
                <th rowSpan={2} className="center">CROSSCHECK</th>
              </tr>
              <tr>
                <th>TIPE</th><th className="right">PANJANG RK</th><th>SATUAN</th>
                <th>TIPE</th><th className="right">PANJANG DAK</th><th>SATUAN</th>
                <th className="center">PHO</th><th className="center">SPTJM</th><th className="center">UPLOAD</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={19} style={{ fontWeight:700,fontSize:11,color:S.accent,background:"rgba(26,127,224,0.05)",padding:"7px 14px" }}>Penanganan Jalan (Provinsi)</td></tr>
              <tr>
                <td>1</td>
                <td style={{ fontSize:11,lineHeight:1.5 }}>{kegiatan.tipeTematik}</td>
                <td style={{ fontSize:11 }}>{kegiatan.menuKegiatan}</td>
                <td style={{ fontSize:11 }}>{kegiatan.rincianKegiatan}</td>
                <td style={{ fontSize:11 }}>Jl. Batas Aceh Timur - Kota Karang Baru</td>
                <td></td><td></td><td className="right">1.50</td><td>km</td><td></td>
                <td className="right">1.50</td><td>km</td>
                <td className="center"><button className="btn btn-danger btn-xs"><FileText size={10}/> PDF</button></td>
                <td className="center"><button className="btn btn-danger btn-xs"><FileText size={10}/> PDF</button></td>
                <td className="center">{isPemda?<button className="btn btn-primary btn-xs"><Upload size={10}/> Upload</button>:<button className="btn btn-success btn-xs"><Eye size={10}/> Lihat</button>}</td>
                <td className="center">
                  <div style={{ width:22,height:22,borderRadius:6,background:verifikasi?"var(--purple-bg)":"transparent",border:`2px solid ${verifikasi?"var(--purple)":S.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:!isPemda?"pointer":"default",margin:"0 auto" }}
                    onClick={()=>!isPemda&&setVerifikasi(!verifikasi)}>
                    {verifikasi&&<CheckCircle size={13} color={S.purple}/>}
                  </div>
                </td>
                <td className="center">
                  {isPemda ? <span className={`badge ${statusOutput==="Terlaksana"?"badge-green":statusOutput==="Terkendala"?"badge-yellow":"badge-red"}`}>{statusOutput}</span>
                  : <select value={statusOutput} onChange={e=>setStatusOutput(e.target.value)}
                      style={{ background:opt.bg,color:opt.color,border:`1px solid ${opt.border}`,borderRadius:6,padding:"4px 8px",fontSize:11,fontWeight:700 }}>
                      {STATUS_OUTPUT_OPTS.map(s=><option key={s.value} value={s.value} style={{ background:"var(--surface2)",color:"var(--text)" }}>{s.value}</option>)}
                    </select>}
                </td>
                <td className="center"><CrosscheckBtn uploaded verifiedPFID={verifikasi} isPemda={isPemda} catatan={catatan} onVerify={()=>setVerifikasi(true)} onReject={c=>setCatatan(c)} small/></td>
              </tr>
              <tr style={{ background:"rgba(255,213,40,0.04)" }}>
                <td colSpan={4}/><td style={{ fontSize:11 }}>Peningkatan/Rekonstruksi</td>
                <td style={{ background:"var(--yellow-bg)",textAlign:"center",fontWeight:700,fontSize:11,color:S.yellow }}>AC WC</td>
                <td style={{ background:"var(--yellow-bg)",textAlign:"center",fontWeight:700,fontSize:11,color:S.yellow }}>AC WC</td>
                <td className="right">1.50</td><td>km</td>
                <td style={{ background:"var(--yellow-bg)",textAlign:"center",fontWeight:700,fontSize:11,color:S.yellow }}>AC WC</td>
                <td className="right" style={{ background:"var(--yellow-bg)",fontWeight:700,color:S.yellow }}>1.50</td>
                <td colSpan={8}></td>
              </tr>
              <tr style={{ background:S.surface2 }}>
                <td colSpan={7} style={{ textAlign:"right",fontWeight:800,textTransform:"uppercase",fontSize:12 }}>Total Jalan</td>
                <td className="right" style={{ fontWeight:800 }}>1.50</td><td></td><td></td>
                <td className="right" style={{ fontWeight:800 }}>1.50</td><td colSpan={8}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {!isPemda&&(
        <div className="detail-card">
          <div className="detail-card-header">
            <span style={{ fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8 }}><MessageSquare size={14} color={S.accent}/> Catatan Verifikator PFID</span>
            <button className="btn btn-outline btn-xs" onClick={()=>setEditCat(!editCat)}>{editCat?"Simpan":"Edit"}</button>
          </div>
          <div style={{ padding:16 }}>
            {editCat ? <textarea value={catatan} onChange={e=>setCatatan(e.target.value)} placeholder="Catatan hasil verifikasi realisasi output..."
              style={{ width:"100%",background:S.surface2,border:`1px solid ${S.border}`,borderRadius:8,color:S.text,fontSize:13,padding:"10px 14px",resize:"vertical",minHeight:80 }}/>
            : <div style={{ fontSize:13,color:catatan?S.text:S.muted,fontStyle:catatan?"normal":"italic" }}>{catatan||"Belum ada catatan."}</div>}
          </div>
        </div>
      )}
      {isPemda&&catatan&&<div className="alert alert-warn" style={{ marginTop:12 }}><AlertTriangle size={14}/><div><strong>Catatan dari PFID:</strong> {catatan}</div></div>}
    </div>
  );
}

/* ════════════════════════════════════════════
   TAB: KELENGKAPAN DOKUMEN
   - TW1: tidak ada update_kurva_s
   - TW2-4: ada cek 100% fisik, jika 100% di TW sebelumnya → TW selanjutnya locked + auto-centang
   - Setelah centang 100%: muncul dokumen PHO, BAST, BA Teknis
   - Laporan Word + WA
════════════════════════════════════════════ */
function TabKelengkapan({ isPemda, terkontrak, triwulan, pemda, pemda_info, docState, onDocChange, fisik100PerTW, onFisik100Change, statusPengadaan }) {
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  const docs = DOCS_KELENGKAPAN_PER_TW[triwulan] || [];
  // Cek apakah TW sebelumnya sudah 100%
  const prevTWMap = { TW2:"TW1", TW3:"TW2", TW4:"TW3" };
  const prevTW = prevTWMap[triwulan];
  const prevIs100 = prevTW ? !!fisik100PerTW[prevTW] : false;
  const currentIs100 = !!fisik100PerTW[triwulan];

  // Jika TW sebelumnya sudah 100%, TW ini hanya tampilkan status centang + locked
  const isLockedByPrev = (triwulan !== "TW1") && prevIs100;

  // Dokumen PHO hanya muncul setelah centang 100%
  const showPHO = currentIs100;

  const allDocsForReport = [...docs, ...(showPHO ? DOCS_PHO : [])];
  const uploaded = allDocsForReport.filter(d => (docState[d.id]||{}).uploaded).length;
  const verified = allDocsForReport.filter(d => (docState[d.id]||{}).verifiedPFID).length;
  const reqDocs = allDocsForReport.filter(d => d.required);
  const reqDone = reqDocs.filter(d => (docState[d.id]||{}).uploaded).length;
  const notOk = allDocsForReport.filter(d => {
    const st = docState[d.id]||{};
    return (d.required&&!st.uploaded)||(st.uploaded&&!st.verifiedPFID&&st.catatan);
  });
  const pct = allDocsForReport.length ? Math.round(uploaded/allDocsForReport.length*100) : 0;

  const waNumber = pemda_info?.noHPOPD||"";
  const waMsg = encodeURIComponent(`Yth. ${pemda_info?.namaOPD||pemda}\n\nHasil monitoring kelengkapan dokumen DAK Bidang Jalan ${triwulan} dari PFID Kementerian PUPR.\n\nTerdapat ${notOk.length} dokumen perlu ditindaklanjuti. Mohon segera dilengkapi.\n\nTerima kasih.`);

  function handleGenerateWord() {
    setGeneratingReport(true);
    try {
      var snDocs    = allDocsForReport.slice();
      var snNotOk   = notOk.slice();
      var snState   = docState;
      var namaOPD   = (pemda_info && pemda_info.namaOPD)  ? pemda_info.namaOPD  : (pemda || "-");
      var tanggal   = new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"});

      var tableRows = snDocs.map(function(doc, i) {
        var st       = snState[doc.id] || {};
        var wajib    = doc.required ? "Ya" : "Tidak";
        var status   = st.verifiedPFID ? "Terverifikasi" : st.uploaded ? "Menunggu Verif" : "Belum Upload";
        var bg       = st.verifiedPFID ? "#c6efce" : st.uploaded ? "#ffeb9c" : "#ffc7ce";
        var catatan  = st.catatan || "-";
        return "<tr>"
          + "<td style='border:1px solid #000;padding:5px 8px;text-align:center'>"+(i+1)+"</td>"
          + "<td style='border:1px solid #000;padding:5px 8px'>"+doc.label+"</td>"
          + "<td style='border:1px solid #000;padding:5px 8px;text-align:center;font-weight:bold'>"+wajib+"</td>"
          + "<td style='border:1px solid #000;padding:5px 8px;text-align:center;background:"+bg+";font-weight:bold'>"+status+"</td>"
          + "<td style='border:1px solid #000;padding:5px 8px'>"+catatan+"</td></tr>";
      }).join("");

      var totalDok = snDocs.length;
      var uploaded = snDocs.filter(function(d){ return (snState[d.id]||{}).uploaded; }).length;
      var verified = snDocs.filter(function(d){ return (snState[d.id]||{}).verifiedPFID; }).length;
      var belumOk  = snNotOk.length;

      var tindakList = belumOk === 0
        ? "<p style='color:#375623'>Seluruh dokumen telah sesuai dan lengkap.</p>"
        : "<ul style='margin:4pt 0 0 0'>" + snNotOk.map(function(doc){
            var st  = snState[doc.id] || {};
            var ket = st.catatan ? " &mdash; " + st.catatan : "";
            var ext = !st.uploaded ? " (belum diunggah)" : " (menunggu verifikasi PFID)";
            return "<li style='margin-bottom:4pt'>"+doc.label+ket+ext+"</li>";
          }).join("") + "</ul>";

      var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'>"
        + "<style>body{font-family:Arial,sans-serif;font-size:11pt;margin:2.5cm 2cm;color:#000}"
        + "h1{font-size:13pt;text-align:center;margin:0 0 2pt 0}"
        + "h2{font-size:11pt;margin:14pt 0 6pt 0}"
        + ".kop{text-align:center;margin-bottom:14pt;border-bottom:3px double #000;padding-bottom:10pt}"
        + "table{border-collapse:collapse;width:100%}"
        + "th{border:1px solid #000;padding:5px 8px;background:#1F4E79;color:#fff;font-size:10pt;text-align:center}"
        + "td{font-size:10pt}"
        + ".it td{border:none;padding:2pt 6pt;vertical-align:top}"
        + ".it .lb{width:120pt;font-weight:bold}.it .sp{width:10pt;text-align:center}"
        + ".section{margin-top:14pt}"
        + ".footer-note{font-style:italic;font-size:9.5pt;margin-top:10pt;border-top:1px solid #ccc;padding-top:6pt}"
        + "</style></head><body>"
        + "<div class='kop'>"
        + "<h1>KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT</h1>"
        + "<h1>DIREKTORAT JENDERAL BINA MARGA</h1>"
        + "<h1>PUSAT FASILITASI INFRASTRUKTUR DAERAH (PFID)</h1>"
        + "<p style='font-size:13pt;font-weight:bold;margin-top:6pt'>LAPORAN HASIL VERIFIKASI DOKUMEN</p>"
        + "<p style='font-size:12pt;font-weight:bold'>DAK BIDANG JALAN &mdash; "+triwulan.toUpperCase()+" TAHUN ANGGARAN 2024</p>"
        + "<p>Pemerintah Daerah: <strong>"+(pemda||"-")+"</strong></p></div>"
        + "<table class='it' style='margin-bottom:12pt'><tbody>"
        + "<tr><td class='lb'>Kepada Yth.</td><td class='sp'>:</td><td><strong>Kepala "+namaOPD+"</strong></td></tr>"
        + "<tr><td class='lb'>Perihal</td><td class='sp'>:</td><td><strong>Hasil Verifikasi Kelengkapan Dokumen "+triwulan+" DAK Bidang Jalan TA 2024</strong></td></tr>"
        + "<tr><td class='lb'>Tanggal Laporan</td><td class='sp'>:</td><td>"+tanggal+"</td></tr>"
        + "</tbody></table>"
        + "<div class='section'><h2>I.&nbsp; RINGKASAN HASIL VERIFIKASI</h2>"
        + "<p>Berdasarkan hasil verifikasi yang dilakukan oleh PFID Kementerian PUPR terhadap kelengkapan dokumen "
        + triwulan+" DAK Bidang Jalan Tahun Anggaran 2024 untuk "+(pemda||"-")+", diperoleh hasil sebagai berikut:</p>"
        + "<table style='margin-top:8pt'><tbody>"
        + "<tr><td style='border:1px solid #000;padding:5px 8px;font-weight:bold;background:#f0f0f0'>URAIAN</td><td style='border:1px solid #000;padding:5px 8px;font-weight:bold;background:#f0f0f0'>KETERANGAN</td></tr>"
        + "<tr><td style='border:1px solid #000;padding:5px 8px'>Total Dokumen yang Dipersyaratkan</td><td style='border:1px solid #000;padding:5px 8px;font-weight:bold'>"+totalDok+" dokumen</td></tr>"
        + "<tr><td style='border:1px solid #000;padding:5px 8px'>Dokumen Telah Diupload</td><td style='border:1px solid #000;padding:5px 8px;font-weight:bold'>"+uploaded+" dokumen</td></tr>"
        + "<tr><td style='border:1px solid #000;padding:5px 8px'>Dokumen Terverifikasi PFID</td><td style='border:1px solid #000;padding:5px 8px;font-weight:bold'>"+verified+" dokumen</td></tr>"
        + "<tr><td style='border:1px solid #000;padding:5px 8px'>Dokumen Belum Sesuai / Belum Upload</td><td style='border:1px solid #000;padding:5px 8px;font-weight:bold'>"+belumOk+" dokumen</td></tr>"
        + "</tbody></table></div>"
        + "<div class='section'><h2>II.&nbsp; DETAIL KELENGKAPAN DOKUMEN</h2>"
        + "<table><thead><tr>"
        + "<th style='width:4%'>NO</th><th style='width:36%'>DOKUMEN</th>"
        + "<th style='width:8%'>WAJIB</th><th style='width:14%'>STATUS</th>"
        + "<th style='width:38%'>CATATAN PFID</th>"
        + "</tr></thead><tbody>"+tableRows+"</tbody></table></div>"
        + "<div class='section'><h2>III.&nbsp; TINDAK LANJUT YANG DIPERLUKAN</h2>"
        + "<p>Berdasarkan hasil verifikasi di atas, kami memohon kepada Pemerintah Daerah untuk segera menindaklanjuti hal-hal berikut:</p>"
        + tindakList
        + "<p class='footer-note'>Mohon dokumen yang belum sesuai segera dilengkapi melalui sistem eMonitoring DAK paling lambat 7 hari kerja setelah surat ini diterima.</p>"
        + "</div>"
        + "<div class='section'><h2>IV.&nbsp; PENUTUP</h2>"
        + "<p>Demikian laporan hasil verifikasi ini kami sampaikan. Atas perhatian dan kerja sama Saudara, kami ucapkan terima kasih.</p>"
        + "<div style='margin-top:40pt;text-align:right'>"
        + "<p>Jakarta, "+tanggal+"</p>"
        + "<p>Kepala Pusat Fasilitasi Infrastruktur Daerah</p>"
        + "<p>Kementerian PUPR</p>"
        + "<p style='margin-top:60pt'>(.......................................)</p>"
        + "<p>NIP. ......................................</p>"
        + "</div></div>"
        + "</body></html>";

      var blob = new Blob([html], { type: "application/msword;charset=utf-8" });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement("a");
      a.href   = url;
      a.download = "Laporan_Verifikasi_"+triwulan+"_"+(pemda||"").split(" ").join("_")+".doc";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setReportDone(true);
    } catch(e) {
      alert("Gagal generate Word: " + (e && e.message ? e.message : "Error tidak diketahui"));
    } finally {
      setGeneratingReport(false);
    }
  }


    // Dokumen berdasarkan status pengadaan (sebelum Terkontrak)
  if (!terkontrak) {
    const statusPengadaanLocal = statusPengadaan || "Persiapan";
    const isPersiapan = statusPengadaanLocal === "Persiapan";
    const isPBJ = statusPengadaanLocal === "Proses Pengadaan Barang & Jasa";

    const docsPersiapan = [
      { id:"ded_persiapan", label:"DED Final RK (Layout/Stripmap, Typical Cross Section, RAB)", required:true, keterangan:"Dokumen perencanaan teknis lengkap" },
      { id:"dpa_persiapan", label:"DPA (Dokumen Pelaksanaan Anggaran)", required:true, keterangan:"Wajib ditandatangani sebelum proses lelang" },
    ];
    const docsPBJ = [
      { id:"ded_lelang", label:"DED Dokumen Lelang (RAB, Spesifikasi Teknis, Gambar Rencana)", required:true, keterangan:"Dokumen teknis untuk proses lelang" },
    ];

    const activeDocs = isPersiapan ? docsPersiapan : isPBJ ? docsPBJ : [];

    return (
      <div>
        <div style={{ background:"var(--yellow-bg)",border:"1px solid var(--yellow)",borderRadius:10,padding:"14px 18px",marginBottom:20,display:"flex",gap:12,alignItems:"flex-start" }}>
          <AlertTriangle size={16} color={S.yellow} style={{ flexShrink:0,marginTop:2 }}/>
          <div>
            <div style={{ fontWeight:700,color:S.yellow,marginBottom:4 }}>Status: {statusPengadaanLocal}</div>
            <div style={{ fontSize:12,color:S.muted }}>
              {isPersiapan && "Pada tahap persiapan, PEMDA wajib melengkapi DED Final RK dan DPA sebelum melanjutkan ke proses pengadaan."}
              {isPBJ && "Pada tahap Proses PBJ, PEMDA wajib melengkapi DED Dokumen Lelang untuk proses pengadaan barang & jasa."}
            </div>
          </div>
        </div>

        {activeDocs.length > 0 && (
          <div className="checklist-panel" style={{ marginBottom:20 }}>
            <div className="checklist-header">
              <span className="checklist-title">
                <FileText size={14} color={S.accent}/>
                {isPersiapan ? "Dokumen Tahap Persiapan" : "Dokumen Tahap Proses PBJ"}
              </span>
            </div>
            {activeDocs.map(doc => {
              const st = docState[doc.id]||{};
              return <DocRow key={doc.id} doc={doc} state={st} isPemda={isPemda}
                onUpload={()=>onDocChange(doc.id,{ uploaded:true,verifiedPFID:false,catatan:"" })}
                onVerify={()=>onDocChange(doc.id,{ ...st,verifiedPFID:true,tanggalVerif:new Date().toISOString().split("T")[0] })}
                onReject={cat=>onDocChange(doc.id,{ ...st,verifiedPFID:false,catatan:cat })}/>;
            })}
          </div>
        )}

        <div style={{ padding:"30px 0",textAlign:"center" }}>
          <Lock size={36} color={S.muted} style={{ marginBottom:12 }}/>
          <div style={{ fontSize:14,fontWeight:700,color:S.muted,marginBottom:6 }}>Dokumen Kontrak Belum Tersedia</div>
          <div style={{ fontSize:12,color:S.dim,maxWidth:360,margin:"0 auto" }}>
            Kelengkapan dokumen kontrak (SPMK, Kurva S, dll) baru dapat diisi setelah status <strong style={{ color:S.yellow }}>Terkontrak</strong>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cek 100% fisik (TW2-4) */}
      {triwulan !== "TW1" && (
        <div style={{ background:currentIs100?"var(--green-bg)":"var(--surface2)",border:`1px solid ${currentIs100?"var(--green)":S.border2}`,borderRadius:10,padding:"14px 18px",marginBottom:20 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ cursor:(!isPemda&&!isLockedByPrev)||(isPemda&&!isLockedByPrev)?"pointer":"default" }}
              onClick={() => !isLockedByPrev && onFisik100Change(triwulan, !currentIs100)}>
              <div style={{ width:28,height:28,borderRadius:8,background:currentIs100?"var(--green-bg)":"transparent",border:`2px solid ${currentIs100?"var(--green)":S.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s" }}>
                {currentIs100 && <CheckCircle size={18} color={S.green}/>}
              </div>
            </div>
            <div>
              <div style={{ fontWeight:700,fontSize:14,color:currentIs100?S.green:S.text }}>Pekerjaan Fisik Telah 100%</div>
              <div style={{ fontSize:12,color:S.muted }}>
                {isLockedByPrev ? `Otomatis tercentang karena ${prevTW} sudah 100%` : "Centang jika pekerjaan fisik sudah mencapai 100%"}
              </div>
            </div>
            {isLockedByPrev && <span className="badge badge-green" style={{ marginLeft:"auto" }}>Auto dari {prevTW}</span>}
          </div>
          {currentIs100 && (
            <div style={{ marginTop:12,paddingTop:12,borderTop:`1px solid var(--green)`,fontSize:12,color:S.green }}>
              v Dokumen PHO, BAST, dan BA Pemeriksaan Teknis wajib diupload setelah pekerjaan 100%
            </div>
          )}
        </div>
      )}

      {/* Locked state  -  jika TW sebelumnya 100%, TW ini auto grey */}
      {isLockedByPrev && (
        <div className="alert alert-info" style={{ marginBottom:16 }}>
          <Info size={14}/>
          <div>
            <strong>Pekerjaan sudah 100% sejak {prevTW}.</strong> Dokumen {triwulan} terkunci otomatis dan dianggap selesai. Status pelaporan {triwulan} diteruskan dari {prevTW}.
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20 }}>
        {[
          { label:"Dokumen Diupload", val:`${uploaded}/${allDocsForReport.length}`, color:S.accent },
          { label:"Terverifikasi PFID", val:`${verified}/${allDocsForReport.length}`, color:verified===allDocsForReport.length?S.green:S.yellow },
          { label:"Wajib Terpenuhi", val:`${reqDone}/${reqDocs.length}`, color:reqDone===reqDocs.length?S.green:S.red },
          { label:"Belum Sesuai", val:notOk.length, color:notOk.length===0?S.green:S.red },
        ].map(card=>(
          <div key={card.label} style={{ background:S.surface,border:`1px solid ${S.border2}`,borderRadius:10,padding:"14px 16px",opacity:isLockedByPrev?0.5:1 }}>
            <div style={{ fontSize:10,color:S.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6 }}>{card.label}</div>
            <div style={{ fontSize:24,fontWeight:800,color:card.color }}>{card.val}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom:20,opacity:isLockedByPrev?0.5:1 }}>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6 }}>
          <span style={{ color:S.muted,fontWeight:600 }}>Kelengkapan {triwulan}</span>
          <span style={{ color:getColor(pct),fontWeight:700 }}>{pct}%</span>
        </div>
        <div style={{ height:8,background:S.border,borderRadius:99,overflow:"hidden" }}>
          <div style={{ width:`${pct}%`,height:"100%",background:isLockedByPrev?"var(--text-dim)":getColor(pct),borderRadius:99,transition:"width 0.6s" }}/>
        </div>
      </div>

      {/* Checklist kelengkapan */}
      <div className="checklist-panel" style={{ marginBottom:24,opacity:isLockedByPrev?0.45:1,pointerEvents:isLockedByPrev?"none":"auto" }}>
        <div className="checklist-header">
          <span className="checklist-title"><FileText size={14} color={S.accent}/> Kelengkapan Dokumen  -  {triwulan}</span>
          {!isPemda&&uploaded>0&&!isLockedByPrev&&(
            <button className="btn btn-success btn-sm" onClick={()=>{
              allDocsForReport.filter(d=>(docState[d.id]||{}).uploaded&&!(docState[d.id]||{}).verifiedPFID).forEach(d=>
                onDocChange(d.id,{ ...(docState[d.id]||{}),verifiedPFID:true,tanggalVerif:new Date().toISOString().split("T")[0] })
              );
            }}><CheckSquare size={12}/> Verifikasi Semua</button>
          )}
        </div>
        {docs.map(doc=>{
          const st=docState[doc.id]||{};
          return <DocRow key={doc.id} doc={doc} state={st} isPemda={isPemda}
            onUpload={()=>onDocChange(doc.id,{ uploaded:true,verifiedPFID:false,catatan:"" })}
            onVerify={()=>onDocChange(doc.id,{ ...st,verifiedPFID:true,tanggalVerif:new Date().toISOString().split("T")[0] })}
            onReject={cat=>onDocChange(doc.id,{ ...st,verifiedPFID:false,catatan:cat })}/>;
        })}
      </div>

      {/* PHO docs  -  hanya jika centang 100% */}
      {showPHO && !isLockedByPrev && (
        <div className="checklist-panel" style={{ marginBottom:24,border:"1px solid var(--green)" }}>
          <div className="checklist-header" style={{ background:"var(--green-bg)" }}>
            <span className="checklist-title"><CheckCircle size={14} color={S.green}/> Dokumen Serah Terima (Fisik 100%)</span>
          </div>
          {DOCS_PHO.map(doc=>{
            const st=docState[doc.id]||{};
            return <DocRow key={doc.id} doc={doc} state={st} isPemda={isPemda}
              onUpload={()=>onDocChange(doc.id,{ uploaded:true,verifiedPFID:false,catatan:"" })}
              onVerify={()=>onDocChange(doc.id,{ ...st,verifiedPFID:true,tanggalVerif:new Date().toISOString().split("T")[0] })}
              onReject={cat=>onDocChange(doc.id,{ ...st,verifiedPFID:false,catatan:cat })}/>;
          })}
        </div>
      )}

      {/* ── LAPORAN PFID ── */}
      <div style={{ borderTop:`2px dashed ${S.border}`,paddingTop:24 }}>
        <div className="section-title"><FileText size={13}/>Laporan Hasil Verifikasi PFID</div>
        {notOk.length===0 ? (
          <div style={{ background:"var(--green-bg)",border:"1px solid var(--green)",borderRadius:10,padding:"16px 20px",display:"flex",alignItems:"center",gap:12,marginBottom:20 }}>
            <CheckCircle size={20} color={S.green}/>
            <div><div style={{ fontWeight:700,color:S.green }}>Semua dokumen sudah sesuai</div>
              <div style={{ fontSize:12,color:S.muted }}>Tidak ada dokumen yang perlu ditindaklanjuti untuk {triwulan}.</div></div>
          </div>
        ) : (
          <div style={{ background:"var(--red-bg)",border:"1px solid var(--red)",borderRadius:10,padding:"14px 20px",marginBottom:20 }}>
            <div style={{ fontWeight:700,color:S.red,marginBottom:8,display:"flex",alignItems:"center",gap:8 }}>
              <AlertTriangle size={16}/> {notOk.length} Dokumen Belum Sesuai
            </div>
            {notOk.map((doc,i)=>{ const st=docState[doc.id]||{}; return (
              <div key={doc.id} style={{ fontSize:12,display:"flex",gap:8,marginBottom:4 }}>
                <span style={{ color:S.red,fontWeight:700,flexShrink:0 }}>{i+1}.</span>
                <span><strong>{doc.label}</strong>{st.catatan&&<span style={{ color:S.muted }}>  -  {st.catatan}</span>}{!st.uploaded&&<span style={{ color:S.red }}>  -  Belum diupload</span>}</span>
              </div>
            );})}
          </div>
        )}

        {/* OPD Contact Box + Generate Report */}
        {!isPemda && (
          <div style={{ display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap",marginBottom:16 }}>
            {/* Kotak OPD  -  klik buka WA */}
            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer"
              style={{ display:"flex",gap:12,alignItems:"center",background:S.surface2,border:"1px solid var(--green)",borderRadius:10,padding:"12px 18px",textDecoration:"none",minWidth:260,cursor:"pointer",transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--green-bg)"}
              onMouseLeave={e=>e.currentTarget.style.background=S.surface2}>
              <div style={{ width:40,height:40,borderRadius:"50%",background:"var(--green-bg)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <Phone size={18} color={S.green}/>
              </div>
              <div>
                <div style={{ fontSize:10,color:S.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em" }}>Kontak OPD</div>
                <div style={{ fontSize:13,fontWeight:700,color:S.text }}>{pemda_info?.namaOPD||pemda}</div>
                <div style={{ fontSize:11,color:S.green,fontFamily:"'DM Mono',monospace" }}>+{waNumber} * Chat WA</div>
              </div>
            </a>

            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              <button className="btn btn-primary" onClick={handleGenerateWord} disabled={generatingReport}>
                {generatingReport?<RefreshCw size={13} style={{ animation:"spin 1s linear infinite" }}/>:<Download size={13}/>}
                {generatingReport?"Membuat laporan...":"Download Laporan Word (.docx)"}
              </button>
              {reportDone && (
                <div style={{ display:"flex",gap:8,alignItems:"center",flexWrap:"wrap" }}>
                  <span style={{ fontSize:12,color:S.green,display:"flex",alignItems:"center",gap:5 }}>
                    <CheckCircle size={13}/> File berhasil didownload
                  </span>
                  <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noreferrer"
                    className="btn btn-sm" style={{ background:"#25D366",color:"#fff",border:"none",display:"flex",alignItems:"center",gap:6 }}>
                    <Phone size={12}/> Kirim Notif via WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PEMDA DETAIL
════════════════════════════════════════════ */
const TABS=[
  { id:"status",     label:"Status",           icon:Clock },
  { id:"kontrak",    label:"Data Kontrak",      icon:FileText },
  { id:"progres",    label:"Data Progres",      icon:TrendingUp },
  { id:"foto",       label:"Foto Kegiatan",     icon:Camera },
  { id:"output",     label:"Realisasi Output",  icon:BarChart2 },
  { id:"kelengkapan",label:"Kelengkapan Dok.",  icon:CheckSquare, highlight:true },
];

export default function PemdaDetail({ pemda, provinsi, triwulan, setPage }) {
  const [tab, setTab] = useState("status");
  const [isPemda, setIsPemda] = useState(false);
  const kegiatan = sampleKegiatan["Provinsi Aceh"]?.[0]||{};
  const pemda_info = { namaOPD:"Dinas PUPR Provinsi Aceh", noHPOPD:"6281234567890" };
  const [statusHistory, setStatusHistory] = useState(sampleStatusHistory);
  const latestStatus = statusHistory.length ? statusHistory[statusHistory.length-1].status : "Persiapan";
  const terkontrak = isTerkontrak(latestStatus);
  const [docState, setDocState] = useState({});
  function onDocChange(id, patch) { setDocState(s=>({ ...s,[id]:{ ...(s[id]||{}),...patch } })); }
  // Fisik 100% per TW  -  shared state untuk logika lock
  const [fisik100PerTW, setFisik100PerTW] = useState({ TW1:false,TW2:false,TW3:false,TW4:false });
  function onFisik100Change(tw, val) {
    setFisik100PerTW(s => {
      const next = { ...s, [tw]: val };
      // Propagasi ke TW berikutnya jika val=true
      if (val) {
        const order = ["TW1","TW2","TW3","TW4"];
        const idx = order.indexOf(tw);
        for (let i=idx+1;i<order.length;i++) next[order[i]] = true;
      }
      return next;
    });
  }
  const twInfo = getTWDeadlineInfo(triwulan);
  const allKelDocs = terkontrak ? [...(DOCS_KELENGKAPAN_PER_TW[triwulan]||[]),...(fisik100PerTW[triwulan]?DOCS_PHO:[])] : [];
  const pendingVerif = allKelDocs.filter(d=>(docState[d.id]||{}).uploaded&&!(docState[d.id]||{}).verifiedPFID).length;
  const belumUpload = allKelDocs.filter(d=>d.required&&!(docState[d.id]||{}).uploaded).length;
  const sc = getStatusColor(latestStatus);
  return (
    <div>
      <div className="page-header" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <div><h1>{pemda}</h1><p>Bidang Jalan * {provinsi} * {triwulan}</p></div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <span style={{ fontSize:11,color:S.muted,fontWeight:600 }}>TAMPILAN:</span>
          <button className={`btn btn-sm ${!isPemda?"btn-primary":"btn-outline"}`} onClick={()=>setIsPemda(false)}><Zap size={12}/> PFID / Pusat</button>
          <button className={`btn btn-sm ${isPemda?"btn-primary":"btn-outline"}`} onClick={()=>setIsPemda(true)}><Users size={12}/> PEMDA</button>
        </div>
      </div>

      {/* Deadline warning global */}
      {twInfo?.overdue && (
        <div className="alert alert-warn" style={{ marginBottom:12 }}>
          <AlertTriangle size={14}/>
          <div><strong>Batas pelaporan {twInfo.label} telah terlewati!</strong> Penalti keterlambatan akan dicatat. Silakan segera lengkapi pelaporan {triwulan}.</div>
        </div>
      )}

      {/* Summary bar */}
      <div style={{ background:S.surface2,border:`1px solid ${S.border2}`,borderRadius:"var(--radius-lg)",padding:"14px 20px",marginBottom:20,display:"flex",gap:20,flexWrap:"wrap",alignItems:"center" }}>
        <div style={{ flex:1,minWidth:220 }}>
          <div style={{ fontSize:10,color:S.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4 }}>Paket Kegiatan</div>
          <div style={{ fontWeight:700,fontSize:13,lineHeight:1.5 }}>01  -  Penanganan Long Segment Jl. Batas Aceh Timur - Kota Karang Baru</div>
        </div>
        {[{ label:"Realisasi Keuangan",val:"97.55%",color:S.green },{ label:"Progres Fisik",val:"98.65%",color:S.green }].map(s=>(
          <div key={s.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:10,color:S.muted,fontWeight:700,textTransform:"uppercase",marginBottom:4 }}>{s.label}</div>
            <div style={{ fontWeight:800,fontSize:20,color:s.color }}>{s.val}</div>
          </div>
        ))}
        <div style={{ background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:8,padding:"8px 16px",textAlign:"center" }}>
          <div style={{ fontSize:9,color:S.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em" }}>Status Pengadaan</div>
          <div style={{ fontSize:13,fontWeight:800,color:sc.color }}>{latestStatus}</div>
        </div>
        {twInfo && (
          <div style={{ background:twInfo.overdue?"var(--red-bg)":"var(--surface2)",border:`1px solid ${twInfo.overdue?"var(--red)":S.border2}`,borderRadius:8,padding:"8px 14px",textAlign:"center" }}>
            <div style={{ fontSize:9,color:S.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em" }}>Deadline {triwulan}</div>
            <div style={{ fontSize:12,fontWeight:800,color:twInfo.overdue?S.red:S.text,fontFamily:"'DM Mono',monospace" }}>{twInfo.deadline}</div>
            {twInfo.overdue ? <div style={{ fontSize:10,color:S.red,fontWeight:600 }}>TERLAMBAT</div> : <div style={{ fontSize:10,color:S.muted }}>{twInfo.daysLeft}h lagi</div>}
          </div>
        )}
      </div>

      {!terkontrak&&<div className="alert alert-warn" style={{ marginBottom:16 }}><AlertTriangle size={14}/><div><strong>Segera lakukan kontrak!</strong> Kelengkapan dokumen kontrak belum bisa diisi. Data progres masih bisa diupdate.</div></div>}

      <div className="tabs">
        {TABS.map(t=>{
          const locked=t.id==="kelengkapan"&&!terkontrak;
          return (
            <button key={t.id} className={`tab-item ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
              <t.icon size={13}/>{t.label}
              {t.id==="kelengkapan"&&!terkontrak&&<Lock size={10} style={{ marginLeft:2,color:S.muted }}/>}
              {t.id==="kelengkapan"&&terkontrak&&(pendingVerif+belumUpload)>0&&<span className="tab-badge warn">{pendingVerif+belumUpload}</span>}
            </button>
          );
        })}
      </div>

      {tab==="status"&&<TabStatus isPemda={isPemda} statusHistory={statusHistory} onUpdateHistory={setStatusHistory}
        triwulan={triwulan} twLaporanDates={{ TW1:"2024-04-05",TW2:"2024-07-06",TW3:"2024-10-04",TW4:null }}/>}
      {tab==="kontrak"&&<TabDataKontrak isPemda={isPemda} terkontrak={terkontrak} docState={docState} onDocChange={onDocChange}/>}
      {tab==="progres"&&<TabDataProgres isPemda={isPemda} terkontrak={terkontrak} triwulan={triwulan} kegiatan={kegiatan} docState={docState} onDocChange={onDocChange} fisik100PerTW={fisik100PerTW} onFisik100Change={onFisik100Change}/>}
      {tab==="foto"&&<TabFotoKegiatan isPemda={isPemda} triwulan={triwulan} kegiatan={kegiatan}/>}
      {tab==="output"&&<TabRealisasiOutput kegiatan={kegiatan} isPemda={isPemda}/>}
      {tab==="kelengkapan"&&<TabKelengkapan isPemda={isPemda} terkontrak={terkontrak} triwulan={triwulan}
        pemda={pemda} pemda_info={pemda_info} docState={docState} onDocChange={onDocChange}
        fisik100PerTW={fisik100PerTW} onFisik100Change={onFisik100Change} statusPengadaan={latestStatus}/>}
    </div>
  );
}
