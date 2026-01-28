import { useEffect, useState } from "react";
import useAppStore from "../../stores/appStore";
import { getAllFiles } from "../../lib/api";
import MediaModal from "../../components/dashboard/MediaModal/MediaModal";
import styles from "./DashboardPage.module.css";
import { getTranscription } from "../../lib/api";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("video");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllFiles();
      setFiles(data || []);
    } catch (err) {
      setError(err.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) => {
    const mime = file.mime_type || "";
    return activeTab === "video"
      ? mime.startsWith("video/")
      : mime.startsWith("audio/");
  });

  const formatSize = (bytes) => {
    if (!bytes) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(1)} ${units[i]}`;
  };

  const formatDuration = (sec) => {
    if (!sec) return "-";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <button
          className={styles.refreshBtn}
          onClick={fetchFiles}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "video" ? styles.active : ""}`}
          onClick={() => setActiveTab("video")}
        >
          Videos
        </button>
        <button
          className={`${styles.tab} ${activeTab === "audio" ? styles.active : ""}`}
          onClick={() => setActiveTab("audio")}
        >
          Audio
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading files...</p>
      ) : filteredFiles.length === 0 ? (
        <p className={styles.empty}>
          No {activeTab} files found. Upload some files first!
        </p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Filename</th>
                <th>File Size</th>
                <th>Duration</th>
                <th>Uploaded On</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => {
                const isCompleted = file.status === "completed";
                return (
                  <tr
                    key={file.id}
                    className={`${styles.row} ${file.status === "completed" ? styles.clickableRow : styles.disabledRow}`}
                    onClick={async () => {
                      if (file.status !== "completed") return;

                      setLoading(true);
                      try {
                        const { data } = await getTranscription(file.id);
                        console.log("Transcription data:", data);
                        console.log("file data:", file);
                        setSelectedMedia({
                          ...file,
                          transcription: data, // { metadata, segments }
                        });
                      } catch (err) {
                        console.error("Failed to load transcription:", err);
                        alert("Failed to load transcription");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <td className={styles.filename}>{file.filename}</td>
                    <td>{formatSize(file.size)}</td>{" "}
                    <td>{formatDuration(file.duration)}</td>{" "}
                    <td>{formatDate(file.created_on)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}
