import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

const ImageUploader = forwardRef(({ onUploadComplete, onFilesSelected, deferUpload, previewUrls, folderType = 'general' }, ref) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useImperativeHandle(ref, () => ({
    clearImages: () => {
      setImages([]);
      setSelectedFiles([]);
    }
  }));

  // Sync images with previewUrls when editing
  useEffect(() => {
    if (previewUrls && Array.isArray(previewUrls)) {
      setImages(previewUrls.map(url => ({ url, previewUrl: url })));
    }
  }, [previewUrls]);

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

   if (deferUpload) {
  const combinedFiles = [...selectedFiles, ...files];

  // Optional: deduplicate by name + size
  const uniqueMap = new Map();
  combinedFiles.forEach((file) => {
    uniqueMap.set(file.name + file.size, file);
  });

  const uniqueFiles = Array.from(uniqueMap.values());

  setSelectedFiles(uniqueFiles);
  setImages(uniqueFiles.map(file => ({ previewUrl: URL.createObjectURL(file) })));
  onFilesSelected?.(uniqueFiles);
  return;
}


    setUploading(true);
    toast.loading('Compressing and uploading images...');

    const uploadedImages = [];

    for (const file of files) {
      try {
        // Compress the image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,            // Max size in MB
          maxWidthOrHeight: 1024,   // Resize dimensions
          useWebWorker: true,
        });

        const formData = new FormData();
        formData.append('image', compressedFile);
        formData.append('type', folderType);

        // Upload to backend with folder type
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/upload?type=${folderType}`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();

        uploadedImages.push({
          url: data.imageUrl,
          public_id: data.public_id,
          previewUrl: URL.createObjectURL(compressedFile),
        });
      } catch (err) {
        // console.error('Error:', err);
        toast.error('Failed to upload some images.');
      }
    }

    setImages(prev => [...prev, ...uploadedImages]);
    onUploadComplete?.(uploadedImages.map(img => img.url));
    toast.dismiss();
    toast.success('Images uploaded!');
    setUploading(false);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    if (deferUpload) {
      const updatedFiles = [...selectedFiles];
      updatedFiles.splice(index, 1);
      setSelectedFiles(updatedFiles);
      onFilesSelected?.(updatedFiles);
    } else {
      onUploadComplete?.(updated.map(img => img.url));
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">Upload Images</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        disabled={uploading}
        className="block w-full border rounded p-2"
      />
      <div className="flex flex-wrap gap-3 mt-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative">
            <img src={img.previewUrl || img.url} alt="preview" className="h-24 w-24 object-cover rounded" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-0.5 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ImageUploader;
