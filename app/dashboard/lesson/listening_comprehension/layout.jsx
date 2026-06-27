"use client";

import material from "@/data/material.json";
import styles from "../layout.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LuLockOpen, LuCheck, LuLock } from "react-icons/lu";
import LessonProgressBar from "@/app/components/LessonProgressBar";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function LessonLayout({ children }) {
  const [sub_module_id, setSub_module_id] = useState(1);
  const [currentModuleOpen, setCurrentModuleOpen] = useState(1);
  
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isCurrentModuleCompleted, setIsCurrentModuleCompleted] = useState(false);
  const [isPartDone, setIsPartDone] = useState(false);

  const main_material = material.materials.find(
    (material) => material.part_id == 7,
  );
  
  const length = main_material.sub_modules.length;

  useEffect(() => {
    const initializeProgress = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const currentStatus = userData.lessonStatus?.[6]?.status;

            if (currentStatus === "done") {
              setIsPartDone(true);
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

      const savedProgress = localStorage.getItem("listening_comprehension_sub_progress");
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
  }, [auth.currentUser]); 

  useEffect(() => {
    const checkModuleCompletion = () => {
      const isCompleted = 
        isPartDone || 
        localStorage.getItem(`module_status_part_7_mod_${currentModuleOpen}`) === "completed";
      setIsCurrentModuleCompleted(!!isCompleted);
    };

    checkModuleCompletion();

    window.addEventListener("practice-completed", checkModuleCompletion);
    return () => {
      window.removeEventListener("practice-completed", checkModuleCompletion);
    };
  }, [currentModuleOpen, isPartDone]);

  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == currentModuleOpen,
  ) || main_material.sub_modules[0];
  
  const widthFill = (sub_module_id / length) * 100;

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
        <header>{main_material.part_title.toUpperCase()}</header>
        <ul>
          {main_material.sub_modules.map((material) => {
            return (
              <li key={`li${material.sub_module_id}`}>
                <ButtonMenu
                  material={material}
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
            BERANDA › MATERI › LISTENING COMPREHENSION ›{" "}
            {sub_material.title.toUpperCase()}{" "}
          </h4>
          {children}
        </main>
        <BottomBar
          title={main_material.part_title}
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
          isCurrentModuleCompleted={isCurrentModuleCompleted}
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
    const nextPath = material.title.toLowerCase().replaceAll(" ", "_");

    if (currentModuleOpen == sub_material_id) return;
    if (sub_material_id > sub_module_id) {
      setShake(true);
      setTimeout(() => setShake(false), 900);
    } else {
      setCurrentModuleOpen(sub_material_id);
      router.push(`/dashboard/lesson/listening_comprehension/${nextPath}`);
    }
  }

  return (
    <button
      className={`${material.sub_module_id > sub_module_id ? styles.loked : ""} ${currentModuleOpen === material.sub_module_id ? styles.active : ""}`}
      onClick={() => handleClick(material.sub_module_id)}
    >
      <span>{material.title}</span>
      <span className={styles.status}>
        {currentModuleOpen === material.sub_module_id ? (
          <span className={styles.activeSign}>AKTIF</span>
        ) : material.sub_module_id < sub_module_id ? (
          <LuCheck style={{ color: "#2D7A5E" }} />
        ) : material.sub_module_id === sub_module_id ? (
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
  isCurrentModuleCompleted,
}) {
  const [shake, setShake] = useState(false);
  const router = useRouter();

  function prevModule() {
    if (currentModuleOpen == 1 || isUpdating) return;
    
    const sub_material = main_material.sub_modules.find(
      (material) => material.sub_module_id == currentModuleOpen - 1,
    );
    const nextPath = sub_material.title.toLowerCase().replaceAll(" ", "_");

    setCurrentModuleOpen(currentModuleOpen - 1);
    router.push(`/dashboard/lesson/listening_comprehension/${nextPath}`);
  }

  function nextModule() {
    if (currentModuleOpen == length || isUpdating) return;
    if (currentId < currentModuleOpen + 1) {
      setShake(true);
      setTimeout(() => setShake(false), 900);
    } else {
      const sub_material = main_material.sub_modules.find(
        (material) => material.sub_module_id == currentModuleOpen + 1,
      );
      const nextPath = sub_material.title.toLowerCase().replaceAll(" ", "_");

      setCurrentModuleOpen(currentModuleOpen + 1);
      router.push(`/dashboard/lesson/listening_comprehension/${nextPath}`);
    }
  }

  async function handleCompleteClick() {
    if (currentId + 1 != currentModuleOpen + 1 || isUpdating || !isCurrentModuleCompleted) return;

    if (currentId < length) {
      const nextProgress = currentId + 1;
      setSub_module_id(nextProgress);
      localStorage.setItem("listening_comprehension_sub_progress", nextProgress.toString());
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
          currentStatusList[6] = { ...currentStatusList[6], status: "done" };

          if (currentStatusList[7] && currentStatusList[7].status === "locked") {
            currentStatusList[7] = { ...currentStatusList[7], status: "progress" };
          }

          await updateDoc(userDocRef, { lessonStatus: currentStatusList });
          localStorage.removeItem("listening_comprehension_sub_progress");
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
        disabled={currentId + 1 != currentModuleOpen + 1 || isUpdating || !isCurrentModuleCompleted}
        style={{
          backgroundColor: isUpdating || !isCurrentModuleCompleted ? "#A0A0A0" : "",
          cursor: isUpdating || !isCurrentModuleCompleted ? "not-allowed" : "pointer"
        }}
      >
        {isUpdating 
          ? "MENYIMPAN..." 
          : currentId + 1 == currentModuleOpen + 1 
            ? "TANDAI" 
            : ""}{" "}
        SELESAI ✓
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