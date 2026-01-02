import axios from 'axios';

/**
 * Share Service - Handles file sharing operations
 */

/**
 * Request a temporary share link for a file
 * @param filePath - The full path to the file to share
 * @returns The temporary share link
 */
export const requestTempShare = async (filePath: string): Promise<string> => {
    const response = await axios.get(`/files/d/r`, {
        params: { file_path: filePath },
    });
    return response.data;
};
