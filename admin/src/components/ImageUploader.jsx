import React, { useState } from 'react';

const ImageUploader = () => {
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">Upload Images</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="block w-full border rounded p-2"
      />
      <div className="flex flex-wrap gap-3 mt-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative">
            <img src={img.url} alt="preview" className="h-24 w-24 object-cover rounded" />
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
};

export default ImageUploader;
