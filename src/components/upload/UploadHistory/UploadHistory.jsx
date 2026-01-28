import useAppStore from "../../../stores/appStore";
import { getStatus } from "../../../lib/api";
import styles from "./UploadHistory.module.css";

export default function UploadHistory() {
  const { uploads, updateUpload, setError, setLoading } = useAppStore();

  // Format file size (KB/MB/GB)
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "uploaded":
        return styles.statusUploaded;
      case "processing":
        return styles.statusProcessing;
      case "completed":
        return styles.statusCompleted;
      case "failed":
        return styles.statusFailed;
      default:
        return styles.statusPending;
    }
  };

  // Manual refresh all uploads status
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);

    try {
      for (const upload of uploads) {
        if (upload.status === "uploaded" || upload.status === "processing") {
          const { data } = await getStatus(upload.id);
          updateUpload(upload.id, {
            status: data.status,
            error: data.errorMessage,
          });

          // If completed, optionally fetch transcription later
          if (data.status === "completed") {
            // You can add getTranscription here in future
          }
        }
      }
    } catch (err) {
      setError(err.message || "Failed to refresh status");
    } finally {
      setLoading(false);
    }
  };

  if (uploads.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No uploads yet. Start by uploading a file above.</p>
      </div>
    );
  }

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h3>Upload History</h3>
        <button className={styles.refreshButton} onClick={handleRefresh}>
          Refresh Status
        </button>
      </div>

      <div className={styles.list}>
        {uploads.map((upload) => (
          <div key={upload.id} className={styles.item}>
            <div className={styles.info}>
              <div className={styles.name}>{upload.originalName}</div>
              <div className={styles.meta}>
                <span>{formatSize(upload.size)}</span>
                <span>•</span>
                <span>{formatDate(upload.createdAt)}</span>
              </div>
            </div>

            <div className={styles.status}>
              <span
                className={`${styles.badge} ${getStatusClass(upload.status)}`}
              >
                {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
              </span>
              {upload.status === "failed" && upload.error && (
                <span className={styles.errorHint} title={upload.error}>
                  (i)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
