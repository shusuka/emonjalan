import { useState } from "react";
import { TrendingUp, Download, Phone, X, CheckCircle, AlertTriangle } from "lucide-react";
import { provinsiData, pemda_aceh, formatRupiah, TW_DEADLINE, progresPerTW } from "../data/mockData";
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
        <div className="prog-fill" style={{ width: `${Math.min(value,100)}%`, background: color }} />
      </div>
      <span className="prog-label" style={{ color }}>{Number(value).toFixed(2)}%</span>
    </div>
  );
}

const wilayahFilter = {
  "Semua Wilayah": null,
  "Wilayah Tengah": ["Sumatera Barat","Jambi","Sumatera Selatan"],
  "Wilayah Timur": ["Riau","Sumatera Utara"],
  "Wilayah Barat": ["Aceh","Bengkulu","Lampung"],
};

/* ── Excel export modal - format sesuai referensi ── */
function ExportModal({ onClose }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedProv, setSelectedProv] = useState("Semua Provinsi");

  function loadSheetJS(cb) {
    if(window.XLSX) { cb(null, window.XLSX); return; }
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    s.onload = function() { cb(null, window.XLSX); };
    s.onerror = function() {
      // fallback ke cdnjs
      var s2 = document.createElement("script");
      s2.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      s2.onload = function() { cb(null, window.XLSX); };
      s2.onerror = function() { cb(new Error("Gagal memuat library Excel")); };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  }

  function generate() {
    setGenerating(true);
    loadSheetJS(function(err, XLSX) {
      if(err || !XLSX) {
        alert("Gagal memuat library Excel. Pastikan koneksi internet aktif.");
        setGenerating(false);
        return;
      }
      try {
        var data = selectedProv === "Semua Provinsi"
          ? provinsiData
          : provinsiData.filter(function(p) { return p.nama === selectedProv; });

        var aoa = [];
        // Baris judul
        aoa.push(["REKAPITULASI PELAPORAN ANGGARAN TA 2024"]);
        aoa.push(["BIDANG JALAN"]);
        aoa.push([]);
        aoa.push([]);
        // Header kolom
        aoa.push([
          "NO","PROVINSI","PEMERINTAH DAERAH","PAGU ALOKASI (Rp)","PAGU RENCANA KEGIATAN (Rp)",
          "Pelaporan","VERIFIKASI BALAI","VERIFIKASI PUSAT",
          "PENYALURAN OMSPAN (Rp)","PENYERAPAN OMSPAN (Rp)",
          "PROGRES KEUANGAN (%)","PROGRES FISIK (%)","FOTO TERUPLOAD","TENAGA KERJA",
          "TGL UPDATE PROGRES KEU","TGL UPDATE PROGRES FISIK"
        ]);

        var TW_LABELS = ["Triwulan I","Triwulan II","Triwulan III","Triwulan IV"];
        var rowNum = 1;

        data.forEach(function(prov) {
          // Setiap provinsi tampil sebagai 1 PEMDA sample (nanti diganti data real)
          var tk = prov.profesional + prov.semiProfesional + prov.pekerja;
          TW_LABELS.forEach(function(tw, ti) {
            if(ti === 0) {
              aoa.push([
                rowNum, prov.nama, "(Data PEMDA)",
                prov.alokasi, prov.paguRK,
                tw, "", "",
                0, 0,
                0, 0, 0, tk,
                "-", "-"
              ]);
            } else {
              aoa.push([
                "", "", "", "", "",
                tw, "", "",
                ti === 3 ? Math.round(prov.alokasi * prov.realisasiPct / 100) : "",
                ti === 3 ? Math.round(prov.alokasi * prov.realisasiPct / 100) : "",
                ti === 3 ? prov.realisasiPct : "",
                ti === 3 ? prov.progresFisik : "",
                "", "", "-", "-"
              ]);
            }
          });
          rowNum++;
        });

        var ws = XLSX.utils.aoa_to_sheet(aoa);
        ws["!cols"] = [
          {wch:5},{wch:20},{wch:26},{wch:22},{wch:22},
          {wch:13},{wch:16},{wch:16},{wch:20},{wch:20},
          {wch:18},{wch:16},{wch:14},{wch:13},{wch:26},{wch:26}
        ];
        ws["!rows"] = [{hpx:22},{hpx:18},{hpx:6},{hpx:6},{hpx:48}];
        ws["!merges"] = [
          {s:{r:0,c:0},e:{r:0,c:15}},
          {s:{r:1,c:0},e:{r:1,c:15}}
        ];
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Kepatuhan BidangJALAN");
        XLSX.writeFile(wb, "Rekap_Kepatuhan_DAK_Jalan_TA2024.xlsx");
        setDone(true);
      } catch(e2) {
        alert("Gagal export: " + (e2 && e2.message ? e2.message : "Error tidak diketahui"));
      }
      setGenerating(false);
    });
  }

    return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:28,width:480,maxWidth:"92vw" }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}>
          <div>
            <div style={{ fontWeight:800,fontSize:16 }}>Export Rekap Excel</div>
            <div style={{ fontSize:12,color:"var(--text-muted)" }}>Format: Rekapitulasi Pelaporan DAK Bidang Jalan TA 2024</div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)" }}><X size={18}/></button>
        </div>
        <div style={{ background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:10,padding:14,marginBottom:18 }}>
          <div style={{ fontSize:11,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8 }}>Kolom yang diekspor</div>
          {["NO / Provinsi / Pemerintah Daerah","Pagu Alokasi & Pagu RK","Pelaporan TW I - IV","Verifikasi Balai & Pusat","Penyaluran & Penyerapan OMSPAN","Progres Keuangan (%) & Fisik (%)","Foto Terupload & Tenaga Kerja","Tanggal Update"].map(function(col,i){
            return (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3 }}>
                <CheckCircle size={11} color="var(--green-light)"/>
                <span style={{ fontSize:12,color:"var(--text-muted)" }}>{col}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8 }}>Filter Provinsi</div>
          <select value={selectedProv} onChange={function(e){ setSelectedProv(e.target.value); }}
            style={{ width:"100%",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)",padding:"9px 12px",fontSize:13 }}>
            <option>Semua Provinsi</option>
            {provinsiData.map(function(p){ return <option key={p.id}>{p.nama}</option>; })}
          </select>
        </div>
        <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
          <button className="btn btn-outline" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={generate} disabled={generating||done}>
            {generating ? "Mengekspor..." : done ? "✓ File Terdownload" : <><Download size={13}/> Download Excel</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── PEMDA WA Contact Modal ── */
function PemdaContactModal({ pemda, onClose }) {
  const waMsg = encodeURIComponent(`Yth. ${pemda.namaOPD},\n\nKami dari PFID Kementerian PUPR ingin berkoordinasi terkait pelaporan DAK Bidang Jalan. Mohon konfirmasinya. Terima kasih.`);
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:28,width:420,maxWidth:"92vw" }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}>
          <div style={{ fontWeight:800,fontSize:15 }}>Kontak OPD</div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)" }}><X size={18}/></button>
        </div>
        <div style={{ background:"var(--surface2)",borderRadius:10,padding:16,marginBottom:20 }}>
          <div style={{ fontSize:12,color:"var(--text-muted)",marginBottom:4 }}>Nama OPD</div>
          <div style={{ fontWeight:700,fontSize:15,marginBottom:12 }}>{pemda.namaOPD}</div>
          <div style={{ fontSize:12,color:"var(--text-muted)",marginBottom:4 }}>Nomor HP / WhatsApp</div>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:600,color:"var(--green-light)" }}>+{pemda.noHPOPD}</div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          <a href={`https://wa.me/${pemda.noHPOPD}?text=${waMsg}`} target="_blank" rel="noreferrer"
            style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25D366",color:"#fff",border:"none",borderRadius:8,padding:"12px",fontWeight:700,fontSize:14,textDecoration:"none" }}>
            <Phone size={16}/> Chat WhatsApp Pribadi
          </a>
          <div style={{ fontSize:11,color:"var(--text-muted)",textAlign:"center" }}>
            Akan membuka chat langsung ke nomor HP OPD yang terdaftar
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RekkapBidang({ triwulan, setPage }) {
  const [wilayah, setWilayah] = useState("Semua Wilayah");
  const [showExport, setShowExport] = useState(false);
  const [contactPemda, setContactPemda] = useState(null);

  const filtered = provinsiData.filter(p => {
    if (!wilayahFilter[wilayah]) return true;
    return wilayahFilter[wilayah].includes(p.nama);
  });

  const totalAlokasi = filtered.reduce((s,p)=>s+p.alokasi,0);
  const totalRealisasi = filtered.reduce((s,p)=>s+p.realisasiRP,0);
  const avgKeu = filtered.reduce((s,p)=>s+p.realisasiPct,0)/filtered.length;
  const avgFisik = filtered.reduce((s,p)=>s+p.progresFisik,0)/filtered.length;
  const totalPekerja = filtered.reduce((s,p)=>s+p.pekerja,0);
  const belowTarget = filtered.filter(p=>p.progresFisik<95).length;
  const chartData = filtered.map(p=>({ name:p.nama.split(" ")[0], keuangan:p.realisasiPct, fisik:p.progresFisik }));

  return (
    <div>
      <div className="page-header" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <div>
          <h1>Rekapitulasi Pelaksanaan DAK</h1>
          <p>Bidang Jalan · Tahun Anggaran 2024 · {triwulan}</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowExport(true)}>
          <Download size={13}/> Export Excel TW1–TW4
        </button>
      </div>

      {/* Summary bar */}
      <div className="summary-bar">
        <div className="summary-cell">
          <div className="summary-label">Total Alokasi DAK</div>
          <div className="summary-val" style={{ color:"var(--accent-light)" }}>Rp {(totalAlokasi/1e12).toFixed(2)}T</div>
          <div className="summary-sub">{filtered.length} provinsi</div>
        </div>
        <div className="summary-cell">
          <div className="summary-label">Realisasi Keuangan</div>
          <div className="summary-val" style={{ color:getColor(avgKeu) }}>{avgKeu.toFixed(1)}%</div>
          <div className="summary-sub">Rp {(totalRealisasi/1e12).toFixed(2)}T</div>
        </div>
        <div className="summary-cell">
          <div className="summary-label">Progres Fisik</div>
          <div className="summary-val" style={{ color:getColor(avgFisik) }}>{avgFisik.toFixed(1)}%</div>
          <div className="summary-sub">Rata-rata nasional</div>
        </div>
        <div className="summary-cell">
          <div className="summary-label">Tenaga Kerja</div>
          <div className="summary-val">{totalPekerja.toLocaleString("id-ID")}</div>
          <div className="summary-sub">
            {belowTarget>0 ? <span style={{ color:"var(--yellow-light)" }}>⚠ {belowTarget} provinsi &lt;95%</span>
            : <span className="text-green">✓ Semua on track</span>}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="table-wrap" style={{ marginBottom:24 }}>
        <div className="table-header">
          <span className="table-title" style={{ display:"flex",alignItems:"center",gap:8 }}>
            <TrendingUp size={15} style={{ color:"var(--accent-light)" }}/> Progres per Provinsi — {triwulan}
          </span>
        </div>
        <div style={{ padding:"16px 20px 20px" }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barGap={2} barSize={14}>
              <XAxis dataKey="name" tick={{ fill:"var(--text-muted)",fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{ fill:"var(--text-muted)",fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"}/>
              <Tooltip contentStyle={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,fontSize:12 }}
                labelStyle={{ color:"var(--text)",fontWeight:700 }}
                formatter={(v,name)=>[v.toFixed(2)+"%",name==="keuangan"?"Realisasi Keuangan":"Progres Fisik"]}/>
              <Bar dataKey="keuangan" radius={[3,3,0,0]}>
                {chartData.map((e,i)=><Cell key={i} fill={e.keuangan>=95?"var(--accent)":e.keuangan>=80?"var(--yellow)":"var(--red)"}/>)}
              </Bar>
              <Bar dataKey="fisik" radius={[3,3,0,0]}>
                {chartData.map((e,i)=><Cell key={i} fill={e.fisik>=95?"var(--green)":e.fisik>=80?"#d29922":"var(--red)"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:"flex",gap:16,justifyContent:"center",marginTop:4 }}>
            {[{ label:"Realisasi Keuangan",bg:"var(--accent)" },{ label:"Progres Fisik",bg:"var(--green)" }].map(l=>(
              <div key={l.label} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--text-muted)" }}>
                <div style={{ width:10,height:10,borderRadius:2,background:l.bg }}/> {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wilayah filter */}
      <div className="wilayah-tabs">
        {Object.keys(wilayahFilter).map(w=>(
          <button key={w} className={`wilayah-btn ${wilayah===w?"active":""}`} onClick={()=>setWilayah(w)}>{w}</button>
        ))}
      </div>

      {/* Provinsi table */}
      <div className="table-wrap" style={{ marginBottom:24 }}>
        <div className="table-header">
          <span className="table-title">Rekapitulasi per Provinsi</span>
          <span style={{ fontSize:12,color:"var(--text-muted)" }}>Klik provinsi untuk detail</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table>
            <thead><tr>
              <th style={{ width:40 }}>NO</th><th>PROVINSI</th>
              <th className="right">ALOKASI DAK (Rp)</th><th className="right">PAGU RK (Rp)</th>
              <th className="right">REALISASI (Rp)</th><th style={{ minWidth:140 }}>REALISASI %</th>
              <th style={{ minWidth:140 }}>PROGRES FISIK</th>
              <th className="center">PROF.</th><th className="center">SEMI</th><th className="center">PEKERJA</th>
              <th className="center">STATUS</th>
            </tr></thead>
            <tbody>
              {filtered.map((p,i)=>(
                <tr key={p.id} onClick={()=>setPage({ view:"provinsi",provinsi:p.nama })}>
                  <td style={{ color:"var(--text-muted)",fontSize:12 }}>{i+1}</td>
                  <td className="link">{p.nama}</td>
                  <td className="right">{formatRupiah(p.alokasi)}</td>
                  <td className="right">{formatRupiah(p.paguRK)}</td>
                  <td className="right">{formatRupiah(p.realisasiRP)}</td>
                  <td><ProgressBar value={p.realisasiPct} color={getColor(p.realisasiPct)}/></td>
                  <td><ProgressBar value={p.progresFisik} color={getColor(p.progresFisik)}/></td>
                  <td className="center">{p.profesional.toLocaleString("id-ID")}</td>
                  <td className="center">{p.semiProfesional.toLocaleString("id-ID")}</td>
                  <td className="center">{p.pekerja.toLocaleString("id-ID")}</td>
                  <td className="center">
                    <span className={`badge ${p.progresFisik>=95?"badge-green":p.progresFisik>=80?"badge-yellow":"badge-red"}`}>
                      {p.progresFisik>=95?"On Track":p.progresFisik>=80?"Perhatian":"Terlambat"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PEMDA tabel dengan kontak WA */}
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Daftar PEMDA — Provinsi Aceh</span>
          <span style={{ fontSize:11,color:"var(--text-muted)" }}>Klik ikon WA untuk kontak langsung ke OPD</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table>
            <thead><tr>
              <th>NO</th><th>PEMDA / OPD</th>
              <th className="right">ALOKASI (Rp)</th>
              <th style={{ minWidth:130 }}>REALISASI %</th>
              <th style={{ minWidth:130 }}>PROGRES FISIK</th>
              <th className="center">STATUS</th>
              <th className="center">KONTAK OPD</th>
            </tr></thead>
            <tbody>
              {pemda_aceh.map((p,i)=>(
                <tr key={p.no}>
                  <td style={{ color:"var(--text-muted)",fontSize:12 }}>{p.no}</td>
                  <td>
                    <div style={{ fontWeight:600,fontSize:13 }}>{p.nama}</div>
                    <div style={{ fontSize:11,color:"var(--text-muted)" }}>{p.namaOPD}</div>
                  </td>
                  <td className="right">{formatRupiah(p.alokasi)}</td>
                  <td><ProgressBar value={p.realisasiPct} color={getColor(p.realisasiPct)}/></td>
                  <td><ProgressBar value={p.progresFisik} color={getColor(p.progresFisik)}/></td>
                  <td className="center">
                    <span className={`badge ${p.progresFisik===100?"badge-green":p.progresFisik>=90?"badge-blue":"badge-yellow"}`}>
                      {p.progresFisik===100?"Selesai 100%":p.progresFisik.toFixed(0)+"%"}
                    </span>
                  </td>
                  <td className="center">
                    <button
                      className="btn btn-xs"
                      style={{ background:"#25D366",color:"#fff",border:"none",display:"inline-flex",alignItems:"center",gap:5 }}
                      onClick={()=>setContactPemda(p)}
                    >
                      <Phone size={11}/> WA OPD
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showExport && <ExportModal onClose={()=>setShowExport(false)}/>}
      {contactPemda && <PemdaContactModal pemda={contactPemda} onClose={()=>setContactPemda(null)}/>}
    </div>
  );
}
