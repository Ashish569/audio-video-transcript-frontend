import styles from "./MediaList.module.css";

export default function MediaList({
  files,
  formatSize,
  formatDuration,
  getStatusClass,
  onView,
}) {
  return (
    <div className={styles.listContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Filename</th>
            <th>Size</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Created On</th>
            <th>Modified On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td className={styles.id}>{file.id.slice(0, 8)}...</td>
              <td>{file.original_name}</td>
              <td>{formatSize(file.file_size)}</td>
              <td>{formatDuration(file.duration_sec)}</td>
              <td>
                <span
                  className={`${styles.badge} ${getStatusClass(file.status)}`}
                >
                  {file.status}
                </span>
              </td>
              <td>{new Date(file.created_on).toLocaleString()}</td>
              <td>{new Date(file.modified_on).toLocaleString()}</td>
              <td>
                {file.status === "completed" && (
                  <button
                    className={styles.viewBtn}
                    onClick={() => onView(file)}
                  >
                    View
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
