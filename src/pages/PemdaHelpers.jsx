import { useState } from "react";
import {
  CheckCircle, Clock, Upload, FileText, AlertTriangle, X,
  Plus, Save, Calendar, ChevronDown, Lock, Eye, CheckSquare
} from "lucide-react";
import { STATUS_PENGADAAN, TW_DEADLINE } from "../data/mockData";

export const S = {
  surface:"var(--surface)", surface2:"var(--surface2)",
  border:"var(--border)", border2:"var(--border2)",
  text:"var(--text)", muted:"var(--text-muted)", dim:"var(--text-dim)",
  accent:"var(--accent-light)", green:"var(--green-light)", greenBg:"var(--green-bg)",
  yellow:"var(--yellow-light)", yellowBg:"var(--yellow-bg)",
  red:"var(--red-light)", redBg:"var(--red-bg)",
  purple:"var(--purple)", purpleBg:"var(--purple-bg)",
};

export function getColor(pct) {
  if (pct >= 95) return S.green;
  if (pct >= 80) return S.yellow;
  return S.red;
}
export function isTerkontrak(s) { return s === "Terkontrak"; }

export const STATUS_COLOR = {
  "Persiapan":{ bg:S.surface2, color:S.muted, border:S.border },
  "Proses Pengadaan Barang & Jasa":{ bg:"var(--yellow-bg)", color:S.yellow, border:"var(--yellow)" },
  "Terkontrak":{ bg:"var(--green-bg)", color:S.green, border:"var(--green)" },
};
export const getStatusColor = (s) => STATUS_COLOR[s] || STATUS_COLOR["Persiapan"];

/* ─── Deadline helper ─── */
export function getTWDeadlineInfo(triwulan) {
  const info = TW_DEADLINE[triwulan];
  if (!info) return null;
  const today = new Date();
  const deadline = new Date(info.deadline);
  const overdue = today > deadline;
  const daysLeft = Math.ceil((deadline - today) / 86400000);
  return { ...info, overdue, daysLeft, today };
}

/* ─── Upload Modal ─── */
export function UploadModal({ label, onClose, onConfirm, acceptVideo }) {
  const [file, setFile] = useState(null);
  const uid = "upm" + Math.random().toString(36).slice(2);
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:S.surface,border:`1px solid ${S.border}`,borderRadius:12,padding:28,width:440,maxWidth:"92vw" }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
          <div style={{ fontWeight:700,fontSize:15 }}>Upload Dokumen</div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:S.muted }}><X size={18}/></button>
        </div>
        <div style={{ fontSize:12,color:S.muted,marginBottom:16,background:S.surface2,padding:"10px 14px",borderRadius:8,lineHeight:1.6 }}>{label}</div>
        <div className="upload-zone" style={{ padding:"28px 20px",marginBottom:16,cursor:"pointer" }}
          onClick={() => document.getElementById(uid).click()}>
          <Upload size={26} style={{ marginBottom:8,opacity:0.5 }}/>
          <div style={{ fontWeight:600,fontSize:13 }}>{file ? file : "Klik untuk pilih file"}</div>
          <div style={{ fontSize:11,marginTop:4,color:S.dim }}>{acceptVideo ? "PDF, JPG, PNG, MP4 — maks 50MB" : "PDF, JPG, PNG — maks 10MB"}</div>
          <input id={uid} type="file" style={{ display:"none" }} onChange={e => setFile(e.target.files[0]?.name||null)}/>
        </div>
        <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
          <button className="btn btn-outline" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={() => onConfirm(file)}>
            <Upload size={13}/> Upload
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Crosscheck Button ─── */
export function CrosscheckBtn({ uploaded, verifiedPFID, isPemda, catatan, onVerify, onReject, small }) {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState("");
  if (!uploaded) return null;
  const sz = small ? "btn-xs" : "btn-sm";
  return (
    <div style={{ position:"relative",display:"inline-block" }}>
      <button className={`btn ${sz} ${verifiedPFID?"btn-success":isPemda?"btn-warn":"btn-primary"}`}
        onClick={() => setOpen(!open)}>
        {verifiedPFID ? <><CheckCircle size={11}/> Sesuai</> : isPemda ? <><Eye size={11}/> Status</> : <><CheckSquare size={11}/> Crosscheck</>}
      </button>
      {open && (
        <div style={{ position:"absolute",right:0,top:"calc(100% + 6px)",zIndex:500,background:S.surface,border:`1px solid ${S.border}`,borderRadius:10,padding:14,width:270,boxShadow:"0 8px 28px rgba(0,0,0,0.45)" }}>
          <div style={{ fontWeight:700,fontSize:12,marginBottom:8 }}>
            {verifiedPFID ? "✓ Terverifikasi PFID" : isPemda ? "Status Dokumen" : "Crosscheck Dokumen"}
          </div>
          {catatan && (
            <div style={{ fontSize:11,background:"var(--yellow-bg)",border:"1px solid var(--yellow)",borderRadius:6,padding:"7px 10px",marginBottom:8,color:S.yellow,lineHeight:1.5 }}>
              <strong>Catatan PFID:</strong> {catatan}
            </div>
          )}
          {!isPemda && !verifiedPFID && (
            <>
              <textarea value={cat} onChange={e => setCat(e.target.value)} placeholder="Catatan ketidaksesuaian..."
                style={{ width:"100%",background:S.surface2,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,fontSize:11,padding:"7px 9px",resize:"vertical",minHeight:55 }}/>
              <div style={{ display:"flex",gap:6,marginTop:8 }}>
                <button className="btn btn-danger btn-xs" style={{ flex:1 }} onClick={() => { onReject&&onReject(cat); setOpen(false); }}>
                  <X size={11}/> Tidak Sesuai
                </button>
                <button className="btn btn-success btn-xs" style={{ flex:1 }} onClick={() => { onVerify&&onVerify(); setOpen(false); }}>
                  <CheckCircle size={11}/> Sesuai
                </button>
              </div>
            </>
          )}
          <button className="btn btn-outline btn-xs" style={{ width:"100%",marginTop:8 }} onClick={() => setOpen(false)}>Tutup</button>
        </div>
      )}
    </div>
  );
}

