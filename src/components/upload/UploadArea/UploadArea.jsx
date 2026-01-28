import { useState, useRef, useEffect } from "react";
import useAppStore from "../../../stores/appStore";
import { uploadFile } from "../../../lib/api";
import Swal from "sweetalert2";
import styles from "./UploadArea.module.css";

export default function UploadArea() {
  const { addUpload, updateUpload, setError, setLoading } = useAppStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-clear success message after 4 seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = async (file) => {
    if (!file || uploading) return;

    setUploadSuccess(false);

    const validTypes = [
      "video/mp4",
      "video/quicktime",
      "audio/mpeg",
      "audio/wav",
      "audio/x-m4a",
    ];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please upload MP4, MOV, MP3, WAV, or M4A.",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Maximum file size is 500 MB.",
      });
      return;
    }

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    addUpload({
      id: tempId,
      originalName: file.name,
      size: file.size,
      status: "uploading",
      progress: 0,
      createdAt: new Date().toISOString(),
    });

    setUploading(true);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFile(file, (progressEvent) => {
        // Progress not used, but kept for future
      });

      const { data } = response;

      // Update store with real data
      updateUpload(tempId, {
        id: data.id,
        originalName: data.original_name || file.name,
        size: data.file_size || file.size,
        status: "uploaded",
        progress: 100,
        createdAt: data.created_at,
      });

      // Show success UI + popup
      setUploadSuccess(true);
      Swal.fire({
        icon: "success",
        title: "Upload Successful!",
        text: `${file.name} has been uploaded and is being processed.`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      updateUpload(tempId, {
        status: "failed",
        error: err.message || "Upload failed",
      });

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Something went wrong during upload.",
      });
    } finally {
      setUploading(false);
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropZone} ${dragActive ? styles.active : ""} ${
          uploading ? styles.uploading : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,audio/mpeg,audio/wav,audio/x-m4a"
          onChange={handleChange}
          className={styles.fileInput}
          disabled={uploading}
        />

        <div className={styles.content}>
          <div className={styles.icon}>⬆️</div>
          <p className={styles.text}>
            <strong>Drag & drop</strong> your file here
            <br />
            or
          </p>
          <button
            type="button"
            className={styles.button}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Select File"}
          </button>
          <p className={styles.hint}>Supports MP4, MOV, MP3, WAV, M4A</p>

          {/* Success message after upload */}
          {uploadSuccess && (
            <p className={styles.successMessage}>Loaded successfully!</p>
          )}
        </div>
      </div>

      {/* Full-screen loader during upload */}
      {uploading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Uploading file...</p>
          </div>
        </div>
      )}
    </div>
  );
}
