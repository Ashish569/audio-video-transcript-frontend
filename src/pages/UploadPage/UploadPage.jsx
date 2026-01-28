import { useEffect, useMemo, useState } from "react";
import UploadArea from "../../components/upload/UploadArea/UploadArea";
import { getAllFiles } from "../../lib/api";
import styles from "./UploadPage.module.css";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllFiles();
      setFiles(data);
    } catch (err) {
      setError(err.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      if (filter !== "all" && f.status !== filter) return false;
      if (search && !f.filename.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [files, filter, search]);

  const formatSize = (bytes) => {
    if (!bytes) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  };

  const formatDuration = (sec) => {
    if (!sec) return "-";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.page}>
      {/* Upload card */}
      <div className={styles.uploadCard}>
        <UploadArea />
      </div>

      {/* History */}
      <div className={styles.historySection}>
        <div className={styles.historyHeader}>
          <h2>Upload History</h2>

          <div className={styles.headerRight}>
            <input
              className={styles.search}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className={styles.refreshButton}
              onClick={fetchFiles}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {["all", "completed", "failed"].map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${
                filter === t ? styles.activeTab : ""
              }`}
              onClick={() => setFilter(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>File</th>
                <th>Size</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredFiles.map((file) => (
                <tr key={file.id}>
                  <td className={styles.fileCell}>
                    <div className={styles.fileIcon} />
                    {file.filename}
                  </td>
                  <td>{formatSize(file.size)}</td>
                  <td>{formatDuration(file.duration)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[file.status]}`}
                    >
                      {file.status}
                    </span>
                  </td>
                  <td>
                    {new Date(file.created_on).toLocaleDateString()}{" "}
                    {new Date(file.created_on).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actionWrapper}>
                      <button className={styles.moreBtn}>⋯</button>

                      <div className={styles.dropdown}>
                        <button className={styles.dropdownItem}>
                          View Transcript
                        </button>
                        <button className={styles.dropdownItem}>
                          Play Media
                        </button>
                        <button className={styles.dropdownItemDanger}>
                          Retry
                        </button>
                        <button className={styles.dropdownItemDanger}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && <div className={styles.empty}>Loading...</div>}

          {filteredFiles.length === 0 && !loading && !error && (
            <div className={styles.empty}>No uploads found</div>
          )}
        </div>
      </div>
    </div>
  );
}
