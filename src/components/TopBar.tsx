'use client';

import { Upload, RefreshCw, FolderPlus, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createDirectory } from '@/services';

interface TopBarProps {
    onUploadClick: () => void;
    currentPath: string;
    onRefresh: () => void;
    onMenuClick: () => void;
}

export default function TopBar({ onUploadClick, currentPath, onRefresh, onMenuClick }: TopBarProps) {
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderName, setFolderName] = useState('');

    const handleCreateFolder = async () => {
        if (!folderName.trim()) {
            toast.error('Please enter a folder name');
            return;
        }

        try {
            if (!currentPath || currentPath === '/') {
                toast.error('Please wait for the root directory to load');
                return;
            }
            const newPath = `${currentPath}/${folderName}`;
            await createDirectory(newPath);
            toast.success('Folder created successfully');
            setFolderName('');
            setIsCreatingFolder(false);
            onRefresh();
        } catch (error) {
            toast.error('Failed to create folder');
            console.error(error);
        }
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-14 sm:h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-3 sm:px-6"
        >
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-dark-hover rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>

                <motion.h1
                    className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                >
                    Aaxion
                </motion.h1>
                <span className="text-dark-muted hidden sm:inline text-sm sm:text-base">File Storage</span>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-3">
                {isCreatingFolder && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-full left-0 right-0 mt-2 mx-3 sm:mx-6 p-3 sm:p-4 bg-dark-surface border border-dark-border rounded-lg shadow-xl z-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                    >
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                            placeholder="Folder name..."
                            className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm focus:outline-none focus:border-accent-blue transition-colors flex-1"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleCreateFolder}
                                className="flex-1 sm:flex-none px-3 py-2 bg-accent-green text-white rounded-lg text-sm hover:bg-accent-green/80 transition-colors"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => {
                                    setIsCreatingFolder(false);
                                    setFolderName('');
                                }}
                                className="flex-1 sm:flex-none px-3 py-2 bg-dark-hover text-dark-text rounded-lg text-sm hover:bg-dark-border transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreatingFolder(true)}
                    className="hidden sm:flex items-center space-x-2 px-3 sm:px-4 py-2 bg-dark-hover hover:bg-dark-border rounded-lg transition-colors"
                >
                    <FolderPlus size={18} />
                    <span className="text-sm hidden md:inline">New Folder</span>
                </motion.button>

                {/* Mobile new folder button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreatingFolder(true)}
                    className="sm:hidden p-2 bg-dark-hover hover:bg-dark-border rounded-lg transition-colors"
                >
                    <FolderPlus size={18} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRefresh}
                    className="p-2 bg-dark-hover hover:bg-dark-border rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onUploadClick}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 rounded-lg transition-colors"
                >
                    <Upload className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm font-medium hidden xs:inline">Upload</span>
                </motion.button>
            </div>
        </motion.header>
    );
}
