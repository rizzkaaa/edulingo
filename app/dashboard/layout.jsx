"use client";

import styles from "./layout.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import {
  LuHouse,
  LuClipboardList,
  LuTrophy,
  LuBookOpen
} from "react-icons/lu";
import { TbChartBar } from "react-icons/tb";
import { FaLaptopCode } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [initialName, setInitialName] = useState("E");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
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
      };
      fetchUserData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0A12",
        color: "#ffffff",
        fontSize: "1.2rem",
        fontWeight: "600"
      }}>
        Memuat data sesi...
      </div>
    );
  }

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
      icon: <FaLaptopCode />,
      path: "/dashboard/developer",
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
          <div className={styles.logo}>
            E
          </div>

          <div className={styles.navMenu}>
            {menus.map((menu, index) => (
              <div
                key={index}
                className={`
                  ${styles.borderMenu}
                  ${pathname === menu.path || (pathname.includes('lesson') && menu.path.includes('lesson')) ? styles.activeMenu : ""}
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
            {initialName}
          </Link>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}