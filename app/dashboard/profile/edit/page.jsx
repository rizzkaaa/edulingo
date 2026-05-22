"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setEmail(data.email || user.email || "");
            setFormData({
              fullName: data.fullName || user.displayName || "",
              username: data.username || "",
            });
          }
        } catch (error) {
          console.error("Gagal memuat data edit profil:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fungsi Simpan Perubahan ke Firebase
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        
        // Simpan ke Firestore
        await updateDoc(userRef, {
          fullName: formData.fullName,
          username: formData.username,
        });

        alert("Profil berhasil diperbarui!");
        router.push("/dashboard/profile"); // Kembali ke halaman tampil profil
      }
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Memuat halaman edit...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>EDIT PROFILE</h1>

      <div className={styles.editLayout}>
        {/* Form Pengisian */}
        <form className={styles.editForm} onSubmit={handleSaveChanges}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>FULL NAME</label>
              <input 
                type="text" 
                value={formData.fullName} 
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>USERNAME</label>
              <input 
                type="text" 
                value={formData.username} 
                onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>EMAIL ADDRESS</label>
            <input type="email" value={email} disabled />
            <small>Email tidak dapat diubah di sini.</small>
          </div>

          <div className={styles.inputGroup}>
            <label>NATIVE LANGUAGE</label>
            <select disabled>
              <option>Indonesian (ID)</option>
              <option>English (US)</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
            <button 
              type="button" 
              className={styles.cancelBtn} 
              onClick={() => router.push("/dashboard/profile")}
            >
              CANCEL
            </button>
          </div>
        </form>

        {/* Sidebar Mini Profile Kanan (Sesuai Desain Figma) */}
        <div className={styles.editSidebar}>
           <div className={styles.miniProfile}>
              <img src="/images/avatar.png" alt="Avatar" />
              <h3>{formData.fullName.toUpperCase()}</h3>
              <p>@{formData.username}</p>
           </div>
           <div className={styles.tipsBox}>
              <h4>💡 DAILY TIP</h4>
              <p>Konsistensi adalah kunci. Luangkan 30 menit sehari untuk berlatih materi TOEFL.</p>
           </div>
        </div>
      </div>
    </div>
  );
}