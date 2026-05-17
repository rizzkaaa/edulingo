"use client";

import styles from "./layout.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHouse, LuClipboardList, LuTrophy, LuBookOpen } from "react-icons/lu";
import { TbChartBar } from "react-icons/tb";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
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
      path: "#",
    },
  ];

  return (
    <div className={styles.dashboardLayout}>
      <aside className={`${styles.sidebar} ${pathname != '/dashboard' ? styles.dark : ''}`}>
        <div className={styles.wrapSidebar}>
          <div className={styles.logo}>R</div>
          <div className={styles.navMenu}>
            {menus.map((menu, index) => {
              return (
                <div
                  className={`${styles.borderMenu} ${
                    pathname == menu.path ? styles.activeMenu : ""
                  }`}
                  key={index}
                >
                  <Link href={menu.path} className={styles.menu}>
                    {menu.icon}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.profile}>
          <Link href="/dashboard/profile" className={styles.a}>
            HV
          </Link>
        </div>
      </aside>

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
