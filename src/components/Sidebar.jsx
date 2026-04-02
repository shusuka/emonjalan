import { BarChart2, Map, FileText, CheckSquare, Users, Settings, HelpCircle, Activity } from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: BarChart2, view: "rekkap" },
  { label: "Rekap Bidang", icon: Map, view: "rekkap" },
  { label: "Monitoring Dokumen", icon: FileText, view: "rekkap" },
  { label: "Verifikasi PFID", icon: CheckSquare, view: "rekkap" },
];

const secondMenu = [
  { label: "Tenaga Kerja", icon: Users, view: "rekkap" },
  { label: "Aktivitas", icon: Activity, view: "rekkap" },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div>
          <div className="sidebar-logo-text">eMonitoring DAK</div>
          <div className="sidebar-logo-sub">Bidang Jalan · TA 2024</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Monitoring</div>
        {menuItems.map((m) => (
          <button key={m.label}
            className={`sidebar-item ${page.view === m.view && m.label === "Rekap Bidang" ? "active" : ""}`}
            onClick={() => setPage({ view: m.view })}>
            <m.icon size={16} />
            {m.label}
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Laporan</div>
        {secondMenu.map((m) => (
          <button key={m.label} className="sidebar-item">
            <m.icon size={16} />
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <div className="sidebar-section" style={{ borderTop: "1px solid var(--border2)", paddingTop: 12 }}>
        <button className="sidebar-item"><Settings size={16} />Pengaturan</button>
        <button className="sidebar-item"><HelpCircle size={16} />Bantuan</button>
      </div>

      <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border2)" }}>
        <div style={{ fontSize: 10, color: "var(--text-dim)", lineHeight: 1.6 }}>
          PFID — Pusat Fasilitasi Infrastruktur Daerah<br />
          Kementerian PUPR © 2024
        </div>
      </div>
    </aside>
  );
}
