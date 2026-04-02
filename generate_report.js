const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
        HeadingLevel, LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function headCell(text, opts = {}) {
  return new TableCell({
    borders,
    width: opts.width || undefined,
    shading: { fill: "1F4E79", type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 18, font: "Arial" })]
    })]
  });
}

function cell(text, opts = {}) {
  return new TableCell({
    borders,
    width: opts.width || undefined,
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ text: String(text), size: 18, font: "Arial", bold: opts.bold || false, color: opts.color || "000000" })]
    })]
  });
}

function statusCell(status) {
  const cfg = {
    "Terlaksana":      { fill: "E2EFDA", color: "375623" },
    "Terkendala":      { fill: "FFF2CC", color: "7F6000" },
    "Tidak Terlaksana":{ fill: "FCE4D6", color: "843C0C" },
    "Belum Upload":    { fill: "FCE4D6", color: "843C0C" },
    "Menunggu Verif":  { fill: "FFF2CC", color: "7F6000" },
    "Terverifikasi":   { fill: "E2EFDA", color: "375623" },
  }[status] || { fill: "F2F2F2", color: "595959" };
  return cell(status, { fill: cfg.fill, color: cfg.color, center: true, bold: true });
}

// ── Data mock untuk laporan ──
const pemda = "Provinsi Aceh";
const namaOPD = "Dinas PUPR Provinsi Aceh";
const triwulan = process.argv[2] || "TW4";
const tanggalLaporan = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

const triwulanDocs = {
  TW1: [
    { id: "ded", label: "DED Final RK (Layout/Stripmap, Typical Cross Section, RAB)", required: true },
    { id: "kontrak_spmk", label: "SPMK (Surat Perintah Mulai Kerja)", required: true },
    { id: "kontrak_penawaran", label: "Dokumen Penawaran RAB dan Gambar Rencana", required: true },
    { id: "kontrak_penunjukan", label: "Surat Penunjukan Penyedia Barang/Jasa (SPPBJ)", required: true },
    { id: "kontrak_perjanjian", label: "Surat Perjanjian/Kontrak", required: true },
    { id: "kurva_s", label: "Kurva S (sudah ditandatangani)", required: true },
    { id: "dpa", label: "DPA (sudah ditandatangani)", required: true },
    { id: "foto_0pct", label: "Foto Dokumentasi 0% (logo PU, logo Pemda, keterangan lokasi, STA, progres)", required: true },
    { id: "adendum", label: "Adendum Kontrak (jika ada)", required: false },
    { id: "progres_keu", label: "Data Progres Keuangan dan Fisik", required: true },
  ],
  TW4: [
    { id: "foto_100_tw4", label: "Foto Dokumentasi 100% (logo PU, logo Pemda, keterangan lokasi, STA, progres)", required: true },
    { id: "pho_tw4", label: "Dokumen PHO", required: true },
    { id: "as_built", label: "As Built Drawing", required: true },
    { id: "progres_keu_tw4", label: "Data Progres Keuangan dan Fisik", required: true },
    { id: "video", label: "Video Hasil Penanganan 100% (Video PKRMS dianjurkan)", required: true },
  ],
};

const docStatus = {
  TW4: {
    foto_100_tw4:  { uploaded: true,  verifiedPFID: false, catatan: "" },
    pho_tw4:       { uploaded: false, verifiedPFID: false, catatan: "Dokumen PHO belum diunggah" },
    as_built:      { uploaded: false, verifiedPFID: false, catatan: "As Built Drawing belum diunggah" },
    progres_keu_tw4: { uploaded: true,  verifiedPFID: false, catatan: "Realisasi keuangan belum diperbarui" },
    video:         { uploaded: false, verifiedPFID: false, catatan: "Video hasil penanganan belum diunggah" },
  }
};

const docs = triwulanDocs[triwulan] || triwulanDocs["TW4"];
const status = docStatus[triwulan] || docStatus["TW4"];

