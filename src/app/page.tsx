'use client';

import { useState } from 'react';
import FileExplorer from '@/components/FileExplorer';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import UploadModal from '@/components/UploadModal';

export default function Home() {
    const [currentPath, setCurrentPath] = useState<string>('/');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="h-screen flex flex-col bg-dark-bg overflow-hidden">
            <TopBar
                onUploadClick={() => setIsUploadModalOpen(true)}
                currentPath={currentPath}
                onRefresh={handleRefresh}
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <Sidebar
                    currentPath={currentPath}
                    onPathChange={setCurrentPath}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <main className="flex-1 overflow-hidden">
                    <FileExplorer
                        currentPath={currentPath}
                        onPathChange={setCurrentPath}
                        refreshKey={refreshKey}
                    />
                </main>
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                currentPath={currentPath}
                onUploadComplete={handleRefresh}
            />
        </div>
    );
}
