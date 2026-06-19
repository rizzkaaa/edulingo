"use client";

import material from "@/data/material.json";
import styles from "../layout.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LuLockOpen, LuCheck, LuLock } from "react-icons/lu";
import LessonProgressBar from "@/app/components/LessonProgressBar";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function LessonLayout({ children }) {
  const [sub_module_id, setSub_module_id] = useState(1);
  const [currentModuleOpen, setCurrentModuleOpen] = useState(1);
  
  // State utama pelacak jawaban
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();

  const handlePracticeAnswered = () => {
    setHasAnswered(true);
  };

  const [hasHydrated, setHasHydrated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Ambil data main_material dengan aman (Disesuaikan untuk Part 3)
  const main_material = material?.materials?.find(
    (m) => m.part_id == 3,
  ) || { part_title: "WRITTEN EXPRESSION PART 1", sub_modules: [] };
  
  // Ambil panjang data dengan aman menggunakan optional chaining
  const length = main_material?.sub_modules?.length || 0;

  // Custom Event Listener global untuk mendeteksi status jawaban
  useEffect(() => {
    setHasAnswered(false);

    const status = searchParams.get("status");
    const isCompletedInStorage = localStorage.getItem(`module_status_part_3_mod_${currentModuleOpen}`) === "completed";

    if (status === "completed" || isCompletedInStorage) {
      setHasAnswered(true);
    }

    window.addEventListener("practice-completed", handlePracticeAnswered);
    
    return () => {
      window.removeEventListener("practice-completed", handlePracticeAnswered);
    };
  }, [searchParams, currentModuleOpen]);

  // Inisialisasi Progress Awal
  useEffect(() => {
    const initializeProgress = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // Written Expression Part 1 dipetakan ke index [2] pada array lessonStatus
            const currentStatus = userData.lessonStatus?.[2]?.status;

            if (currentStatus === "done") {
              setSub_module_id(length);
              setCurrentModuleOpen(1); 
              setHasHydrated(true);
              return; 
            }
          }
        } catch (error) {
          console.error("Gagal mengambil data progress dari Firestore:", error);
        }
      }

      const savedProgress = localStorage.getItem("written_part_1_sub_progress");
      if (savedProgress) {
        const parsedId = parseInt(savedProgress, 10);
        setSub_module_id(parsedId);
        setCurrentModuleOpen(parsedId);
      } else {
        setSub_module_id(1);
        setCurrentModuleOpen(1);
      }
      setHasHydrated(true);
    };

    initializeProgress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.currentUser, length]); 

  // Ambil data sub_material dengan aman menggunakan optional chaining
  const sub_material = main_material?.sub_modules?.find(
    (m) => m.sub_module_id == currentModuleOpen,
  ) || main_material?.sub_modules?.[0] || { title: "" };
  
  const widthFill = length > 0 ? (sub_module_id / length) * 100 : 0;

  if (!hasHydrated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif", color: "#A0A0A0", backgroundColor: "#FAFAFA" }}>
        Memuat progress materi...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <aside>
        <header>{main_material?.part_title?.toUpperCase()}</header>
        <ul>
          {main_material?.sub_modules?.map((item) => {
            return (
              <li key={`li${item.sub_module_id}`}>
                <ButtonMenu
                  material={item}
                  sub_module_id={sub_module_id}
                  currentModuleOpen={currentModuleOpen}
                  setCurrentModuleOpen={setCurrentModuleOpen}
                />
              </li>
            );
          })}
        </ul>
        <Footer
          currentId={sub_module_id}
          length={length}
          widthFill={widthFill}
        />
      </aside>
      <section>
        <main>
          <h4 className={styles.indicator}>
            BERANDA › MATERI › WRITTEN EXPRESSION PART 1 ›{" "}
            {sub_material?.title?.toUpperCase()}{" "}
          </h4>
          {children}
        </main>
        <BottomBar
          title={main_material?.part_title}
          currentId={sub_module_id}
          length={length}
          widthFill={widthFill}
          isLock={sub_module_id < currentModuleOpen + 1}
          setCurrentModuleOpen={setCurrentModuleOpen}
          currentModuleOpen={currentModuleOpen}
          main_material={main_material}
          setSub_module_id={setSub_module_id}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
          hasAnswered={hasAnswered}
          sub_module_id={sub_module_id}
        />
      </section>
    </div>
  );
}

function ButtonMenu({
  material,
  sub_module_id,
  currentModuleOpen,
  setCurrentModuleOpen,
}) {
  const [shake, setShake] = useState(false);
  const router = useRouter();

  function handleClick(sub_material_id) {
    const nextPath = material?.title?.toLowerCase().replaceAll(" ", "_").replaceAll("&", "and") || "";
    if (currentModuleOpen == sub_material_id) return;
    if (sub_material_id > sub_module_id) {
      setShake(true);
      setTimeout(() => setShake(false), 900);
    } else {
      setCurrentModuleOpen(sub_material_id);
      router.push(`/dashboard/lesson/written_expression_part_1/${nextPath}`);
    }
  }

  return (
    <button
      className={`${material?.sub_module_id > sub_module_id ? styles.loked : ""} ${currentModuleOpen === material?.sub_module_id ? styles.active : ""}`}
      onClick={() => handleClick(material?.sub_module_id)}
    >
      <span>{material?.title}</span>
      <span className={styles.status}>
        {currentModuleOpen === material?.sub_module_id ? (
          <span className={styles.activeSign}>AKTIF</span>
        ) : material?.sub_module_id < sub_module_id ? (
          <LuCheck style={{ color: "#2D7A5E" }} />
        ) : material?.sub_module_id === sub_module_id ? (
          <LuLockOpen />
        ) : (
          <LuLock className={shake ? styles.shake : ""} />
        )}
      </span>
    </button>
  );
}

