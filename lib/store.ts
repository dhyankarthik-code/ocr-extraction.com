import { create } from 'zustand'

interface UploadState {
    isUploading: boolean
    progress: number
    status: string
    setUploading: (uploading: boolean) => void
    setProgress: (progress: number) => void
    setStatus: (status: string) => void
    reset: () => void
}

export const useUploadStore = create<UploadState>((set) => ({
    isUploading: false,
    progress: 0,
    status: '',
    setUploading: (uploading) => set({ isUploading: uploading }),
    setProgress: (progress) => set({ progress }),
    setStatus: (status) => set({ status }),
    reset: () => set({ isUploading: false, progress: 0, status: '' }),
}))
