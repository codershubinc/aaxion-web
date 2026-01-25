'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the upload progress structure
export interface UploadProgress {
    isUploading: boolean;
    status: 'pending' | 'uploading' | 'finalizing' | 'completed' | 'error';
    completedFiles: number;
    totalFiles: number;
    overallProgress: number;
    speed: number;
    estimatedTimeRemaining: number;
}

interface AppContextType {
    uploadProgress: UploadProgress | null;
    updateUploadProgress: (progress: UploadProgress | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

    const updateUploadProgress = (progress: UploadProgress | null) => {
        setUploadProgress(progress);
    };

    return (
        <AppContext.Provider value={{ uploadProgress, updateUploadProgress }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppProvider');
    }
    return context;
}
