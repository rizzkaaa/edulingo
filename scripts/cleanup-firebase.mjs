import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Parse .env.local file
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

// 2. Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const TARGET_KEEP_USER_ID = "nLARCpFZEsQEd2aMhreFPNHF0lH3";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanCollection(collectionName, isDocIdUser = false) {
  console.log(`\n🔍 Memeriksa koleksi: "${collectionName}"...`);
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);

  let deletedCount = 0;
  let keptCount = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const docId = docSnap.id;

    // Tentukan ID User dari dokumen
    const userId = isDocIdUser ? docId : (data.userId || data.uid);

    if (userId === TARGET_KEEP_USER_ID) {
      keptCount++;
      console.log(`  ✓ DISIMPAN (Milik Target): Document ID ${docId}`);
    } else {
      await deleteDoc(doc(db, collectionName, docId));
      deletedCount++;
      console.log(`  🗑️ DIHAPUS: Document ID ${docId} (User ID: ${userId || 'N/A'})`);
    }
  }

  console.log(`📊 Hasil Koleksi "${collectionName}": ${deletedCount} dihapus, ${keptCount} disimpan.`);
}

async function main() {
  console.log("==================================================");
  console.log(`🚀 MULAI PROSES PEMBERSIHAN DATA FIREBASE`);
  console.log(`📌 User ID yang dipertahankan: ${TARGET_KEEP_USER_ID}`);
  console.log("==================================================");

  try {
    // 1. Koleksi 'users' (Dokumen ID adalah User ID)
    await cleanCollection("users", true);

    // 2. Koleksi 'exam_sessions' (Field userId)
    await cleanCollection("exam_sessions", false);

    // 3. Koleksi 'practice_history' (Field userId)
    await cleanCollection("practice_history", false);

    console.log("\n==================================================");
    console.log("✅ PROSES PEMBERSIHAN FIREBASE SELESAI DENGAN SUKSES!");
    console.log("==================================================");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Terjadi kesalahan saat menghapus data:", error);
    process.exit(1);
  }
}

main();