function BottomBar({
  title,
  currentId,
  length,
  widthFill,
  isLock,
  setCurrentModuleOpen,
  currentModuleOpen,
  main_material,
  setSub_module_id,
  isUpdating,
  setIsUpdating,
  hasAnswered,
  sub_module_id
}) {
  const [shake, setShake] = useState(false);
  const router = useRouter();

  function prevModule() {
    if (currentModuleOpen == 1 || isUpdating) return;
    
    const sub_material = main_material?.sub_modules?.find(
      (m) => m.sub_module_id == currentModuleOpen - 1,
    );
    const nextPath = sub_material?.title?.toLowerCase().replaceAll(" ", "_").replaceAll("&", "and") || "";

    setCurrentModuleOpen(currentModuleOpen - 1);
    router.push(`/dashboard/lesson/written_expression_part_1/${nextPath}`);
  }

  function nextModule() {
    if (currentModuleOpen == length || isUpdating) return;
    if (currentId < currentModuleOpen + 1) {
      setShake(true);
      setTimeout(() => setShake(false), 900);
    } else {
      const sub_material = main_material?.sub_modules?.find(
        (m) => m.sub_module_id == currentModuleOpen + 1,
      );
      const nextPath = sub_material?.title?.toLowerCase().replaceAll(" ", "_").replaceAll("&", "and") || "";

      setCurrentModuleOpen(currentModuleOpen + 1);
      router.push(`/dashboard/lesson/written_expression_part_1/${nextPath}`);
    }
  }

  async function handleCompleteClick() {
    if (currentId !== currentModuleOpen || isUpdating) return;

    if (currentId < length) {
      const nextProgress = currentId + 1;
      setSub_module_id(nextProgress);
      localStorage.setItem("written_part_1_sub_progress", nextProgress.toString());
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Sesi belajar telah berakhir, silakan login kembali.");
      return;
    }

    try {
      setIsUpdating(true);
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        let currentStatusList = userData.lessonStatus ? [...userData.lessonStatus] : [];

        if (currentStatusList.length > 0) {
          // Menyelesaikan Part 3 (index 2) dan membuka modul berikutnya (index 3) jika ada
          currentStatusList[2] = { ...currentStatusList[2], status: "done" };

          if (currentStatusList[3] && currentStatusList[3].status === "locked") {
            currentStatusList[3] = { ...currentStatusList[3], status: "progress" };
          }

          await updateDoc(userDocRef, { lessonStatus: currentStatusList });
          localStorage.removeItem("written_part_1_sub_progress");
          router.push("/dashboard/lesson");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kegagalan, kemajuan belajar gagal disimpan.");
    } finally {
      setIsUpdating(false);
    }
  }

  const isCompleteDisabled = !hasAnswered && (currentModuleOpen === sub_module_id);

  return (
    <div className={styles.bottomBar}>
      <div>
        <p>
          {title} • {currentId}/{length}
        </p>
        <LessonProgressBar widthFill={widthFill} />
      </div>
      <div className={styles.navButton}>
        <button onClick={() => prevModule()} disabled={currentModuleOpen == 1 || isUpdating}>
          ← SEBELUMNYA
        </button>
        <button
          onClick={() => nextModule()}
          disabled={currentModuleOpen == length || isUpdating}
        >
          BERIKUTNYA{" "}
          {isLock ? (
            <LuLock
              className={shake ? styles.shake : ""}
              style={{ transform: "translateY(2.5px)" }}
            />
          ) : (
            "→"
          )}
        </button>
      </div>
      <button
        onClick={handleCompleteClick}
        disabled={currentId !== currentModuleOpen || isUpdating || isCompleteDisabled}
        style={{
          backgroundColor: isUpdating || isCompleteDisabled || currentId !== currentModuleOpen ? "#A0A0A0" : "#2D7A5E",
          cursor: isUpdating || isCompleteDisabled || currentId !== currentModuleOpen ? "not-allowed" : "pointer",
          opacity: isCompleteDisabled || currentId !== currentModuleOpen ? 0.6 : 1,
          color: "white"
        }}
      >
        {isUpdating ? "MENYIMPAN..." 
          : currentId !== currentModuleOpen ? "SUDAH SELESAI ✓" 
          : !hasAnswered ? "JAWAB SOAL DULU 🔒" 
          : "TANDAI SELESAI ✓"}
      </button>
    </div>
  );
}

function Footer({ currentId, length, widthFill }) {
  return (
    <footer>
      <p>
        Progress {currentId}/{length}
      </p>
      <LessonProgressBar widthFill={widthFill} />
    </footer>
  );
}