// src/components/BannerManager.jsx
import React, { useState } from "react";

const BannerManager = () => {
  const [newBanner, setNewBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [banners, setBanners] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBanner(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddBanner = () => {
    if (newBanner) {
      const bannerObj = {
        id: Date.now(),
        file: newBanner,
        url: preview,
        alt: newBanner.name || "Uploaded banner", // <-- Added alt text
      };
      setBanners([...banners, bannerObj]);
      setNewBanner(null);
      setPreview(null);
    }
  };

  const handleRemoveBanner = (id) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10">
      {/* <h2 className="text-xl font-bold mb-4">Banner Manager</h2> */}

      {/* Upload Section */}
      <div className="mb-4">
        {/* <label className="block mb-2 text-sm font-medium">Upload Banner</label> */}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* Preview */}
        {preview && (
          <div className="relative mt-4">
            <img
              src={preview}
              alt={newBanner?.name || "Banner preview"} // <-- Preview alt
              className="rounded w-full"
            />
            <button
              onClick={() => {
                setPreview(null);
                setNewBanner(null);
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
            Add Banner
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
                  src={banner.url}
                  alt={banner.alt} // <-- Displayed banner alt
                  className="w-full h-auto"
                />
                <button
                  onClick={() => handleRemoveBanner(banner.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
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
