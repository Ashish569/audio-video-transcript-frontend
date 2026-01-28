# audio-video-transcript-frontend

Audio &amp; Video Transcription Frontend A modern web interface for uploading audio/video files, playing media, and viewing timestamped transcriptions synchronized with playback.

# Transcription Service - Frontend

Frontend for the Audio/Video Transcription Service — a React + Vite application that allows users to:

- Upload audio/video files via drag & drop
- View upload history with status
- Browse all uploaded files in Dashboard (Video / Audio tabs)
- Play media with synchronized, clickable transcript in a modal

## Features

- **Drag & drop + file picker** upload area
- **Upload history** table with refresh button
- **Dashboard** with separate Video and Audio views
- **Clickable table rows** open a modal with:
  - Native HTML5 video player
  - Time-synced transcript (current segment highlighted)
  - Click-to-seek functionality
- **SweetAlert2** feedback for success/error/validation
- **CSS Modules**
- **Zustand** for lightweight state management

## Tech Stack

- **Framework**: React 18 + Vite
- **State management**: Zustand
- **HTTP client**: Axios
- **UI feedback**: SweetAlert2
- **Styling**: CSS Modules
- **File handling**: native FormData + fetch

## Prerequisites

- Node.js ≥ 18
- npm

## Installation

```bash
cd projectDir
npm install


npm run dev


```
