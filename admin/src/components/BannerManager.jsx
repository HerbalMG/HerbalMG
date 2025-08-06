import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Select from 'react-select';

import imageCompression from "browser-image-compression";
import {
  getBanners,
  createBanner,
  deleteBanner,
  getProducts,        // New API call to fetch products
} from "../lib/bannerApi";

const BannerManager = () => {
  const navigate = useNavigate();

  const [newBanner, setNewBanner] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [bannerType, setBannerType] = useState("top");
  const [productId, setProductId] = useState("");
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getBanners().then(setBanners).catch(() => setBanners([]));
    getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBanner(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const cleanupUploadedImage = async (imageUrl) => {
    if (!imageUrl) return;
    try {
      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      await fetch(`${baseApiUrl}/upload/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  };

  const handleAddBanner = async () => {
    if (!newBanner) return toast.error("Please select an image.");
    if (bannerType === "top" && !productId) return toast.error("Select a product for top banner.");

    const toastId = toast.loading("Adding banner...");
    let uploadedImageUrl = "";

    try {
      let file = newBanner;
      try {
        file = await imageCompression(newBanner, {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      } catch {
        toast.error("Compression failed, using original image.");
      }

      const formData = new FormData();
      formData.append("image", file);

      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const uploadRes = await fetch(`${baseApiUrl}/upload?type=banner`, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const { imageUrl } = await uploadRes.json();
      uploadedImageUrl = imageUrl;

      const payload = {
        image_url: imageUrl,
        title: bannerTitle,
        link: bannerLink,
        type: bannerType,
        status: 'active',
        product_id: bannerType === "top" ? productId : null,
      };

      const created = await createBanner(payload);
      setBanners([created, ...banners]);
      toast.success("Banner added!", { id: toastId });
      setNewBanner(null);
      setPreview(null);
      setBannerTitle("");
      setBannerLink("");
      setBannerType("top");
      setProductId("");
    } catch (err) {
      await cleanupUploadedImage(uploadedImageUrl);
      console.error("Error adding banner:", err);
      toast.error("Failed to add banner.", { id: toastId });
    }
  };

  const handleRemoveBanner = async (id) => {
    const toastId = toast.loading("Removing banner...");
    try {
      await deleteBanner(id);
      setBanners(banners.filter((b) => b.id !== id));
      toast.success("Removed banner.", { id: toastId });
    } catch {
      toast.error("Failed to remove banner.", { id: toastId });
    }
  };

  const grouped = banners.reduce((acc, b) => {
    acc[b.type] = acc[b.type] || [];
    acc[b.type].push(b);
    return acc;
  }, {});

  return (
    <div className="max-w-xl mx-auto p-6 mt-10">
      <Toaster position="top-right" />

      <div className="mb-6 border p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Add New Banner</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />

        <input type="text" placeholder="Banner Title" value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} className="w-full mt-2 p-2 border rounded" />

        <input type="url" placeholder="Banner Link" value={bannerLink} onChange={e => setBannerLink(e.target.value)} className="w-full mt-2 p-2 border rounded" />

        <select value={bannerType} onChange={e => { setBannerType(e.target.value); setProductId(""); }} className="w-full mt-2 p-2 border rounded">
          <option value="top">Top (Product)</option>
          <option value="ad">Ad</option>
          <option value="info">Info</option>
          <option value="company">Company</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        {bannerType === "top" && (
  <div className="mt-2">
    <Select
      options={products.map(p => ({ value: p.id, label: p.name }))}
      value={products.find(p => p.id === productId) ? { value: productId, label: products.find(p => p.id === productId).name } : null}
      onChange={(selected) => setProductId(selected ? selected.value : "")}
      isClearable
      placeholder="Search or select product..."
      className="react-select-container"
      classNamePrefix="react-select"
    />
  </div>
)}


        {preview && (
          <>
            <div className="relative mt-4">
              <img src={preview} alt="preview" className="rounded w-full" />
              <button onClick={() => { setPreview(null); setNewBanner(null); }} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded">Remove</button>
            </div>
            <button onClick={handleAddBanner} className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700">Add Banner</button>
          </>
        )}
      </div>

      <div>
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="mb-6">
            <h3 className="text-lg font-semibold capitalize mb-2">{type} Banners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map(b => (
                <div key={b.id} className="relative border rounded overflow-hidden">
                  <div
                    onClick={() => {
                      if (b.product_id) navigate(`/product/${b.product_id}`);
                      else if (b.link) window.open(b.link, "_blank");
                    }}
                    className="cursor-pointer"
                  >
                    <img src={b.image_url} alt={b.title || `Banner ${b.id}`} className="w-full h-auto" />
                  </div>
                  <div className="p-2 bg-white">
                    {b.title && <h4 className="font-semibold">{b.title}</h4>}
                    {b.link && <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Visit Link</a>}
                  </div>
                  <button onClick={() => handleRemoveBanner(b.id)} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">Remove</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerManager;
