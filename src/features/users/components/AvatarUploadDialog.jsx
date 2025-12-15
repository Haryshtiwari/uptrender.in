import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Slider,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
} from '@mui/icons-material';

const AvatarUploadDialog = ({ open, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  const validateFile = (file) => {
    if (!file) {
      return 'Please select a file';
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPG, JPEG, and PNG files are allowed';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const getCroppedImage = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const image = new Image();

      image.onload = () => {
        const size = 300; // Output size
        canvas.width = size;
        canvas.height = size;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Save context
        ctx.save();

        // Move to center
        ctx.translate(size / 2, size / 2);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply zoom and draw image centered
        const scaledSize = size * zoom;
        ctx.drawImage(
          image,
          -scaledSize / 2,
          -scaledSize / 2,
          scaledSize,
          scaledSize
        );

        // Restore context
        ctx.restore();

        // Convert to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.95);
      };

      image.src = previewUrl;
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let fileToUpload = selectedFile;

      // If there are transformations, get the cropped image
      if (zoom !== 1 || rotation !== 0) {
        const croppedBlob = await getCroppedImage();
        fileToUpload = new File([croppedBlob], selectedFile.name, {
          type: 'image/jpeg',
        });
      }

      await onUpload(fileToUpload);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    setZoom(1);
    setRotation(0);
    setUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Upload Profile Picture</Typography>
          <IconButton onClick={handleClose} size="small" disabled={uploading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box textAlign="center" mb={2}>
          {!previewUrl ? (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 4,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Click to select an image
              </Typography>
              <Typography variant="caption" color="text.secondary">
                JPG, JPEG or PNG (Max 5MB)
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  position: 'relative',
                  width: 300,
                  height: 300,
                  margin: '0 auto',
                  overflow: 'hidden',
                  borderRadius: '50%',
                  border: '3px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'background.paper',
                }}
              >
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s',
                  }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </Box>

              <Box mt={3}>
                <Typography variant="body2" gutterBottom>
                  Zoom
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <ZoomOut />
                  <Slider
                    value={zoom}
                    onChange={handleZoomChange}
                    min={0.5}
                    max={3}
                    step={0.1}
                    sx={{ flex: 1 }}
                  />
                  <ZoomIn />
                </Box>

                <Box display="flex" justifyContent="center" gap={2} mt={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RotateLeft />}
                    onClick={handleRotateLeft}
                  >
                    Rotate Left
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RotateRight />}
                    onClick={handleRotateRight}
                  >
                    Rotate Right
                  </Button>
                </Box>

                <Button
                  variant="text"
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ mt: 2 }}
                >
                  Choose Different Image
                </Button>
              </Box>
            </>
          )}
        </Box>

        {uploading && (
          <Box mt={2}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
              Uploading...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || uploading}
          startIcon={<CloudUpload />}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarUploadDialog;
