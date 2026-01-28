import { useEffect, useRef } from "react";

const TranscriptView = ({ segments, currentTime, onSeek }) => {
  const activeRef = useRef(null);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime]);

  return (
    <div
      className="transcript-container"
      style={{
        overflowY: "auto",
        height: "100%",
        padding: "16px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {segments.map((s, index) => {
        const isActive =
          currentTime >= s.start_time && currentTime <= s.end_time;

        return (
          <div
            key={index}
            ref={isActive ? activeRef : null}
            onClick={() => onSeek(s.start_time)}
            style={{
              padding: "14px",
              marginBottom: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: isActive ? "#ffffff" : "transparent",
              boxShadow: isActive ? "0 4px 6px rgba(0,0,0,0.1)" : "none",
              borderLeft: isActive ? "5px solid #007bff" : "5px solid #eee",
              opacity: isActive ? 1 : 0.6,
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                color: "#007bff",
                marginBottom: "6px",
              }}
            >
              {Math.floor(s.start_time / 60)}:
              {Math.floor(s.start_time % 60)
                .toString()
                .padStart(2, "0")}
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "1.05rem",
                lineHeight: "1.5",
                color: isActive ? "#000" : "#444",
              }}
            >
              {s.content}
            </p>
          </div>
        );
      })}

      {segments.length === 0 && (
        <p style={{ color: "#666" }}>No transcript available yet.</p>
      )}
    </div>
  );
};

export default TranscriptView;
