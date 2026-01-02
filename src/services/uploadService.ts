import axios from 'axios';

/**
 * Upload Service - Handles file uploads including chunked uploads for large files
 */

/**
 * Upload a single file
 * @param file - The file to upload
 * @param targetDir - The target directory path
 * @param onProgress - Optional callback for upload progress
 */
export const uploadFile = async (
    file: File,
    targetDir: string,
    onProgress?: (progress: number) => void
): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await axios.post(`/files/upload`, formData, {
        params: { dir: targetDir },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(progress);
            }
        },
    });
};

/**
 * Start a chunked upload session for large files
 * @param filename - The name of the file being uploaded
 */
export const startChunkUpload = async (filename: string): Promise<void> => {
    await axios.post(`/files/upload/chunk/start`, null, {
        params: { filename },
    });
};

/**
 * Upload a single chunk of a large file
 * @param filename - The name of the file being uploaded
 * @param chunkIndex - The index of this chunk
 * @param chunkData - The chunk data blob
 */
export const uploadChunk = async (
    filename: string,
    chunkIndex: number,
    chunkData: Blob
): Promise<void> => {
    await axios.post(`/files/upload/chunk`, chunkData, {
        params: { filename, chunk_index: chunkIndex },
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    });
};

/**
 * Complete a chunked upload session
 * @param filename - The name of the file being uploaded
 * @param targetDir - The target directory path
 */
export const completeChunkUpload = async (
    filename: string,
    targetDir: string
): Promise<void> => {
    await axios.post(`/files/upload/chunk/complete`, null, {
        params: { filename, dir: targetDir },
    });
};

/**
 * Upload a large file using chunked upload
 * @param file - The file to upload
 * @param targetDir - The target directory path
 * @param onProgress - Optional callback for upload progress
 */
export const uploadLargeFile = async (
    file: File,
    targetDir: string,
    onProgress?: (progress: number) => void
): Promise<void> => {
    const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    // Start chunked upload
    await startChunkUpload(file.name);

    // Upload chunks
    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        await uploadChunk(file.name, i, chunk);

        if (onProgress) {
            const progress = Math.round(((i + 1) / totalChunks) * 100);
            onProgress(progress);
        }
    }

    // Complete upload
    await completeChunkUpload(file.name, targetDir);
};
