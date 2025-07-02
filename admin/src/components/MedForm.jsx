import React, { useState, useRef, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import toast, { Toaster } from "react-hot-toast";
import { gstOptions } from "../context/UserContext";
import { createProduct, updateProduct } from "../lib/productApi";
import { getBrands } from "../lib/brandApi";
import { getBooks } from "../lib/bookApi";

const MedForm = ({ editProduct, setEditProduct, category }) => {
  const [unit, setUnit] = useState("ml");
  const [form, setForm] = useState({
    name: "",
    brand: "",
    dosage: "",
    gst: "",
    description: "",
    prescriptionRequired: false,
    cause: "",
    keyIngredients: "",
    referenceBook: "",
    indications: "",
    lifestyleAdvice: "",
    prices: [
      {
        unit: "",
        actualPrice: "",
        discount: "",
        sellingPrice: "",
        quantity: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const imageUploaderRef = useRef();
  const [brands, setBrands] = useState([]);
  const [referenceBooks, setReferenceBooks] = useState([]);

  const allowedGst = [0, 5, 12, 18];
  const allowedCategories = ['Ayurvedic', 'Unani', 'Homeopathic'];
  const [categoryValue, setCategoryValue] = useState(category || allowedCategories[0]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (name === "gst" ? parseInt(value, 10) : value),
    }));
  };

  const handleUnitChange = (e) => {
    const selectedUnit = e.target.value;
    setUnit(selectedUnit);
    setForm((prev) => ({
      ...prev,
      prices: [{ unit: "", actualPrice: "", sellingPrice: "", quantity: "" }],
    }));
    setErrors({});
  };

  const handlePriceChange = (index, field, value) => {
    const updated = [...form.prices];
    updated[index][field] = value;

    const actual = parseFloat(updated[index].actualPrice) || 0;
    const discount = parseFloat(updated[index].discount) || 0;

    if (!isNaN(actual) && !isNaN(discount)) {
      updated[index].sellingPrice = (
        actual -
        (actual * discount) / 100
      ).toFixed(2);
    }

    setForm((prev) => ({ ...prev, prices: updated }));
    setErrors((prev) => ({ ...prev, [`${field}_${index}`]: undefined }));
  };

  const addQuantityPrice = () => {
    setForm((prev) => ({
      ...prev,
      prices: [
        ...prev.prices,
        { unit: "", actualPrice: "", sellingPrice: "", quantity: "" },
      ],
    }));
  };

  const removeQuantityPrice = (index) => {
    const updated = [...form.prices];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, prices: updated }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.brand) newErrors.brand = "Brand is required.";
    if (!form.dosage.trim()) newErrors.dosage = "Dosage is required.";
    if (!form.gst) newErrors.gst = "Valid GST is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (!form.cause.trim()) newErrors.cause = "Cause is required.";
    if (!form.keyIngredients.trim())
      newErrors.keyIngredients = "Key ingredients are required.";
    if (!form.referenceBook.trim())
      newErrors.referenceBook = "Reference book is required.";
    // if (!form.indications.trim())
    //   newErrors.indications = "Uses or indications are required.";
    // if (!form.lifestyleAdvice.trim())
    //   newErrors.lifestyleAdvice = "Dietary/lifecycle advice is required.";

    const unitSet = new Set();
    let hasValidPrice = false;

    form.prices.forEach((item, idx) => {
      if (!item.unit) {
        newErrors[`unit${idx}`] = "Unit is required.";
      } else if (unitSet.has(item.unit)) {
        newErrors[`unit${idx}`] = "Duplicate unit.";
      } else {
        unitSet.add(item.unit);
      }

      if (!item.actualPrice || parseFloat(item.actualPrice) <= 0) {
        newErrors[`actualPrice_${idx}`] = "Valid actual price required.";
      } else {
        hasValidPrice = true;
      }

      if (!item.discount || parseFloat(item.discount) < 0) {
        newErrors[`discount_${idx}`] = "Valid discount (%) required.";
      }

      if (!item.sellingPrice || parseFloat(item.sellingPrice) <= 0) {
        newErrors[`sellingPrice_${idx}`] = "Valid selling price required.";
      }

      if (!item.quantity || parseInt(item.quantity) <= 0) {
        newErrors[`quantity_${idx}`] = "Valid Quantity required.";
      }
    });

    if (!hasValidPrice) {
      newErrors.prices = "At least one valid price entry required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageFilesSelected = (files) => {
    setSelectedImages(files);
  };

  useEffect(() => {
    console.log('MedForm useEffect: editProduct changed:', editProduct);
    if (editProduct) {
      setForm({
        name: editProduct.name || "",
        brand: editProduct.brand || "",
        dosage: editProduct.dosage_information || "",
        gst: editProduct.gst || "",
        description: editProduct.description || "",
        prescriptionRequired: editProduct.prescription_required || false,
        cause: editProduct.cause || "",
        keyIngredients: editProduct.key_ingredients || "",
        referenceBook:
          (editProduct.reference_books && editProduct.reference_books[0]) || "",
        indications: editProduct.uses_indications || "",
        lifestyleAdvice: "",
        prices: [
          {
            unit: "",
            actualPrice: editProduct.actual_price || "",
            discount: editProduct.discount_percent || "",
            sellingPrice: editProduct.selling_price || "",
            quantity: editProduct.total_quantity || "",
          },
        ],
      });
      setSelectedImages(editProduct.images || []);
      if (editProduct.category && allowedCategories.includes(editProduct.category)) {
        setCategoryValue(editProduct.category);
      }
    } else if (category && allowedCategories.includes(category)) {
      setCategoryValue(category);
    }
  }, [editProduct, category]);

  useEffect(() => {
    getBrands()
      .then(setBrands)
      .catch(() => setBrands([]));
    getBooks()
      .then(setReferenceBooks)
      .catch(() => setReferenceBooks([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('categoryValue:', categoryValue, 'category prop:', category);
    if (!validateForm()) return;
    if (!allowedCategories.includes(categoryValue)) {
      toast.error("Category must be Ayurvedic, Unani, or Homeopathic");
      return;
    }
    if (!allowedGst.includes(Number(form.gst))) {
      toast.error("GST must be 0, 5, 12, or 18");
      return;
    }

    let uploadedImageUrls = [];
    if (selectedImages.length > 0 && typeof selectedImages[0] !== "string") {
      toast.loading("Uploading images...");
      for (const file of selectedImages) {
        try {
          const formData = new FormData();
          formData.append("image", file);
          const res = await fetch("http://localhost:3001/api/upload", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();
          uploadedImageUrls.push(data.imageUrl);
        } catch (err) {
          toast.dismiss();
          toast.error("Image upload failed.");
          return;
        }
      }
      toast.dismiss();
      toast.success("Images uploaded!");
    } else if (selectedImages.length > 0) {
      uploadedImageUrls = selectedImages;
    }

    const formattedPrices = form.prices.map((item) => ({
      unit: item.unit,
      actualPrice: item.actualPrice,
      sellingPrice: item.sellingPrice,
      quantity: item.quantity,
    }));

    const finalData = {
      ...form,
      unit,
      category: categoryValue,
      prices: formattedPrices,
      images: uploadedImageUrls,
    };

    // Map frontend fields to backend schema
    const payload = {
      name: form.name,
      category: categoryValue,
      medicine_type: 'Syrup', // or get from form if available
      images: uploadedImageUrls,
      brand: form.brand ? [form.brand] : [],
      reference_books: form.referenceBook ? [form.referenceBook] : [],
      dosage_information: form.dosage,
      cause: form.cause,
      description: form.description,
      key_ingredients: form.keyIngredients,
      uses_indications: form.indications,
      actual_price: Number(form.prices[0]?.actualPrice),
      selling_price: Number(form.prices[0]?.sellingPrice),
      discount_percent: Number(form.prices[0]?.discount),
      gst: parseInt(form.gst, 10),
      total_quantity: Number(form.prices[0]?.quantity),
      prescription_required: form.prescriptionRequired,
    };
    console.log('Product payload:', payload);

    try {
      if (editProduct) {
        await updateProduct(editProduct.id, payload);
        toast.success("Product updated!");
        setEditProduct(null);
      } else {
        await createProduct(payload);
        toast.success("Product created!");
      }
      setForm({
        name: '',
        brand: '',
        dosage: '',
        gst: '',
        description: '',
        prescriptionRequired: false,
        cause: '',
        keyIngredients: '',
        referenceBook: '',
        indications: '',
        lifestyleAdvice: '',
        prices: [{ unit: '', actualPrice: '', discount: '', sellingPrice: '', quantity: '' }],
      });
      setErrors({});
      setSelectedImages([]);
      imageUploaderRef.current?.clearImages();
    } catch (err) {
      toast.error("Failed to save product.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Toaster position="top-right" />

      {editProduct && (
        <div className="flex justify-between items-center bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4">
          <span className="text-yellow-800 font-medium">Editing: {editProduct.name}</span>
          <button
            type="button"
            className="ml-4 px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded text-gray-800"
            onClick={() => {
              setEditProduct(null);
              setForm({
                name: '',
                brand: '',
                dosage: '',
                gst: '',
                description: '',
                prescriptionRequired: false,
                cause: '',
                keyIngredients: '',
                referenceBook: '',
                indications: '',
                lifestyleAdvice: '',
                prices: [{ unit: '', actualPrice: '', discount: '', sellingPrice: '', quantity: '' }],
              });
              setErrors({});
              setSelectedImages([]);
              imageUploaderRef.current?.clearImages();
            }}
          >
            Cancel Edit
          </button>
        </div>
      )}

      <ImageUploader
        ref={imageUploaderRef}
        deferUpload={true}
        onFilesSelected={handleImageFilesSelected}
      />

      <div>
        <label className="font-medium block mb-1">Select Unit</label>
        <select
          value={unit}
          onChange={handleUnitChange}
          className="border rounded p-2"
        >
          <option value="ml">ml</option>
          <option value="gm">gm</option>
        </select>
      </div>

      <div>
        <label className="font-medium block mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          className="w-full border rounded p-2"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="brand" className="block font-medium mb-1">
          Brand <span className="text-red-600">*</span>
        </label>
        <select
          id="brand"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${
            errors.brand ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        {errors.brand && (
          <p className="text-red-600 text-sm mt-1">{errors.brand}</p>
        )}
      </div>

      <div>
        <label htmlFor="referenceBook" className="block font-medium mb-1">
          Reference Book
        </label>
        <select
          id="referenceBook"
          name="referenceBook"
          value={form.referenceBook}
          onChange={handleChange}
          className="w-full border rounded p-2 border-gray-300"
        >
          <option value="">Select Reference Book</option>
          {referenceBooks.map((book) => (
            <option key={book.id} value={book.name}>
              {book.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-medium block mb-1">Dosage Info</label>
        <input
          type="text"
          name="dosage"
          className="w-full border rounded p-2"
          value={form.dosage}
          placeholder="Dosage info."
          onChange={handleChange}
        />
        {errors.dosage && (
          <p className="text-red-500 text-sm">{errors.dosage}</p>
        )}
      </div>

      <div>
        <label className="font-medium block mb-1">Description</label>
        <textarea
          name="description"
          className="w-full border rounded p-2"
          rows={3}
          value={form.description}
          placeholder="description.."
          onChange={handleChange}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="font-medium block mb-1">Cause</label>
        <input
          type="text"
          name="cause"
          placeholder="Cause eg: Fever, Cough"
          className="w-full border rounded p-2"
          value={form.cause}
          onChange={handleChange}
        />
        {errors.cause && <p className="text-red-500 text-sm">{errors.cause}</p>}
      </div>

      <div>
        <label className="font-medium block mb-1">Key Ingredients</label>
        <textarea
          name="keyIngredients"
          placeholder="Key Ingredients eg: Tulsi etc."
          className="w-full border rounded p-2"
          rows={2}
          value={form.keyIngredients}
          onChange={handleChange}
        />
        {errors.keyIngredients && (
          <p className="text-red-500 text-sm">{errors.keyIngredients}</p>
        )}
      </div>

      {/* <div>
  <label className="font-medium block mb-1">Uses / Indications</label>
  <textarea
    name="indications"
    placeholder="Indication eg: "
    className="w-full border rounded p-2"
    rows={2}
    value={form.indications}
    onChange={handleChange}
  />
  {errors.indications && (
    <p className="text-red-500 text-sm">{errors.indications}</p>
  )}
</div> */}

      {/* <div>
  <label className="font-medium block mb-1">Dietary / Lifecycle Advice</label>
  <textarea
    name="lifestyleAdvice"
    placeholder="Advice eg: "
    className="w-full border rounded p-2"
    rows={2}
    value={form.lifestyleAdvice}
    onChange={handleChange}
  />
  {errors.lifestyleAdvice && (
    <p className="text-red-500 text-sm">{errors.lifestyleAdvice}</p>
  )}
</div> */}

      <div className="w-1/2">
        <label htmlFor="gst" className="block font-medium mb-1">
          GST
        </label>
        <select
          id="gst"
          name="gst"
          value={form.gst}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select GST</option>
          <option value={0}>0%</option>
          <option value={5}>5%</option>
          <option value={12}>12%</option>
          <option value={18}>18%</option>
        </select>
      </div>

      <div>
        <label className="font-medium block mb-1">Prices per Unit</label>
        <div className="space-y-2 ">
          {form.prices.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1/5 relative">
                <label className="block font-medium mb-1">Unit</label>
                <input
                  type="number"
                  placeholder={`e.g. 100`}
                  value={item.unit}
                  onChange={(e) =>
                    handlePriceChange(index, "unit", e.target.value)
                  }
                  className="w-full border rounded p-2 pl-2 pr-10"
                />
                <span className="absolute right-2 top-9 text-gray-600">
                  {unit}
                </span>
                {errors[`unit${index}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`unit${index}`]}
                  </p>
                )}
              </div>

              <div className="w-1/5 relative">
                <label className="text-sm">Actual Price</label>
                <span className="absolute left-2 top-9 text-gray-500">₹</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Actual Price "
                  value={item.actualPrice}
                  onChange={(e) =>
                    handlePriceChange(index, "actualPrice", e.target.value)
                  }
                  className="border rounded p-1 pl-6 w-full"
                />
                {errors[`actualPrice_${index}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`actualPrice_${index}`]}
                  </p>
                )}
              </div>

              <div className="w-1/5">
                <label className="text-sm">Discount (%)</label>
                <input
                  type="number"
                  placeholder="Discount %"
                  value={item.discount}
                  onChange={(e) =>
                    handlePriceChange(index, "discount", e.target.value)
                  }
                  className="border rounded p-1 w-full"
                />
                {errors[`discount_${index}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`discount_${index}`]}
                  </p>
                )}
              </div>

              <div className="w-1/5 relative">
                <label className="text-sm">Selling Price</label>
                <span className="absolute left-2 top-9 text-gray-500">₹</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Selling Price"
                  value={item.sellingPrice}
                  onChange={(e) =>
                    handlePriceChange(index, "sellingPrice", e.target.value)
                  }
                  className="border rounded p-1 pl-6 w-full"
                />
                {errors[`sellingPrice_${index}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`sellingPrice_${index}`]}
                  </p>
                )}
              </div>

              <div className="w-1/5">
                <label className="text-sm">Quantity</label>
                <input
                  type="number"
                  placeholder="Quantity eg:150"
                  value={item.quantity}
                  onChange={(e) =>
                    handlePriceChange(index, "quantity", e.target.value)
                  }
                  className="border rounded p-1 w-full"
                />
                {errors[`quantity_${index}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`quantity_${index}`]}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeQuantityPrice(index)}
                className="text-red-600 mt-6"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuantityPrice}
            className="mt-2 text-blue-600"
          >
            + Add Unit
          </button>
        </div>
      </div>

      {/* Prescription Required checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="prescriptionRequired"
          name="prescriptionRequired"
          checked={form.prescriptionRequired}
          onChange={handleChange}
          className="w-5 h-5"
        />
        <label
          htmlFor="prescriptionRequired"
          className="select-none font-medium"
        >
          Prescription Required
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded"
      >
        Submit
          {unit === "ml" ? "Syrup" : "Powder"}
      </button>
    </form>
  );
};

export default MedForm;
