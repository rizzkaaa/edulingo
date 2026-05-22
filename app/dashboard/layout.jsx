"use client";

import styles from "./layout.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  LuHouse,
  LuClipboardList,
  LuTrophy,
  LuBookOpen
} from "react-icons/lu";
import { TbChartBar } from "react-icons/tb";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  
  const [initialName, setInitialName] = useState("R");

  useEffect(() => {
    // Backend Ambil data nama dari Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid); 
          const userDocSnap = await getDoc(userDocRef);
          let nameToUse = "Siswa";

          if (userDocSnap.exists()) {
            nameToUse = userDocSnap.data().username || user.displayName || "Siswa";
          } else if (user.displayName) {
            nameToUse = user.displayName;
          }
          if (nameToUse) {
            setInitialName(nameToUse.charAt(0).toUpperCase());
          }
        } catch (error) {
          console.error("Gagal mengambil data user untuk logo:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const menus = [
    {
      icon: <LuHouse />,
      path: "/dashboard",
    },
    {
      icon: <LuBookOpen />,
      path: "/dashboard/lesson",
    },
    {
      icon: <TbChartBar />,
      path: "/dashboard/leaderboard",
    },
    {
      icon: <LuClipboardList />,
      path: "/dashboard/history",
    },
    {
      icon: <LuTrophy />,
      path: "/dashboard/trophy",
    },
  ];

  return (
    <div className={styles.dashboardLayout}>
      <aside
        className={`
          ${styles.sidebar}
          ${pathname !== "/dashboard" ? styles.dark : ""}
        `}
      >
        <div className={styles.wrapSidebar}>
          {/* Logo dinamis menggunakan state initialName */}
          <div className={styles.logo}>
            {initialName}
          </div>

          <div className={styles.navMenu}>
            {menus.map((menu, index) => (
              <div
                key={index}
                className={`
                  ${styles.borderMenu}
                  ${pathname === menu.path ? styles.activeMenu : ""}
                `}
              >
                <Link
                  href={menu.path}
                  className={styles.menu}
                >
                  {menu.icon}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.profile}>
          <Link
            href="/dashboard/profile"
            className={styles.profileLink}
          >
            HV
          </Link>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}