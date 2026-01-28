import { Folder, File, FileImage, FileVideo, Music, FileArchive, FileCode, FileSpreadsheet, FileText } from 'lucide-react';

export const getFileIcon = (fileName: string, isDir: boolean) => {
    if (isDir) {
        return Folder;
    }

    const ext = fileName.split('.').pop()?.toLowerCase();

    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp'].includes(ext || '')) {
        return FileImage;
    }

    // Video files
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(ext || '')) {
        return FileVideo;
    }

    // Audio files
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(ext || '')) {
        return Music;
    }

    // Archive files
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext || '')) {
        return FileArchive;
    }

    // Code files
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'go', 'rs', 'swift'].includes(ext || '')) {
        return FileCode;
    }

    // Spreadsheet files
    if (['xlsx', 'xls', 'csv', 'ods'].includes(ext || '')) {
        return FileSpreadsheet;
    }

    // Text files
    if (['txt', 'md', 'pdf', 'doc', 'docx'].includes(ext || '')) {
        return FileText;
    }

    return File;
};
