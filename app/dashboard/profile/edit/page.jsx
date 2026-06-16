"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaPen, FaCog, FaEye, FaEyeSlash } from "react-icons/fa";
import Alert from "../../../components/Alert";

export default function EditProfilePage() {

  const router = useRouter();

  const [loading, setSaving]  = useState(false);
  const [saving, setLoading]  = useState(true);
  const [email, setEmail]     = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword]               = useState(false);
  const [currentPassword, setCurrentPassword]         = useState("");
  const [password, setPassword]                       = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
  });

  // ===== STATE ALERT =====
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    text: "",
    isAlert: true,
    onOke: () => {},
  });

  function showAlert(text, isAlert = true, onOke = () => {}) {
    setAlertConfig({ show: true, text, isAlert, onOke });
  }

  function closeAlert() {
    setAlertConfig(prev => ({ ...prev, show: false }));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef  = doc(db, "users", user.uid);
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
          console.error("Gagal memuat data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fungsi update yang beneran (dipanggil setelah konfirmasi)
  const doSaveChanges = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          fullName: formData.fullName,
          username: formData.username,
        });

        if (password.trim() !== "") {
          const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
          );
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, password);
        }

        // Alert sukses → klik Oke balik ke profile
        showAlert(
          "Profil berhasil diperbarui!",
          true,
          () => router.push("/dashboard/profile")
        );
      }
    } catch (error) {
      console.error("Gagal update:", error);

      // Alert error
      const errorCode = error?.code || "";
      if (errorCode === "auth/wrong-password") {
        showAlert("Password lama yang kamu masukkan salah.");
      } else if (errorCode === "auth/weak-password") {
        showAlert("Password baru minimal 6 karakter.");
      } else {
        showAlert("Gagal memperbarui profil. Coba lagi.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle submit form → tampilkan konfirmasi dulu
  const handleSaveChanges = (e) => {
    e.preventDefault();
    showAlert(
      "Yakin mau update profile? Perubahan akan langsung disimpan.",
      false,
      doSaveChanges
    );
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "22px", fontWeight: "700" }}>
        Memuat halaman edit...
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {/* ===== ALERT ===== */}
      {alertConfig.show && (
        <Alert
          isAlert={alertConfig.isAlert}
          text={alertConfig.text}
          handleClick={() => {
            closeAlert();
            alertConfig.onOke();
          }}
          handleCancel={closeAlert}
        />
      )}

      <h1 className={styles.pageTitle}>EDIT PROFILE</h1>
      <div className={styles.fullLine}></div>

      <div className={styles.editLayout}>

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
            <label>CURRENT PASSWORD</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password lama"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>NEW PASSWORD</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
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

        <div className={styles.editSidebar}>
          <div className={styles.miniProfile}>
            <div className={styles.avatarWrapper}>
              <img src="/images/default_profile.png" alt="Avatar" />
              <button type="button" className={styles.editAvatarBtn}>
                <FaPen />
              </button>
            </div>
            <h3>{formData.fullName || "NO NAME"}</h3>
            <p>@{formData.username || "username"}</p>
            <div className={styles.badge}>
              <FaCog /> VERIFIED LEARNER
            </div>
          </div>

          <div className={styles.tipsBox}>
            <h4>💡 DAILY TIP</h4>
            <p>Sync your calendar to never miss a speaking session with your tutor.</p>
          </div>
        </div>

      </div>

    </div>
  );
}