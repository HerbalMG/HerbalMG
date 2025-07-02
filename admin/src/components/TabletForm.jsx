import React, { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from './ImageUploader';
import { gstOptions } from '../context/UserContext';
import { createProduct, updateProduct } from '../lib/productApi';
import { getBrands } from '../lib/brandApi';
import { getBooks } from '../lib/bookApi';

const TabletForm = ({ category, editProduct, setEditProduct }) => {
  const initialFormState = {
    name: '',
    brand: '',
    dosage: '',
    quantity: '',
    gst: '',
    description: '',
    keyIngredients: '',
    referenceBook: '',
    indications: '',
    lifestyleAdvice: '',
    actualPrice: '',
    discount: '',
    sellingPrice: '',
    prescriptionRequired: false,
    category: '',
    cause: '',
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const imageUploaderRef = useRef();
  const [brands, setBrands] = useState([]);
  const [referenceBooks, setReferenceBooks] = useState([]);
  const allowedGst = [0, 5, 12, 18];
  const allowedCategories = ['Ayurvedic', 'Unani', 'Homeopathic'];
  const [categoryValue, setCategoryValue] = useState(category || allowedCategories[0]);

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || '',
        brand: editProduct.brand || '',
        dosage: editProduct.dosage_information || '',
        quantity: editProduct.total_quantity || '',
        gst: editProduct.gst || '',
        description: editProduct.description || '',
        keyIngredients: editProduct.key_ingredients || '',
        referenceBook: (editProduct.reference_books && editProduct.reference_books[0]) || '',
        indications: editProduct.uses_indications || '',
        lifestyleAdvice: '',
        actualPrice: editProduct.actual_price || '',
        discount: editProduct.discount_percent || '',
        sellingPrice: editProduct.selling_price || '',
        prescriptionRequired: editProduct.prescription_required || false,
        category: editProduct.category || category,
        cause: editProduct.cause || '',
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
    getBrands().then(setBrands).catch(() => setBrands([]));
    getBooks().then(setReferenceBooks).catch(() => setReferenceBooks([]));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Medicine Name is required';
    if (!form.brand) newErrors.brand = 'Brand is required';
    if (form.actualPrice === '' || Number(form.actualPrice) <= 0)
      newErrors.actualPrice = 'Actual Price must be greater than 0';
    if (form.sellingPrice === '' || Number(form.sellingPrice) <= 0)
      newErrors.sellingPrice = 'Selling Price must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (name === "gst" ? parseInt(value, 10) : value),
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePriceOrDiscountChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...form,
      [name]: value,
    };

    const actualPrice = parseFloat(name === 'actualPrice' ? value : form.actualPrice);
    const discount = parseFloat(name === 'discount' ? value : form.discount);

    if (!isNaN(actualPrice) && !isNaN(discount)) {
      const discountAmount = (actualPrice * discount) / 100;
      updatedForm.sellingPrice = (actualPrice - discountAmount).toFixed(2);
    }

    setForm(updatedForm);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageFilesSelected = (files) => {
    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!allowedCategories.includes(categoryValue)) {
      toast.error("Category must be Ayurvedic, Unani, or Homeopathic");
      return;
    }
    if (!allowedGst.includes(Number(form.gst))) {
      toast.error("GST must be 0, 5, 12, or 18");
      return;
    }

    let uploadedImageUrls = [];
    if (selectedImages.length > 0 && typeof selectedImages[0] !== 'string') {
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

    const finalFormData = {
      ...form,
      images: uploadedImageUrls,
    };

    // Map frontend fields to backend schema
    const payload = {
      name: form.name,
      category: categoryValue,
      medicine_type: 'Tablet', // or get from form if available
      images: uploadedImageUrls,
      brand: form.brand ? [form.brand] : [],
      reference_books: form.referenceBook ? [form.referenceBook] : [],
      dosage_information: form.dosage,
      cause: form.cause,
      description: form.description,
      key_ingredients: form.keyIngredients,
      uses_indications: form.indications,
      actual_price: Number(form.actualPrice),
      selling_price: Number(form.sellingPrice),
      discount_percent: Number(form.discount),
      gst: parseInt(form.gst, 10),
      total_quantity: Number(form.quantity),
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
      setForm({ ...initialFormState, category: categoryValue });
      setErrors({});
      setSelectedImages([]);
      imageUploaderRef.current?.clearImages();
    } catch (err) {
      toast.error("Failed to save product.");
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit} className="space-y-6 mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Add Tablet / Capsule Medicine</h2>

        <ImageUploader
          ref={imageUploaderRef}
          deferUpload={true}
          onFilesSelected={handleImageFilesSelected}
        />

        {/* Medicine Name */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Medicine Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Medicine eg: Paracetamol 500mg"
            className={`w-full border rounded p-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block font-medium mb-1">
            Brand <span className="text-red-600">*</span>
          </label>
          <select
            id="brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
          {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand}</p>}
        </div>

        {/* Reference Book */}
        <div>
          <label htmlFor="referenceBook" className="block font-medium mb-1">Reference Book</label>
          <select
            id="referenceBook"
            name="referenceBook"
            value={form.referenceBook}
            onChange={handleChange}
            className="w-full border rounded p-2 border-gray-300"
          >
            <option value="">Select Reference Book</option>
            {referenceBooks.map((book) => (
              <option key={book.id} value={book.name}>{book.name}</option>
            ))}
          </select>
        </div>

        {/* Dosage */}
        <div>
          <label htmlFor="dosage" className="block font-medium mb-1">Dosage Information</label>
          <input
            type="text"
            id="dosage"
            name="dosage"
            value={form.dosage}
            onChange={handleChange}
            placeholder="Dosage eg: 1 tab/cap or as prescribed"
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>

        {/* Cause */}
        <div>
          <label htmlFor="cause" className="block font-medium mb-1">Cause</label>
          <input
            type="text"
            id="cause"
            name="cause"
            value={form.cause}
            onChange={handleChange}
            placeholder="Cause eg: Fever, Cough"
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>

        {/* Key Ingredients */}
        <div>
          <label htmlFor="keyIngredients" className="block font-medium mb-1">Key Ingredients</label>
          <textarea
            id="keyIngredients"
            name="keyIngredients"
            value={form.keyIngredients}
            onChange={handleChange}
            rows={2}
            placeholder="Comma-separated"
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>

        {/* Indications */}
        {/* <div>
          <label htmlFor="indications" className="block font-medium mb-1">Uses / Indications</label>
          <textarea
            id="indications"
            name="indications"
            value={form.indications}
            onChange={handleChange}
            rows={2}
            className="w-full border rounded p-2 border-gray-300"
          />
        </div> */}

        {/* Lifestyle Advice */}
        {/* <div>
          <label htmlFor="lifestyleAdvice" className="block font-medium mb-1">Dietary & Lifestyle Advice</label>
          <textarea
            id="lifestyleAdvice"
            name="lifestyleAdvice"
            value={form.lifestyleAdvice}
            onChange={handleChange}
            rows={2}
            className="w-full border rounded p-2 border-gray-300"
          />
        </div> */}

        {/* Actual Price, Discount, and Selling Price */}
        <div className="flex gap-4">
          {/* Actual Price */}
          <div className="relative w-1/3">
            <label htmlFor="actualPrice" className="block font-medium mb-1">
              Actual Price (MRP) <span className="text-red-600">*</span>
            </label>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              id="actualPrice"
              name="actualPrice"
              value={form.actualPrice}
              onChange={handlePriceOrDiscountChange}
              min={0}
              step="0.01"
              className={`pl-8 w-full border rounded p-2 ${
                errors.actualPrice ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.actualPrice && <p className="text-red-600 text-sm mt-1">{errors.actualPrice}</p>}
          </div>

          {/* Discount */}
          <div className="w-1/3">
            <label htmlFor="discount" className="block font-medium mb-1">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={form.discount}
              onChange={handlePriceOrDiscountChange}
              min={0}
              max={100}
              step="0.01"
              className="w-full border rounded p-2 border-gray-300"
            />
          </div>

          {/* Selling Price */}
          <div className="relative w-1/3">
            <label htmlFor="sellingPrice" className="block font-medium mb-1">Selling Price</label>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              id="sellingPrice"
              name="sellingPrice"
              value={form.sellingPrice}
              readOnly
              className="pl-8 w-full border rounded p-2 bg-gray-100 text-gray-700"
            />
          </div>
        </div>

        {/* GST and Quantity */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label htmlFor="gst" className="block font-medium mb-1">GST</label>
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

          <div className="w-1/2">
            <label htmlFor="quantity" className="block font-medium mb-1">Total Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300"
            />
          </div>
        </div>

        {/* Prescription Required */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="prescriptionRequired"
            name="prescriptionRequired"
            checked={form.prescriptionRequired}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label htmlFor="prescriptionRequired" className="font-medium select-none">
            Prescription Required
          </label>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded"
          >
            Submit Tablet
          </button>
        </div>
      </form>
    </>
  );
};

export default TabletForm;
