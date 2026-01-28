import { useRef, useState } from "react";
import styles from "./MediaModal.module.css";
import VideoPlayer from "./VideoPlayer";
import TranscriptView from "./TranscriptView";

export default function MediaModal({ media, onClose }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  const videoUrl = `http://localhost:5050${media.public_url_path}`; // This we can put to env later
  const segments = media.transcription?.segments || [];

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>{media.original_name}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Video */}
          <div className={styles.playerContainer}>
            <VideoPlayer
              ref={videoRef}
              videoUrl={videoUrl}
              onTimeUpdate={setCurrentTime}
            />
          </div>
          <div className={styles.transcriptContainer}>
            <h3>Transcript</h3>
            <TranscriptView
              segments={segments}
              currentTime={currentTime}
              onSeek={handleSeek}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
