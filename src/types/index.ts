export interface FileItem {
    name: string;
    is_dir: boolean;
    size: number;
    path: string;
    raw_path: string;
}

export interface SystemInfo {
    root_path: string;
}

export interface StorageInfo {
    total: number;
    used: number;
    available: number;
    usage_percentage: number;
    external_devices: any;
}

export interface ChunkUploadProgress {
    filename: string;
    chunkIndex: number;
    totalChunks: number;
    progress: number;
}
