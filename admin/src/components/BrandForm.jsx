// src/components/ImageForm.jsx
import React, { useState } from "react";

const BrandForm = () => {
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send the brandName and image to your backend here
    console.log({ brandName, image });
    alert("Form submitted!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 "
    >
      <h2 className="text-xl font-bold mb-4">Brand Form</h2>

      <label className="block mb-2 text-sm font-medium">Brand Name</label>
      <input
        type="text"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        required
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter brand name"
      />

      {/* <label className="block mb-2 text-sm font-medium">Upload Image</label> */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4 relative">
          <img src={preview} alt="Preview" className="w-full rounded" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default BrandForm;