/* ─── Doc Row ─── */
export function DocRow({ doc, state, isPemda, onUpload, onVerify, onReject, locked }) {
  const [modal, setModal] = useState(false);
  const st = state || {};
  return (
    <div className="checklist-item" style={{ opacity: locked ? 0.45 : 1, pointerEvents: locked ? "none" : "auto" }}>
      <div className={`check-icon ${st.verifiedPFID?"verified":st.uploaded?"done":"empty"}`}>
        {(st.verifiedPFID||st.uploaded) && <CheckCircle size={12}/>}
      </div>
      <div className="check-info">
        <div className="check-label">
          {doc.label}
          {doc.required && <span className="check-required"> *wajib</span>}
          {locked && <Lock size={11} style={{ marginLeft:6,color:S.dim }}/>}
        </div>
        <div className="check-meta" style={{ display:"flex",gap:6,flexWrap:"wrap",marginTop:3 }}>
          {st.verifiedPFID && <span className="pfid-stamp pfid-verified">✓ Diverifikasi PFID {st.tanggalVerif}</span>}
          {!st.verifiedPFID&&st.uploaded&&!st.catatan && <span className="pfid-stamp pfid-pending">⏳ Menunggu verifikasi PFID</span>}
          {!st.verifiedPFID&&st.uploaded&&st.catatan && <span className="pfid-stamp" style={{ background:"var(--yellow-bg)",color:S.yellow,border:"1px solid var(--yellow)",borderRadius:99,padding:"2px 8px",fontSize:10,fontWeight:700 }}>⚠ Perlu perbaikan</span>}
          {!st.uploaded && <span className="pfid-stamp pfid-none">Belum diupload</span>}
          {doc.keterangan && <span style={{ fontSize:11,color:S.dim }}>· {doc.keterangan}</span>}
        </div>
        {st.catatan && (
          <div style={{ fontSize:11,color:S.yellow,background:"var(--yellow-bg)",borderRadius:5,padding:"5px 9px",marginTop:5,border:"1px solid rgba(210,153,34,0.3)" }}>
            <strong>Catatan PFID:</strong> {st.catatan}
          </div>
        )}
      </div>
      <div className="check-actions">
        {st.uploaded && <button className="btn btn-outline btn-xs"><Eye size={11}/> Lihat</button>}
        {isPemda&&!st.uploaded && <button className="btn btn-primary btn-xs" onClick={()=>setModal(true)}><Upload size={11}/> Upload</button>}
        {isPemda&&st.uploaded&&!st.verifiedPFID && <span style={{ fontSize:10,color:S.muted }}>Menunggu PFID</span>}
        {!isPemda&&st.uploaded && (
          <CrosscheckBtn uploaded verifiedPFID={st.verifiedPFID} isPemda={isPemda} catatan={st.catatan}
            onVerify={onVerify} onReject={onReject} small/>
        )}
      </div>
      {modal && <UploadModal label={doc.label} onClose={()=>setModal(false)} onConfirm={()=>{ onUpload(); setModal(false); }}/>}
    </div>
  );
}

