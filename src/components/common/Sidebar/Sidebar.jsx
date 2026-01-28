import styles from "./Sidebar.module.css";

export default function Sidebar({ activePage, onPageChange }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "☰" },
    { id: "upload", label: "Upload", icon: "⬆" },
    // You can add more items later: 'history', 'settings', etc.
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>Transcribe</h1>
      </div>

      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.navItem} ${
                  activePage === item.id ? styles.active : ""
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <p>Version 1.0.0</p>
        <p>Ashish © 2026</p>
      </div>
    </aside>
  );
}
