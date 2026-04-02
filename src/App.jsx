import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import RekkapBidang from "./pages/RekkapBidang";
import ProvinsiDetail from "./pages/ProvinsiDetail";
import PemdaDetail from "./pages/PemdaDetail";
import "./index.css";

export default function App() {
  const [triwulan, setTriwulan] = useState("TW4");
  const [page, setPage] = useState({ view: "rekkap" }); 
  // view: 'rekkap' | 'provinsi' | 'pemda'

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <div className="main-content">
        <TopBar triwulan={triwulan} setTriwulan={setTriwulan} page={page} setPage={setPage} />
        <div className="page-body">
          {page.view === "rekkap" && (
            <RekkapBidang triwulan={triwulan} setPage={setPage} />
          )}
          {page.view === "provinsi" && (
            <ProvinsiDetail provinsi={page.provinsi} triwulan={triwulan} setPage={setPage} />
          )}
          {page.view === "pemda" && (
            <PemdaDetail pemda={page.pemda} provinsi={page.provinsi} triwulan={triwulan} setPage={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}