/* ─── Status Modal ─── */
export function StatusModal({ history, onClose, onSave, isPemda }) {
  const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const [rows, setRows] = useState(history.map(h=>({...h})));
  const [nb, setNb] = useState("Januari"); const [nt, setNt] = useState("2024");
  const [ns, setNs] = useState("Persiapan"); const [nd, setNd] = useState("");
  function add() { if(!nd) return; setRows(r=>[...r,{ bulan:`${nb} ${nt}`,tanggal:nd,status:ns }]); }
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:S.surface,border:`1px solid ${S.border}`,borderRadius:14,padding:28,width:620,maxWidth:"95vw",maxHeight:"90vh",overflow:"auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}>
          <div><div style={{ fontWeight:800,fontSize:16 }}>Status Pengadaan per Bulan</div>
            <div style={{ fontSize:12,color:S.muted }}>Update status pengadaan setiap akhir bulan</div></div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:S.muted }}><X size={20}/></button>
        </div>
        <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
          {STATUS_PENGADAAN.map(s=>{ const c=getStatusColor(s); return (
            <span key={s} style={{ background:c.bg,color:c.color,border:`1px solid ${c.border}`,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:700 }}>{s}</span>
          );})}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:16 }}>
          {rows.map((row,i)=>{ const c=getStatusColor(row.status); return (
            <div key={i} style={{ display:"flex",alignItems:"center",gap:10,background:S.surface2,border:`1px solid ${S.border2}`,borderRadius:8,padding:"10px 14px" }}>
              <div style={{ width:12,height:12,borderRadius:"50%",background:c.color,flexShrink:0 }}/>
              <div style={{ width:130,fontSize:13,fontWeight:600 }}>{row.bulan}</div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:S.muted,width:90 }}>{row.tanggal}</div>
              <div style={{ flex:1 }}>
                {isPemda ? (
                  <select value={row.status} onChange={e=>setRows(r=>r.map((x,idx)=>idx===i?{...x,status:e.target.value}:x))}
                    style={{ background:c.bg,color:c.color,border:`1px solid ${c.border}`,borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700 }}>
                    {STATUS_PENGADAAN.map(s=><option key={s} value={s} style={{ background:"var(--surface2)",color:"var(--text)" }}>{s}</option>)}
                  </select>
                ) : (
                  <span style={{ background:c.bg,color:c.color,border:`1px solid ${c.border}`,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700 }}>{row.status}</span>
                )}
              </div>
              {isPemda && <button onClick={()=>setRows(r=>r.filter((_,idx)=>idx!==i))} style={{ background:"none",border:"none",cursor:"pointer",color:S.red,padding:4 }}><X size={14}/></button>}
            </div>
          );})}
        </div>
        {isPemda && (
          <div style={{ background:S.surface2,border:`1px dashed ${S.border}`,borderRadius:10,padding:16,marginBottom:16 }}>
            <div style={{ fontSize:12,fontWeight:700,color:S.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em" }}>Tambah Update Bulan Baru</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 80px 1fr 120px auto",gap:8,alignItems:"end" }}>
              <div>
                <div style={{ fontSize:11,color:S.muted,marginBottom:4 }}>Bulan</div>
                <select value={nb} onChange={e=>setNb(e.target.value)} style={{ width:"100%",background:S.surface,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,padding:"7px 10px",fontSize:12 }}>
                  {BULAN.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:11,color:S.muted,marginBottom:4 }}>Tahun</div>
                <select value={nt} onChange={e=>setNt(e.target.value)} style={{ width:"100%",background:S.surface,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,padding:"7px 10px",fontSize:12 }}>
                  {["2024","2025"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:11,color:S.muted,marginBottom:4 }}>Status</div>
                <select value={ns} onChange={e=>setNs(e.target.value)} style={{ width:"100%",background:S.surface,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,padding:"7px 10px",fontSize:12 }}>
                  {STATUS_PENGADAAN.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:11,color:S.muted,marginBottom:4 }}>Tanggal</div>
                <input type="date" value={nd} onChange={e=>setNd(e.target.value)} style={{ width:"100%",background:S.surface,border:`1px solid ${S.border}`,borderRadius:6,color:S.text,padding:"7px 10px",fontSize:12 }}/>
              </div>
              <button className="btn btn-primary btn-sm" onClick={add}><Plus size={13}/> Tambah</button>
            </div>
          </div>
        )}
        <div style={{ display:"flex",justifyContent:"flex-end",gap:8 }}>
          <button className="btn btn-outline" onClick={onClose}>Tutup</button>
          {isPemda && <button className="btn btn-primary" onClick={()=>{ onSave(rows); onClose(); }}><Save size={13}/> Simpan</button>}
        </div>
      </div>
    </div>
  );
}

