import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import imageCompression from 'browser-image-compression';
import { getBanners, createBanner, deleteBanner } from '../lib/bannerApi';

const BannerManager = () => {
  const [newBanner, setNewBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [banners, setBanners] = useState([]);
  const [editBanner, setEditBanner] = useState(null);

  useEffect(() => {
    getBanners().then(setBanners).catch(() => setBanners([]));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBanner(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddBanner = async () => {
    if (newBanner) {
      const formData = new FormData();
      let compressedFile = newBanner;
      try {
        compressedFile = await imageCompression(newBanner, {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      } catch (err) {
        toast.error('Image compression failed. Uploading original.');
      }
      formData.append("image", compressedFile);
      const toastId = toast.loading(editBanner ? "Updating banner..." : "Uploading banner...");
      try {
        const res = await fetch("http://localhost:3001/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (editBanner) {
          // Update banner in backend
          const updated = await fetch(`http://localhost:3001/api/banner/${editBanner.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: data.imageUrl }),
          }).then(r => r.json());
          setBanners(banners.map(b => b.id === editBanner.id ? updated : b));
          setEditBanner(null);
          toast.success("Banner updated successfully!", { id: toastId });
        } else {
          // Save banner in backend
          const created = await createBanner({ image_url: data.imageUrl });
          setBanners([created, ...banners]);
          toast.success("Banner uploaded successfully!", { id: toastId });
        }
        setNewBanner(null);
        setPreview(null);
      } catch (error) {
        toast.error("Upload failed. Please try again.", { id: toastId });
      }
    }
  };

  const handleEditBanner = (banner) => {
    setEditBanner(banner);
    setPreview(banner.image_url);
    setNewBanner(null);
  };

  const handleRemoveBanner = async (id) => {
    const toastId = toast.loading("Removing banner...");
    try {
      await deleteBanner(id);
      setBanners(banners.filter((banner) => banner.id !== id));
      toast.success("Banner removed.", { id: toastId });
    } catch (err) {
      toast.error("Failed to remove banner.", { id: toastId });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10">
      <Toaster position="top-right" />
      {/* Upload Section */}
      <div className="mb-4">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {/* Preview */}
        {preview && (
          <div className="relative mt-4">
            <img
              src={preview}
              alt={newBanner?.name || "Banner preview"}
              className="rounded w-full"
            />
            <button
              onClick={() => {
                setPreview(null);
                setNewBanner(null);
                setEditBanner(null);
              }}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              Remove Preview
            </button>
          </div>
        )}
        {preview && (
          <button
            onClick={handleAddBanner}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editBanner ? 'Update Banner' : 'Add Banner'}
          </button>
        )}
      </div>
      {/* Previously Added Banners */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Previously Added Banners</h3>
        {banners.length === 0 ? (
          <p className="text-sm text-gray-500">No banners added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banners.map((banner) => (
              <div key={banner.id} className="relative border rounded overflow-hidden">
                <img
                  src={banner.image_url}
                  alt={banner.id}
                  className="w-full h-auto"
                />
                <button
                  onClick={() => handleRemoveBanner(banner.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleEditBanner(banner)}
                  className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManager;
