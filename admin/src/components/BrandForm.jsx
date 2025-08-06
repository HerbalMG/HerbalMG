import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import imageCompression from "browser-image-compression";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  deleteUploadedImage,
} from "../lib/brandApi";

const BrandForm = () => {
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [isTopBrand, setIsTopBrand] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTopBrandsOnly, setShowTopBrandsOnly] = useState(false);

  useEffect(() => {
    getBrands()
      .then(setBrandList)
      .catch(() => setBrandList([]));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) setBanner(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      toast.error("Please enter a brand name.");
      return;
    }

    if (!image && !editBrand) {
      toast.error("Please upload a logo image.");
      return;
    }

    setIsUploading(true);

    let brandId = null;
    let createdBrand = null;
    let imageUrl = editBrand ? editBrand.logo_url : null;
    let bannerUrl = editBrand ? editBrand.banner_url : null;
    let uploadedImageUrl = null;
    let uploadedBannerUrl = null;

    try {
      const payload = {
        name: brandName,
        logo_url: imageUrl || "",
        banner_url: bannerUrl || "",
        is_top_brand: isTopBrand,
      };

      if (editBrand) {
        await updateBrand(editBrand.id, payload);
        brandId = editBrand.id;
      } else {
        createdBrand = await createBrand(payload);
        brandId = createdBrand.id;
      }

      // Upload logo
      if (image) {
        const toastId = toast.loading("Uploading logo...");
        let compressedFile = image;
        try {
          compressedFile = await imageCompression(image, {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });
        } catch {
          toast.error("Image compression failed. Uploading original.", {
            id: toastId,
          });
        }

        const formData = new FormData();
        formData.append("image", compressedFile);

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/upload?type=brand`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        imageUrl = data.imageUrl;
        uploadedImageUrl = data.imageUrl;
        toast.success("Logo uploaded!", { id: toastId });
      }

      // Upload banner
      if (banner) {
        const toastId = toast.loading("Uploading banner...");
        let compressedBanner = banner;
        try {
          compressedBanner = await imageCompression(banner, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
        } catch {
          toast.error("Banner compression failed. Uploading original.", {
            id: toastId,
          });
        }

        const formData = new FormData();
        formData.append("image", compressedBanner);

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/upload?type=brand`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Banner upload failed");
        const data = await res.json();
        bannerUrl = data.imageUrl;
        uploadedBannerUrl = data.imageUrl;
        toast.success("Banner uploaded!", { id: toastId });
      }

      // Final brand update if needed
      if ((imageUrl || bannerUrl) && brandId) {
        const currentBrandRes = await fetch(
          `http://localhost:3001/api/brand/${brandId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!currentBrandRes.ok)
          throw new Error("Failed to fetch current brand data");
        const current = await currentBrandRes.json();

        const updatedPayload = {
          ...current,
          logo_url: imageUrl,
          banner_url: bannerUrl,
          is_top_brand: isTopBrand,
        };

        const updatedBrandRes = await fetch(
          `http://localhost:3001/api/brand/${brandId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedPayload),
          }
        );
        if (!updatedBrandRes.ok) {
          if (uploadedImageUrl) await deleteUploadedImage(uploadedImageUrl);
          if (uploadedBannerUrl) await deleteUploadedImage(uploadedBannerUrl);
          throw new Error("Failed to update brand with new images");
        }
        const updatedBrand = await updatedBrandRes.json();
        setBrandList((prev) =>
          prev.map((b) => (b.id === brandId ? updatedBrand : b))
        );
      } else if (!editBrand && createdBrand) {
        setBrandList([createdBrand, ...brandList]);
      }

      setBrandName("");
      setImage(null);
      setBanner(null);
      setIsTopBrand(false);
      setEditBrand(null);
      toast.success(
        editBrand ? "Brand updated successfully!" : "Brand created successfully!"
      );
    } catch (err) {
      toast.error(err.message || "Brand creation or update failed.");
      if (uploadedImageUrl) {
        try {
          await deleteUploadedImage(uploadedImageUrl);
          toast.success("Uploaded logo cleaned up after failure.");
        } catch {
          toast.error("Failed to cleanup logo.");
        }
      }
      if (uploadedBannerUrl) {
        try {
          await deleteUploadedImage(uploadedBannerUrl);
          toast.success("Uploaded banner cleaned up after failure.");
        } catch {
          toast.error("Failed to cleanup banner.");
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditBrand = (brand) => {
    setEditBrand(brand);
    setBrandName(brand.name);
    setIsTopBrand(brand.is_top_brand || false);
    setImage(null);
    setBanner(null);
  };

  const handleRemoveBrand = async (id) => {
    if (typeof id === "number" && !isNaN(id)) {
      try {
        await deleteBrand(id);
        setBrandList(brandList.filter((brand) => brand.id !== id));
        toast.success("Brand removed.");
      } catch (err) {
        console.error("Delete brand error:", err);
        toast.error("Failed to remove brand.");
      }
    } else {
      setBrandList(brandList.filter((brand) => brand.id !== id));
      toast.success("Brand removed (local only).");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row gap-10">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="md:w-1/2 w-full">
          <label className="block mb-2 text-sm font-medium">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
            placeholder="Enter brand name"
          />

          <label className="block mb-2 text-sm font-medium">Brand Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
            required={!editBrand}
          />

          <label className="block mb-2 text-sm font-medium">Brand Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="mb-4"
          />

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isTopBrand"
              checked={isTopBrand}
              onChange={(e) => setIsTopBrand(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="isTopBrand" className="ml-2 text-sm font-medium text-gray-700">
              Mark as Top Brand
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            disabled={isUploading}
          >
            {editBrand ? "Update Brand" : "Add Brand"}
          </button>
          {editBrand && (
            <button
              type="button"
              className="w-full mt-2 bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
              onClick={() => {
                setEditBrand(null);
                setBrandName("");
                setImage(null);
                setBanner(null);
                setIsTopBrand(false);
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>

        {/* Brand List */}
        <div className="md:w-1/2 w-full border rounded p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">All Brands</h2>

          {/* Search and Filter Controls */}
          <div className="mb-4 space-y-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brands..."
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTopBrandsOnly"
                checked={showTopBrandsOnly}
                onChange={(e) => setShowTopBrandsOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="showTopBrandsOnly" className="ml-2 text-sm font-medium text-gray-700">
                Show Top Brands Only
              </label>
            </div>
          </div>

          {brandList.length === 0 ? (
            <p className="text-gray-500">No brands added yet.</p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <ul className="space-y-4">
                {brandList
                  .filter((brand) => {
                    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesTopBrandFilter = showTopBrandsOnly ? brand.is_top_brand : true;
                    return matchesSearch && matchesTopBrandFilter;
                  })
                  .map((brand) => (
                    <li
                      key={brand.id}
                      className="flex flex-col gap-2 bg-white p-3 rounded shadow"
                    >
                      <div className="flex items-center gap-4">
                        {brand.logo_url && (
                          <img
                            src={brand.logo_url}
                            alt={brand.name}
                            className="w-16 h-16 rounded-full object-cover border"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{brand.name}</p>
                          {brand.is_top_brand && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-1">
                              Top Brand
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRemoveBrand(brand.id)}
                            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => handleEditBrand(brand)}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      {brand.banner_url && (
                        <img
                          src={brand.banner_url}
                          alt={`${brand.name} banner`}
                          className="w-full h-20 object-cover rounded"
                        />
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandForm;
