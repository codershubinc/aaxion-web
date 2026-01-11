import axios from 'axios';
import type { FileItem } from '@/types';
import { getApiBaseUrl } from '@/config';

/**
 * File Service - Handles file viewing and directory operations
 */

/**
 * View files in a directory
 * @param dirPath - The directory path to view
 * @returns Array of file items
 */
export const viewFiles = async (dirPath: string): Promise<FileItem[]> => {
    const response = await axios.get(`${getApiBaseUrl()}/api/files/view`, {
        params: { dir: dirPath || '/' },
    });
    return response.data;
};

/**
 * Create a new directory
 * @param path - The full path where the directory should be created
 */
export const createDirectory = async (path: string): Promise<void> => {
    await axios.post(`${getApiBaseUrl()}/files/create-directory`, null, {
        params: { path },
    });
};

/**
 * Download a file
 * @param filePath - The full path to the file to download
 */
export const downloadFile = (filePath: string): void => {
    window.location.href = `${getApiBaseUrl()}/api/files/download?path=${encodeURIComponent(filePath)}`;
}