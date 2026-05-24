"use client";

import material from "@/data/material.json";
import styles from "./layout.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuLockOpen, LuCheck, LuLock } from "react-icons/lu";
import LessonProgressBar from "@/app/components/LessonProgressBar";

export default function LessonLayout({ children }) {
  const [sub_module_id, setSub_module_id] = useState(2);
  const [currentModuleOpen, setCurrentModuleOpen] = useState(sub_module_id);
  const main_material = material.materials.find(
    (material) => material.part_id == 1,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == currentModuleOpen,
  );
  
  const length = main_material.sub_modules.length;
  const widthFill = (sub_module_id / length) * 100;

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
            BERANDA › MATERI › STRUCTURE PART 1 ›{" "}
            {sub_material.title.toUpperCase()}{" "}
          </h4>
          {children}
        </main>
        <BottomBar
          title={main_material.part_title}
          currentId={sub_module_id}
          length={length}
          widthFill={widthFill}
          isLock={currentModuleOpen == sub_module_id}
          setCurrentModuleOpen={setCurrentModuleOpen}
          currentModuleOpen={currentModuleOpen}
          main_material={main_material}
          setSub_module_id={setSub_module_id}
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

    console.log(nextPath);

    if (currentModuleOpen == sub_material_id) return;
    if (sub_material_id > sub_module_id) {
      setShake(true);
      setTimeout(() => setShake(false), 900);
    } else {
      setCurrentModuleOpen(sub_material_id);
      router.push(`/dashboard/lesson/structure_part_1/${nextPath}`);
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
}) {
  const [shake, setShake] = useState(false);
  const router = useRouter();

  function prevModule() {
    if (currentModuleOpen == 1) return;
    console.log(currentModuleOpen);

    const sub_material = main_material.sub_modules.find(
      (material) => material.sub_module_id == currentModuleOpen - 1,
    );
    const nextPath = sub_material.title.toLowerCase().replaceAll(" ", "_");
    console.log(nextPath);

    setCurrentModuleOpen(currentModuleOpen - 1);
    router.push(`/dashboard/lesson/structure_part_1/${nextPath}`);
  }

  function nextModule() {
    if (currentModuleOpen == length) return;
    if (currentId < currentModuleOpen + 1) {
      console.log(currentId, currentModuleOpen + 1);

      console.log(1);
      setShake(true);
      setTimeout(() => setShake(false), 900);
    } else {
      console.log(2);
      const sub_material = main_material.sub_modules.find(
        (material) => material.sub_module_id == currentModuleOpen + 1,
      );
      const nextPath = sub_material.title.toLowerCase().replaceAll(" ", "_");
      console.log(nextPath);

      setCurrentModuleOpen(currentModuleOpen + 1);
      router.push(`/dashboard/lesson/structure_part_1/${nextPath}`);
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
        <button onClick={() => prevModule()} disabled={currentModuleOpen == 1}>
          ← SEBELUMNYA
        </button>
        <button
          onClick={() => nextModule()}
          disabled={currentModuleOpen == length}
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
        <span></span>
      </div>
      <button
        onClick={() => {
          if (currentId == length || currentId + 1 != currentModuleOpen + 1)
            return;
          setSub_module_id(currentId + 1);
        }}
        disabled={currentId + 1 != currentModuleOpen + 1}
      >
        {currentId + 1 == currentModuleOpen + 1 ? "TANDAI" : ""} SELESAI ✓
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
