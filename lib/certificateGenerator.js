import jsPDF from "jspdf";
import JSZip from "jszip";

/**
 * Memastikan font Hammersmith One dan Garet sudah siap di-load oleh browser
 */
export async function ensureFontsLoaded() {
  if (typeof window === "undefined" || !document.fonts) return;

  const fontPromises = [
    document.fonts.load('bold 68px "Hammersmith One"'),
    document.fonts.load('20px "Garet"'),
    document.fonts.load('bold 22px "Garet"'),
  ];

  try {
    await Promise.all(fontPromises);
  } catch (err) {
    console.warn("Peringatan: Beberapa font mungkin belum siap di-load:", err);
  }
}

/**
 * Format nama peserta menjadi 1 baris
 */
export function formatParticipantName(fullName = "") {
  return [(fullName || "PESERTA").trim().toUpperCase()];
}

/**
 * Menggambar sertifikat ke HTML5 Canvas dan mengembalikan objek canvas
 */
export async function renderCertificateCanvas({
  fullName = "PESERTA",
  listeningScore = "0",
  structureScore = "0",
  readingScore = "0",
  totalScore = "0",
  templateSrc = "/images/template.jpeg",
}) {
  await ensureFontsLoaded();

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = templateSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const width = img.naturalWidth || 1600;
      const height = img.naturalHeight || 1131;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Gagal menginisialisasi Canvas Context 2D"));
      }

      // 1. Gambar Template Background
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Format dan Gambar Nama Peserta (Dipaksakan 1 Baris dengan Ukuran Lebih Besar)
      const nameText = (fullName || "PESERTA").trim().toUpperCase();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#254083";

      // Efek Text Shadow 3D dengan transparansi 40% (#254083 -> rgba(37, 64, 131, 0.4))
      ctx.shadowColor = "rgba(37, 64, 131, 0.4)";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 5;

      let fontSize = 68;
      const maxAllowedWidth = 1350;
      ctx.font = `bold ${fontSize}px "Hammersmith One", sans-serif`;
      const textWidth = ctx.measureText(nameText).width;

      if (textWidth > maxAllowedWidth) {
        fontSize = Math.max(36, Math.floor(fontSize * (maxAllowedWidth / textWidth)));
        ctx.font = `bold ${fontSize}px "Hammersmith One", sans-serif`;
      }

      ctx.fillText(nameText, 800, 540);

      // Reset Text Shadow untuk teks nilai agar bersih & rapi
      ctx.shadowColor = "transparent";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;

      // 3. Gambar Nilai Terkonversi Masing-Masing Sesi
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#333132";

      // Nilai Listening, Structure, Reading
      ctx.font = '500 20px "Garet", "Montserrat", sans-serif';
      ctx.fillText(String(listeningScore), 895, 694);
      ctx.fillText(String(structureScore), 895, 736);
      ctx.fillText(String(readingScore), 895, 776);

      // Total Score (Bold)
      ctx.font = '900 22px "Garet", "Montserrat", sans-serif';
      ctx.fillText(String(totalScore), 895, 820);

      resolve(canvas);
    };

    img.onerror = (err) => {
      reject(new Error(`Gagal memuat template gambar sertifikat: ${templateSrc}`));
    };
  });
}

/**
 * Menghasilkan PDF jsPDF dari data sertifikat
 */
export async function generateSingleCertificatePDF(data) {
  const canvas = await renderCertificateCanvas(data);
  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  // Buat PDF A4 Landscape (297 x 210 mm)
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
  return pdf;
}

/**
 * Membersihkan nama file agar aman untuk ZIP & OS
 */
function sanitizeFileName(name) {
  return (name || "peserta")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 50);
}

/**
 * Generate massal sertifikat dan mendownload langsung sebagai file ZIP
 * @param {Array} certificatesData - Array berisi { fullName, listeningScore, structureScore, readingScore, totalScore, fileName }
 * @param {Function} onProgress - Callback (current, total, statusText)
 */
export async function generateAndDownloadCertificatesZip(
  certificatesData = [],
  onProgress = null
) {
  if (!certificatesData || certificatesData.length === 0) {
    throw new Error("Tidak ada data sertifikat yang dapat digenerate.");
  }

  const zip = new JSZip();
  const total = certificatesData.length;

  for (let i = 0; i < total; i++) {
    const item = certificatesData[i];
    if (onProgress) {
      onProgress(i + 1, total, `Membuat sertifikat untuk ${item.fullName || "Peserta"} (${i + 1}/${total})...`);
    }

    const pdf = await generateSingleCertificatePDF({
      fullName: item.fullName,
      listeningScore: item.listeningScore,
      structureScore: item.structureScore,
      readingScore: item.readingScore,
      totalScore: item.totalScore,
      templateSrc: item.templateSrc || "/images/template.jpeg",
    });

    const pdfBlob = pdf.output("blob");
    const safeName = sanitizeFileName(item.fullName || `peserta_${i + 1}`);
    const fileName = item.customFileName || `Sertifikat_TOEFL_${safeName}_${item.totalScore}pts.pdf`;

    zip.file(fileName, pdfBlob);
  }

  if (onProgress) {
    onProgress(total, total, "Mengompresi file ke format ZIP...");
  }

  const zipContent = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  // Download File ZIP
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const zipFileName = `EduLingo_Sertifikat_TOEFL_${dateStr}.zip`;

  const url = URL.createObjectURL(zipContent);
  const link = document.createElement("a");
  link.href = url;
  link.download = zipFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { total, zipFileName };
}
