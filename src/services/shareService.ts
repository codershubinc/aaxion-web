import axios from 'axios';
import { getApiBaseUrl } from '@/config';

/**
 * Share Service - Handles file sharing operations
 */

/**
 * Request a temporary share link for a file
 * @param filePath - The full path to the file to share
 * @returns The temporary share link
 */
export const requestTempShare = async (filePath: string): Promise<{ share_link: string }> => {
    const response = await axios.get(`${getApiBaseUrl()}/files/d/r`, {
        params: { file_path: filePath },
    });
    return response.data;
};
