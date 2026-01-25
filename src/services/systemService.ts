import axios from 'axios';
import type { SystemInfo, StorageInfo } from '@/types';
import { getApiBaseUrl, API_ENDPOINTS } from '@/config';

/**
 * System Service - Handles system-level operations
 */

/**
 * Get the system root path
 * @returns The root path of the system
 */
export const getSystemRootPath = async (): Promise<string> => {
    const response = await axios.get<SystemInfo>(`${getApiBaseUrl()}${API_ENDPOINTS.SYSTEM.ROOT_PATH}`);
    return response.data.root_path;
};

/**
 * Get system storage information
 * @returns Storage information including total, used, available space
 */
export const getStorageInfo = async (): Promise<StorageInfo> => {
    const response = await axios.get<StorageInfo>(`${getApiBaseUrl()}${API_ENDPOINTS.SYSTEM.STORAGE}`);
    return response.data;
};
