/**
 * @deprecated This file is deprecated. Please import from '@/services' or specific service files instead.
 * 
 * API Services are now organized into separate modules:
 * - fileService.ts - File viewing, directory operations, downloads
 * - uploadService.ts - File uploads, chunked uploads
 * - shareService.ts - File sharing operations
 * - systemService.ts - System-level operations
 * 
 * All exports are available through '@/services' index
 */

// Re-export all services for backward compatibility
export * from './fileService';
export * from './uploadService';
export * from './shareService';
export * from './systemService';
