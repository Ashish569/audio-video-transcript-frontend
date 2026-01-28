import { useState } from "react";
import Sidebar from "./components/common/Sidebar/Sidebar";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import UploadPage from "./pages/UploadPage/UploadPage";
import styles from "./App.module.css";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className={styles.appContainer}>
      <Sidebar activePage={activePage} onPageChange={setActivePage} />

      <main className={styles.mainContent}>
        {activePage === "dashboard" && <DashboardPage />}
        {activePage === "upload" && <UploadPage />}
      </main>
    </div>
  );
}
