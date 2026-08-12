import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Membaca konfigurasi dari .env.local
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

// 2. Inisialisasi Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Konfigurasi ID Dokumen yang akan di-merge:
 * - TARGET_DOC_ID: Dokumen utama yang akan menyimpan hasil merge.
 * - SOURCE_DOC_ID: Dokumen kedua yang datanya akan digabungkan ke TARGET_DOC_ID.
 * - DELETE_SOURCE_AFTER_MERGE: true jika ingin menghapus SOURCE_DOC_ID setelah merge berhasil.
 */
const COLLECTION_NAME = "exam_sessions";
const TARGET_DOC_ID = "session_1786503174048_ks3x87j";
const SOURCE_DOC_ID = "session_1786507924201_chprhp5";
const DELETE_SOURCE_AFTER_MERGE = false; // Ubah ke true jika ingin menghapus dokumen sumber

async function mergeDocuments() {
  console.log("==========================================");
  console.log("🚀 Memulai Proses Merge Dokumen Firestore");
  console.log(`Koleksi: ${COLLECTION_NAME}`);
  console.log(`Target Dokumen ID : ${TARGET_DOC_ID}`);
  console.log(`Source Dokumen ID : ${SOURCE_DOC_ID}`);
  console.log("==========================================\n");

  try {
    const targetRef = doc(db, COLLECTION_NAME, TARGET_DOC_ID);
    const sourceRef = doc(db, COLLECTION_NAME, SOURCE_DOC_ID);

    // 1. Ambil data dari kedua dokumen
    const [targetSnap, sourceSnap] = await Promise.all([
      getDoc(targetRef),
      getDoc(sourceRef),
    ]);

    if (!targetSnap.exists() && !sourceSnap.exists()) {
      console.error("❌ Error: Kedua dokumen tidak ditemukan di Firestore!");
      return;
    }

    const targetData = targetSnap.exists() ? targetSnap.data() : {};
    const sourceData = sourceSnap.exists() ? sourceSnap.data() : {};

    console.log("📄 Data Target Saat Ini:", JSON.stringify(targetData, null, 2));
    console.log("📄 Data Source Saat Ini:", JSON.stringify(sourceData, null, 2));

    // 2. Gabungkan data (Merge Strategy)
    // Nilai valid dari sourceData akan melengkapi/mengupdate targetData
    const mergedData = {
      ...targetData,
      ...sourceData,
      // Pastikan updatedAt diperbarui ke waktu sekarang
      updatedAt: new Date(),
    };

    // Bersihkan nilai undefined jika ada
    Object.keys(mergedData).forEach((key) => {
      if (mergedData[key] === undefined) {
        delete mergedData[key];
      }
    });

    console.log("\n✨ Data Hasil Penggabungan (Merged Data):");
    console.log(JSON.stringify(mergedData, null, 2));

    // 3. Simpan data gabungan ke target document
    await setDoc(targetRef, mergedData, { merge: true });
    console.log(`\n✅ Berhasil menyimpan hasil merge ke dokumen: ${TARGET_DOC_ID}`);

    // 4. (Opsional) Hapus dokumen sumber jika diaktifkan
    if (DELETE_SOURCE_AFTER_MERGE && sourceSnap.exists()) {
      await deleteDoc(sourceRef);
      console.log(`🗑️ Dokumen sumber (${SOURCE_DOC_ID}) berhasil dihapus.`);
    } else {
      console.log(`ℹ️ Dokumen sumber (${SOURCE_DOC_ID}) tetap dipertahankan.`);
    }

    console.log("\n🎉 Proses merge selesai dengan sukses!");
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat merge:", error);
  }
}

mergeDocuments();
