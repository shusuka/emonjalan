import { ChevronRight, Download } from "lucide-react";

const TW_OPTIONS = ["TW1", "TW2", "TW3", "TW4"];

export default function TopBar({ triwulan, setTriwulan, page, setPage }) {
  const crumbs = [
    { label: "Rekap Bidang", onClick: () => setPage({ view: "rekkap" }) },
  ];
  if (page.view === "provinsi") crumbs.push({ label: "JALAN" }, { label: page.provinsi });
  if (page.view === "pemda") crumbs.push(
    { label: "JALAN", onClick: () => setPage({ view: "rekkap" }) },
    { label: page.provinsi, onClick: () => setPage({ view: "provinsi", provinsi: page.provinsi }) },
    { label: page.pemda }
  );

  return (
    <div className="topbar">
      <div className="breadcrumb">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <ChevronRight size={13} style={{ color: "var(--text-dim)", flexShrink: 0 }} />}
            <span
              className={i === crumbs.length - 1 ? "current" : ""}
              onClick={c.onClick}
              style={{ cursor: c.onClick ? "pointer" : "default" }}
            >
              {c.label}
            </span>
          </span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>TRIWULAN</span>
        <div className="tw-selector">
          {TW_OPTIONS.map((tw) => (
            <button key={tw} className={`tw-btn ${triwulan === tw ? "active" : ""}`}
              onClick={() => setTriwulan(tw)}>
              {tw}
            </button>
          ))}
        </div>
        <button className="btn btn-outline" style={{ marginLeft: 8 }}>
          <Download size={13} /> Export
        </button>
      </div>
    </div>
  );
}