/* ─── Tab Status ─── */
export function TabStatus({ isPemda, statusHistory, onUpdateHistory, triwulan, twLaporanDates }) {
  const [modal, setModal] = useState(false);
  const latestStatus = statusHistory.length ? statusHistory[statusHistory.length-1].status : "Persiapan";
  const sc = getStatusColor(latestStatus);
  const twInfo = getTWDeadlineInfo(triwulan);

  return (
    <div>
      {/* Deadline / penalty warning */}
      {twInfo && twInfo.overdue && (
        <div className="alert alert-warn" style={{ marginBottom:16 }}>
          <AlertTriangle size={14}/>
          <div>
            <strong>Batas pelaporan {twInfo.label} telah terlewati (deadline: {twInfo.deadline}).</strong>
            {" "}PEMDA dikenakan penalti keterlambatan pelaporan. Data tetap dapat dilengkapi namun dicatat sebagai terlambat.
          </div>
        </div>
      )}
      {twInfo && !twInfo.overdue && twInfo.daysLeft <= 7 && (
        <div className="alert alert-warn" style={{ marginBottom:16 }}>
          <AlertTriangle size={14}/>
          <div>Batas pelaporan <strong>{twInfo.label}</strong> tersisa <strong>{twInfo.daysLeft} hari</strong> (deadline: {twInfo.deadline}).</div>
        </div>
      )}

      {/* Tanggal pelaporan per TW */}
      <div style={{ background:S.surface2,border:`1px solid ${S.border2}`,borderRadius:10,padding:"14px 18px",marginBottom:20 }}>
        <div style={{ fontSize:11,fontWeight:700,color:S.muted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10 }}>Tanggal Pelaporan Input PEMDA</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
          {["TW1","TW2","TW3","TW4"].map(tw=>{
            const dl = TW_DEADLINE[tw];
            const inp = twLaporanDates?.[tw];
            const late = inp && new Date(inp) > new Date(dl.deadline);
            const current = tw === triwulan;
            return (
              <div key={tw} style={{ background:current?"var(--accent-glow)":S.surface,border:`1px solid ${current?"var(--accent)":S.border2}`,borderRadius:8,padding:"10px 12px" }}>
                <div style={{ fontSize:10,fontWeight:800,color:current?S.accent:S.muted,textTransform:"uppercase",marginBottom:4 }}>{tw}</div>
                <div style={{ fontSize:11,color:S.muted,marginBottom:4 }}>Deadline: <span style={{ fontFamily:"'DM Mono',monospace",color:S.text }}>{dl.deadline}</span></div>
                {inp ? (
                  <div style={{ fontSize:11,color:late?S.red:S.green,fontWeight:600,fontFamily:"'DM Mono',monospace" }}>
                    Dilaporkan: {inp} {late && "⚠ TERLAMBAT"}
                  </div>
                ) : (
                  <div style={{ fontSize:11,color:S.dim }}>Belum dilaporkan</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status terkini */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:10,padding:"10px 20px" }}>
            <div style={{ fontSize:10,color:S.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4 }}>Status Terkini</div>
            <div style={{ fontSize:18,fontWeight:800,color:sc.color }}>{latestStatus}</div>
          </div>
          {!isTerkontrak(latestStatus) && (
            <div style={{ background:"var(--yellow-bg)",border:"1px solid var(--yellow)",borderRadius:8,padding:"10px 16px",maxWidth:320 }}>
              <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}>
                <AlertTriangle size={16} color={S.yellow} style={{ flexShrink:0,marginTop:1 }}/>
                <div>
                  <div style={{ fontSize:12,fontWeight:700,color:S.yellow }}>Segera Lakukan Kontrak!</div>
                  <div style={{ fontSize:11,color:S.muted,marginTop:2 }}>Kelengkapan dokumen kontrak belum bisa diisi sebelum status Terkontrak.</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <button className="btn btn-outline" onClick={()=>setModal(true)}>
          <Calendar size={13}/> {isPemda?"Update Status":"Lihat Riwayat"}
        </button>
      </div>

      {/* Timeline */}
      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Riwayat Status Pengadaan per Bulan</span></div>
        <div style={{ padding:"4px 0" }}>
          {statusHistory.map((row,i)=>{ const c=getStatusColor(row.status); return (
            <div key={i} style={{ display:"flex",alignItems:"center",gap:14,padding:"11px 20px",borderBottom:i<statusHistory.length-1?`1px solid ${S.border2}`:"none" }}>
              <div style={{ width:28,height:28,borderRadius:"50%",flexShrink:0,background:c.bg,border:`2px solid ${c.border}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <CheckCircle size={13} color={c.color}/>
              </div>
              <div style={{ width:130,fontSize:12,fontWeight:600,color:S.muted }}>{row.bulan}</div>
              <div style={{ flex:1 }}>
                <span style={{ background:c.bg,color:c.color,border:`1px solid ${c.border}`,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700 }}>{row.status}</span>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:S.muted }}>{row.tanggal}</div>
            </div>
          );})}
        </div>
      </div>
      {modal && <StatusModal history={statusHistory} isPemda={isPemda} onClose={()=>setModal(false)} onSave={onUpdateHistory}/>}
    </div>
  );
}