function getDocStatus(id) {
  const s = status[id] || {};
  if (s.verifiedPFID) return "Terverifikasi";
  if (s.uploaded) return "Menunggu Verif";
  return "Belum Upload";
}

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "2E74B5" },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
      }
    },
    children: [
      // ── KOP ──
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT", bold: true, size: 22, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "DIREKTORAT JENDERAL BINA MARGA", bold: true, size: 22, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "PUSAT FASILITASI INFRASTRUKTUR DAERAH (PFID)", bold: true, size: 22, font: "Arial" })]
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "1F4E79", space: 1 } },
        spacing: { after: 300 },
        children: []
      }),

      // ── Judul ──
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [new TextRun({ text: "LAPORAN HASIL VERIFIKASI DOKUMEN", bold: true, size: 30, font: "Arial", color: "1F4E79" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: `DAK BIDANG JALAN — ${triwulan} TAHUN ANGGARAN 2024`, bold: true, size: 26, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: `Pemerintah Daerah: ${pemda}`, size: 22, font: "Arial", color: "595959" })]
      }),

      // ── Info dokumen ──
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [2400, 200, 6426],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Kepada Yth.", size: 20, font: "Arial" })] })] }),
            new TableCell({ borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: ":", size: 20, font: "Arial" })] })] }),
            new TableCell({ borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ children: [new TextRun({ text: `Kepala ${namaOPD}`, bold: true, size: 20, font: "Arial" })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Perihal", size: 20, font: "Arial" })] })] }),
            new TableCell({ borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: ":", size: 20, font: "Arial" })] })] }),
            new TableCell({ borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ children: [new TextRun({ text: `Hasil Verifikasi Kelengkapan Dokumen ${triwulan} DAK Bidang Jalan TA 2024`, bold: true, size: 20, font: "Arial" })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Tanggal Laporan", size: 20, font: "Arial" })] })] }),
            new TableCell({ borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: ":", size: 20, font: "Arial" })] })] }),
            new TableCell({ borders: noBorders, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ children: [new TextRun({ text: tanggalLaporan, size: 20, font: "Arial" })] })] }),
          ]}),
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // ── I. RINGKASAN ──
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "I.  RINGKASAN HASIL VERIFIKASI", font: "Arial" })] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: `Berdasarkan hasil verifikasi yang dilakukan oleh PFID Kementerian PUPR terhadap kelengkapan dokumen ${triwulan} DAK Bidang Jalan Tahun Anggaran 2024 untuk ${pemda}, diperoleh hasil sebagai berikut:`,
          size: 20, font: "Arial"
        })]
      }),

      // Summary table
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [4513, 4513],
        rows: [
          new TableRow({ children: [headCell("URAIAN"), headCell("KETERANGAN")] }),
          new TableRow({ children: [cell("Total Dokumen yang Dipersyaratkan"), cell(`${docs.length} dokumen`, { bold: true })] }),
          new TableRow({ children: [cell("Dokumen Telah Diupload"), cell(`${docs.filter(d => (status[d.id]||{}).uploaded).length} dokumen`, { bold: true, color: "375623" })] }),
          new TableRow({ children: [cell("Dokumen Terverifikasi PFID"), cell(`${docs.filter(d => (status[d.id]||{}).verifiedPFID).length} dokumen`, { bold: true, color: "375623" })] }),
          new TableRow({ children: [
            cell("Dokumen Belum Sesuai / Belum Upload"),
            cell(`${docs.filter(d => { const s = status[d.id]||{}; return (d.required && !s.uploaded) || (s.uploaded && !s.verifiedPFID); }).length} dokumen`, { bold: true, color: "843C0C" })
          ]}),
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // ── II. DETAIL KELENGKAPAN ──
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "II.  DETAIL KELENGKAPAN DOKUMEN", font: "Arial" })] }),

      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [400, 4626, 1000, 1200, 1800],
        rows: [
          new TableRow({ tableHeader: true, children: [
            headCell("NO"), headCell("DOKUMEN"), headCell("WAJIB"), headCell("STATUS"), headCell("CATATAN PFID")
          ]}),
          ...docs.map((doc, i) => {
            const s = status[doc.id] || {};
            const st = getDocStatus(doc.id);
            return new TableRow({ children: [
              cell(String(i + 1), { center: true }),
              cell(doc.label),
              cell(doc.required ? "Ya" : "Tidak", { center: true, color: doc.required ? "843C0C" : "595959", bold: doc.required }),
              statusCell(st),
              cell(s.catatan || "-", { color: s.catatan ? "7F6000" : "595959" }),
            ]});
          }),
        ]
      }),
      new Paragraph({ spacing: { after: 300 }, children: [] }),

      // ── III. TINDAK LANJUT ──
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "III.  TINDAK LANJUT YANG DIPERLUKAN", font: "Arial" })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "Berdasarkan hasil verifikasi di atas, kami memohon kepada Pemerintah Daerah untuk segera menindaklanjuti hal-hal berikut:", size: 20, font: "Arial" })]
      }),
      ...docs
        .filter(d => { const s = status[d.id]||{}; return (d.required && !s.uploaded) || (s.uploaded && !s.verifiedPFID); })
        .map((doc, i) => {
          const s = status[doc.id] || {};
          return new Paragraph({
            numbering: { reference: "bullets", level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({
              text: `${doc.label}${s.catatan ? ` — ${s.catatan}` : !s.uploaded ? " (belum diunggah)" : " (menunggu verifikasi PFID)"}`,
              size: 20, font: "Arial"
            })]
          });
        }),
      new Paragraph({ spacing: { after: 120 }, children: [] }),
      new Paragraph({
        spacing: { after: 300 },
        children: [new TextRun({ text: "Mohon dokumen yang belum sesuai segera dilengkapi melalui sistem eMonitoring DAK (emondak.pupr.go.id) paling lambat 7 hari kerja setelah surat ini diterima.", size: 20, font: "Arial", italics: true })]
      }),

      // ── IV. PENUTUP ──
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "IV.  PENUTUP", font: "Arial" })] }),
      new Paragraph({
        spacing: { after: 300 },
        children: [new TextRun({ text: "Demikian laporan hasil verifikasi ini kami sampaikan. Atas perhatian dan kerja sama Saudara, kami ucapkan terima kasih.", size: 20, font: "Arial" })]
      }),

      // ── TTD ──
      new Paragraph({ spacing: { before: 300, after: 60 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Jakarta, ${tanggalLaporan}`, size: 20, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 60 }, children: [new TextRun({ text: "Kepala Pusat Fasilitasi Infrastruktur Daerah", size: 20, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 60 }, children: [new TextRun({ text: "Kementerian PUPR", size: 20, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 600 }, children: [new TextRun({ text: "", size: 20 })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 60 }, children: [new TextRun({ text: "(..........................................)", size: 20, font: "Arial" })] }),
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 60 }, children: [new TextRun({ text: "NIP. ........................................", size: 20, font: "Arial" })] }),
    ]
  }]
});

const outPath = `/mnt/user-data/outputs/Laporan_Verifikasi_${triwulan}_${pemda.replace(/\s/g,"_")}.docx`;
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("OK:" + outPath);
}).catch(e => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
