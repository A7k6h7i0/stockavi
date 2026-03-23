import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      activeFilter: 'all',
      setActiveFilter: (filter) => set({ activeFilter: filter }),

      previewMedia: null,
      setPreviewMedia: (media) => set({ previewMedia: media }),
      clearPreviewMedia: () => set({ previewMedia: null }),
    }),
    {
      name: 'stock-avi-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        activeFilter: state.activeFilter,
      }),
    }
  )
)

export default useStore
