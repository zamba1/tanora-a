import type { UploadResult } from 'firebase/storage';

import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';

import { storage } from './firebase';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

export interface UploadedFileInfo {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Upload un fichier vers Firebase Storage
 */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadedFileInfo> {
  try {
    // Créer une référence vers le fichier dans Firebase Storage
    const storageRef = ref(storage, path);
    
    // Upload du fichier
    const uploadResult: UploadResult = await uploadBytes(storageRef, file);
    
    // Obtenir l'URL de téléchargement
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    return {
      url: downloadURL,
      path: uploadResult.ref.fullPath,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    throw new Error(`Erreur lors de l'upload du fichier: ${error}`);
  }
}

/**
 * Upload multiple fichiers
 */
export async function uploadMultipleFiles(
  files: File[],
  basePath: string = 'documents',
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadedFileInfo[]> {
  const uploadPromises = files.map(async (file, index) => {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `${basePath}/${fileName}`;
    
    return uploadFile(file, filePath, (progress) => {
      onProgress?.(index, progress);
    });
  });

  return Promise.all(uploadPromises);
}

/**
 * Supprimer un fichier de Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw new Error(`Erreur lors de la suppression du fichier: ${error}`);
  }
}

/**
 * Générer un nom de fichier unique
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
}

/**
 * Valider le type de fichier
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1));
    }
    return file.type === type;
  });
}

/**
 * Valider la taille du fichier
 */
export function validateFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes;
}

/**
 * Obtenir l'URL de téléchargement d'un fichier
 */
export async function getFileDownloadURL(path: string): Promise<string> {
  try {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'URL:', error);
    throw new Error(`Erreur lors de la récupération de l'URL du fichier: ${error}`);
  }
}
