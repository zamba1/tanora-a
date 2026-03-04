/* eslint-disable @typescript-eslint/no-shadow */
// eslint-disable-next-line lines-around-directive
"use client";

import { useDropzone } from 'react-dropzone';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Chip,
  List,
  Paper,
  Alert,
  Button,
  Dialog,
  Select,
  ListItem,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  DialogTitle,
  FormControl,
  ListItemText,
  DialogContent,
  DialogActions,
  LinearProgress,
  ListItemSecondaryAction,
} from '@mui/material';

import { Iconify } from '../../components/iconify';

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // en bytes
  acceptedTypes?: string[];
  multiple?: boolean;
}

interface UploadedFile {
  id: string;
  file: File;
  url?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  metadata?: {
    title?: string;
    type?: string;
    description?: string;
  };
}

const defaultAcceptedTypes = [
  'image/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
];

export function FileUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = defaultAcceptedTypes,
  multiple = true,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    type: '',
    description: '',
  });
  const [shouldCallOnUpload, setShouldCallOnUpload] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // useEffect pour gérer l'appel à onUpload après l'upload
  useEffect(() => {
    if (shouldCallOnUpload) {
      const completedFiles = files.filter(f => f.status === 'completed');
      if (completedFiles.length > 0) {
        onUpload(completedFiles);
      }
      setShouldCallOnUpload(false);
    }
  }, [shouldCallOnUpload, files, onUpload]);

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word')) return 'Document Word';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Feuille de calcul';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'Présentation';
    if (mimeType.includes('text/')) return 'Document texte';
    return 'Autre';
  };

  const uploadFiles = async (filesToUpload: UploadedFile[]) => {
    setUploading(true);
    
    for (const fileUpload of filesToUpload) {
      try {
        // Mettre à jour le statut pour indiquer le début de l'upload
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id 
            ? { ...f, progress: 10, status: 'uploading' }
            : f
        ));

        // Mettre à jour la progression
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id 
            ? { ...f, progress: 50 }
            : f
        ));

        // Simuler l'upload vers Firebase Storage (le vrai upload se fera dans DocumentsPage)
        // Ici on simule juste la progression et on marque comme terminé
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler le temps d'upload
        
        // Générer une URL simulée (sera remplacée par la vraie URL après l'upload réel)
        const mockUrl = `https://firebasestorage.googleapis.com/v0/b/your-bucket/o/${fileUpload.file.name}?alt=media`;
        
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id 
            ? { 
                ...f, 
                status: 'completed', 
                url: mockUrl, 
                progress: 100,
                metadata: {
                  ...f.metadata,
                  title: f.metadata?.title || fileUpload.file.name,
                  type: f.metadata?.type || getFileType(fileUpload.file.type),
                }
              }
            : f
        ));

      } catch (error) {
        console.error('Erreur upload:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Erreur lors de l\'upload' 
              }
            : f
        ));
      }
    }
    
    setUploading(false);
  };

  const processFiles = useCallback((acceptedFiles: File[], rejectedFiles: any[] = []) => {
    setDragActive(false);
    
    // Gérer les fichiers rejetés
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => ({
        file: file.name,
        errors: errors.map((e: any) => e.message).join(', '),
      }));
      
      console.error('Fichiers rejetés:', errors);
    }

    // Ajouter les nouveaux fichiers (sans upload automatique)
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending', // Statut en attente au lieu de 'uploading'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Ne pas faire l'upload automatiquement - attendre la confirmation
  }, []);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    processFiles(acceptedFiles, rejectedFiles);
  }, [processFiles]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  }, [processFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    maxFiles,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple,
  });

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleEditFile = (file: UploadedFile) => {
    setEditingFile(file);
    setEditForm({
      title: file.metadata?.title || file.file.name,
      type: file.metadata?.type || getFileType(file.file.type),
      description: file.metadata?.description || '',
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingFile) {
      setFiles(prev => prev.map(f => 
        f.id === editingFile.id 
          ? { ...f, metadata: editForm }
          : f
      ));
    }
    setEditDialogOpen(false);
    setEditingFile(null);
  };

  const handleConfirmUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    if (pendingFiles.length > 0) {
      // Uploader les fichiers en attente
      await uploadFiles(pendingFiles);
    }
    
    // Déclencher l'appel à onUpload via useEffect
    setShouldCallOnUpload(true);
  };

  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'material-symbols:image';
    if (mimeType.includes('pdf')) return 'material-symbols:picture-as-pdf';
    if (mimeType.includes('word')) return 'material-symbols:description';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'material-symbols:table-chart';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'material-symbols:slideshow';
    if (mimeType.includes('text/')) return 'material-symbols:text-snippet';
    return 'material-symbols:insert-drive-file';
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Zone de drop */}
      <Paper
        {...getRootProps()}
        elevation={isDragActive ? 8 : 2}
        sx={{
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input 
          {...getInputProps()} 
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
        
        <Iconify 
          icon="material-symbols:cloud-upload" 
          sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} 
        />
        
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers ou cliquez pour sélectionner'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Formats acceptés: Images, PDF, Documents Office, Texte
        </Typography>
        
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Taille maximale: {formatFileSize(maxSize)} • Maximum {maxFiles} fichiers
        </Typography>

        <Button
          variant="contained"
          onClick={handleSelectFiles}
          startIcon={<Iconify icon="material-symbols:upload" />}
          sx={{ mt: 1 }}
        >
          Sélectionner des fichiers
        </Button>
      </Paper>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Fichiers sélectionnés ({files.length})
          </Typography>
          
          <List>
            {files.map((file) => (
              <ListItem key={file.id} divider>
                <Iconify 
                  icon={getFileIcon(file.file.type)} 
                  sx={{ fontSize: 24, mr: 2, color: 'primary.main' }} 
                />
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">
                        {file.metadata?.title || file.file.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={formatFileSize(file.file.size)}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={getFileType(file.file.type)}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      {file.status === 'pending' && (
                        <Alert severity="info" sx={{ mt: 1 }}>
                          En attente d&apos;upload
                        </Alert>
                      )}
                      {file.status === 'uploading' && (
                        <LinearProgress 
                          variant="determinate" 
                          value={file.progress} 
                          sx={{ mt: 1 }}
                        />
                      )}
                      {file.status === 'error' && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {file.error}
                        </Alert>
                      )}
                      {file.status === 'completed' && (
                        <Alert severity="success" sx={{ mt: 1 }}>
                          Upload terminé
                        </Alert>
                      )}
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditFile(file)}
                      disabled={file.status === 'uploading'}
                    >
                      <Iconify icon="material-symbols:edit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <Iconify icon="material-symbols:delete" />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {/* Bouton de confirmation */}
          {files.some(f => f.status === 'pending' || f.status === 'completed') && (
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button
                variant="contained"
                onClick={handleConfirmUpload}
                disabled={uploading}
                startIcon={<Iconify icon="material-symbols:check" />}
              >
                {files.some(f => f.status === 'pending') 
                  ? `Uploader ${files.filter(f => f.status === 'pending').length} fichier(s)`
                  : `Confirmer l'upload (${files.filter(f => f.status === 'completed').length} fichiers)`
                }
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Dialog d'édition des métadonnées */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier les informations du fichier</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Titre"
              value={editForm.title}
              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type de document</InputLabel>
              <Select
                value={editForm.type}
                label="Type de document"
                onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
              >
                <MenuItem value="Image">Image</MenuItem>
                <MenuItem value="PDF">PDF</MenuItem>
                <MenuItem value="Document Word">Document Word</MenuItem>
                <MenuItem value="Feuille de calcul">Feuille de calcul</MenuItem>
                <MenuItem value="Présentation">Présentation</MenuItem>
                <MenuItem value="Document texte">Document texte</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
