// src/stores/appStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware"; // optional – great for debugging
import { getStatus, getTranscription } from "../lib/api";

// Helper to create polling interval
const createPolling = (id, callback, intervalMs = 4000) => {
  const timer = setInterval(() => callback(id), intervalMs);
  return () => clearInterval(timer);
};

const useAppStore = create(
  devtools((set, get) => ({
    activePage: "dashboard",
    activeTab: "video",
    selectedMediaId: null,

    files: [], // all media files (from dashboard)
    uploads: [], // upload history (in-progress + completed)

    // ── UI states ──
    isLoading: false,
    error: null,
    modalOpen: false,

    // ── Actions ──
    setActivePage: (page) => set({ activePage: page }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedMedia: (id) => set({ selectedMediaId: id, modalOpen: !!id }),
    closeModal: () => set({ selectedMediaId: null, modalOpen: false }),

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    // Add new upload (optimistic)
    addUpload: (upload) =>
      set((state) => ({
        uploads: [
          { ...upload, status: "uploading", progress: 0 },
          ...state.uploads,
        ],
      })),

    // Update upload/upload status
    updateUpload: (id, updates) =>
      set((state) => ({
        uploads: state.uploads.map((u) =>
          u.id === id ? { ...u, ...updates } : u
        ),
        files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      })),

    pollUploadStatus: (id) => {
      const stopPolling = createPolling(id, async () => {
        try {
          const { data } = await getStatus(id);
          get().updateUpload(id, {
            status: data.status,
            error: data.errorMessage,
          });

          if (data.status === "completed") {
            const transRes = await getTranscription(id);
            get().updateUpload(id, {
              transcription: transRes.data,
            });

            stopPolling?.();
          }
        } catch (err) {
          get().updateUpload(id, { status: "failed", error: err.message });
          stopPolling?.();
        }
      });

      return stopPolling;
    },

    fetchAllFiles: async () => {
      set({ isLoading: true });
      try {
        const completed = get().uploads.filter((u) => u.status === "completed");
        set({ files: completed });
      } catch (err) {
        set({ error: err.message });
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);

export default useAppStore;
