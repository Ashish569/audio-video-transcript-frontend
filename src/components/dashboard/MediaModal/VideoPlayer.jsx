// src/components/dashboard/VideoPlayer/VideoPlayer.jsx
import React, { forwardRef } from "react";

const VideoPlayer = forwardRef(({ videoUrl, onTimeUpdate }, ref) => {
  return (
    <video
      ref={ref}
      controls
      preload="auto"
      src={videoUrl}
      onTimeUpdate={(e) => onTimeUpdate(e.target.currentTime)}
      style={{
        width: "100%",
        borderRadius: "8px",
        backgroundColor: "#000",
      }}
    />
  );
});

export default VideoPlayer;
