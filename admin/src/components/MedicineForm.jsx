import React, { useState, useEffect, useRef } from "react";
import ImageUploader from "./ImageUploader";
import toast, { Toaster } from "react-hot-toast";
import { createProduct, updateProduct, deleteProduct, deleteImage, getProductPrices, createProductPrices, updateProductPrices } from "../lib/productApi";
import { getBrands } from "../lib/brandApi";
import { getReferenceBooks } from "../lib/referenceBookApi";
import { getMainCategories } from "../lib/mainCategoryApi";
import { getSubCategories } from "../lib/subCategoryApi";
import { getDiseases } from "../lib/diseaseApi";
import TagInput from "./TagInput";
import Select from 'react-select';
import ProductSelects from './ProductSelects';
import ProductFlags from './ProductFlags';
import PriceSection from './PriceSection';

const MedicineForm = ({ editProduct, setEditProduct, category, onDelete, onSuccess, onCancel }) => {
  const imageRef = useRef();
  const typeOptions = [
    { value: "tablet", label: "Tablet" },
    { value: "capsule", label: "Capsule" },
    { value: "ml", label: "Liquid (ml)" },
    { value: "gm", label: "Gram (gm)" },
  ];

  const categoryOptions = [
    { value: "Ayurvedic", label: "Ayurvedic" },
    { value: "Unani", label: "Unani" },
    { value: "Homeopathic", label: "Homeopathic" },
  ];

  const initial = {
    type: "tablet",
    category: category || "Ayurvedic",
    name: "",
    slug: "",
    brand_id: "",
    mainCategoryId: "",
    subCategoryId: "",
    referenceBook: "",
    diseaseId: "",
    keyTags: [],
    ingredients: "",
    dosage: "",
    dietary: "",
    description: "",
    prescriptionRequired: false,
    strength: "",
    prices: [
      {
        size: "", // Empty by default, suffix will show the type
        quantity: "",
        actualPrice: "",
        discount: "0", // Default discount to 0
        sellingPrice: "",
      },
    ],
    selectedImages: [],
    seasonalMedicine: false,
    frequentlyBought: false,
    topProducts: false,
    peoplePreferred: false,
    maximumDiscount: false,
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [brandsList, setBrandsList] = useState([]);
  const [booksList, setBooksList] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [diseasesList, setDiseasesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [mainCategorySearch, setMainCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [referenceBookSearch, setReferenceBookSearch] = useState("");
  const [diseaseSearch, setDiseaseSearch] = useState("");
  const [listsLoaded, setListsLoaded] = useState(false);

  // Fetch brands & books, initialize on edit
  useEffect(() => {
    Promise.all([
      getBrands().then(setBrandsList).catch(() => setBrandsList([])),
      getReferenceBooks().then(setBooksList).catch(() => setBooksList([])),
      getMainCategories().then(setMainCategories).catch(() => setMainCategories([])),
      getSubCategories().then(setSubCategories).catch(() => setSubCategories([])),
      getDiseases().then(setDiseasesList).catch(() => setDiseasesList([])),
    ]).then(() => setListsLoaded(true));
  }, []);

  useEffect(() => {
    if (editProduct && listsLoaded) {
      (async () => {
        let pricesArr = [];
        try {
          pricesArr = await getProductPrices(editProduct.id);
          pricesArr = pricesArr.map(p => ({
            size: String(p.size || p.medicine_type || form.type),
            quantity: String(p.quantity || p.total_quantity || ""),
            actualPrice: String(p.actual_price || p.actualPrice || ""),
            discount: String(p.discount_percent || p.discount || ""),
            sellingPrice: String(p.selling_price || p.sellingPrice || ""),
          }));
        } catch (e) {
          // fallback to single price if fetch fails
          pricesArr = [
            {
              size: String(editProduct.size || editProduct.medicine_type || form.type),
              quantity: String(editProduct.total_quantity || ""),
              actualPrice: String(editProduct.actual_price || ""),
              discount: String(editProduct.discount_percent || ""),
              sellingPrice: String(editProduct.selling_price || ""),
            },
          ];
        }
        setForm({
          type:
            editProduct.medicine_type === "Syrup"
              ? "ml"
              : editProduct.medicine_type === "Gram"
              ? "gm"
              : editProduct.medicine_type === "Capsule"
              ? "capsule"
              : "tablet",
          category: editProduct.category || "Ayurvedic",
          name: editProduct.name || "",
          brand_id: String(editProduct.brand_id || ""),
          mainCategoryId: String(editProduct.main_category_id || ""),
          subCategoryId: String(editProduct.sub_category_id || ""),
          referenceBook: editProduct.reference_books?.[0] || "",
          keyTags: (editProduct.key || "")
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
          ingredients: editProduct.key_ingredients || "",
          dosage: editProduct.dosage || "",
          dietary: editProduct.dietary || "",
          description: editProduct.description || "",
          prescriptionRequired: Boolean(editProduct.prescription_required),
          strength: editProduct.strength || "",
          prices: pricesArr,
          selectedImages: editProduct.images || [],
          seasonalMedicine: Boolean(editProduct.seasonal_medicine),
          frequentlyBought: Boolean(editProduct.frequently_bought),
          topProducts: Boolean(editProduct.top_products),
          peoplePreferred: Boolean(editProduct.people_preferred),
          maximumDiscount: Boolean(editProduct.maximum_discount),
          diseaseId: String(editProduct.disease_id || ""),
        });
      })();
    } else if (!editProduct && listsLoaded) {
      setForm(initial);
    }
  }, [editProduct, listsLoaded]);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (idx, field, value) => {
    const prices = [...form.prices];
    prices[idx][field] = value;
    
    // Auto-calculate selling price when actual price or discount changes
    if (field === 'actualPrice' || field === 'discount') {
      const actual = parseFloat(prices[idx].actualPrice) || 0;
      const discount = parseFloat(prices[idx].discount) || 0;
      
      if (actual > 0) {
        const discountAmount = (actual * discount) / 100;
        const sellingPrice = actual - discountAmount;
        prices[idx].sellingPrice = sellingPrice > 0 ? sellingPrice.toFixed(2) : "";
      } else {
        prices[idx].sellingPrice = "";
      }
    }
    
    setForm((prev) => ({ ...prev, prices }));
  };

  const addPriceRow = () =>
    setForm((prev) => ({
      ...prev,
      prices: [
        ...prev.prices,
        {
          size: "", // Empty by default, suffix will show the type
          quantity: "",
          actualPrice: "",
          discount: "0", // Default discount to 0
          sellingPrice: "",
        },
      ],
    }));

  const removePriceRow = (idx) => {
    if (form.prices.length === 1) return;
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== idx),
    }));
  };

  const validateForm = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.brand_id) e.brand_id = "Required";
    // if (!form.mainCategoryId) e.mainCategoryId = "Required";
    // if (!form.subCategoryId) e.subCategoryId = "Required";
    if (!form.keyTags.length) e.keyTags = "Add tags";
    if (!form.description.trim()) e.description = "Required";
    if (!form.dosage.trim()) e.dosage = "Required";
    if (!form.dietary.trim()) e.dietary = "Required";
    if (!form.ingredients.trim()) e.ingredients = "Required";
    // if (!form.strength.trim()) e.strength = "Required";
    // if (!form.referenceBook) e.referenceBook = "Required"; // Added error handling for referenceBook
    // if (!form.diseaseId) e.diseaseId = "Required";
    form.prices.forEach((p, i) => {
      if (!p.size) e[`size_${i}`] = "Required";
      if (!p.quantity) e[`quantity_${i}`] = "Required";
      if (
        !p.actualPrice ||
        isNaN(p.actualPrice) ||
        parseFloat(p.actualPrice) <= 0
      )
        e[`actualPrice_${i}`] = "Enter price";
      if (p.discount === "" || isNaN(p.discount) || parseFloat(p.discount) < 0 || parseFloat(p.discount) > 100)
        e[`discount_${i}`] = "Enter valid discount (0-100%)";
      if (!p.sellingPrice) e[`sellingPrice_${i}`] = "Required";
    });
    if (!form.selectedImages || form.selectedImages.length === 0)
      e.selectedImages = "Select at least one";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleDelete = async () => {
    if (!editProduct) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
     await deleteProduct(editProduct.id);
toast.success("Product deleted successfully");
// Add a short delay before unmounting/resetting
setTimeout(() => {
  setEditProduct?.(null);
  if (typeof onDelete === 'function') onDelete();
}, 500);
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form", form);
    
    // Check authentication before proceeding
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user.token || localStorage.getItem('token');
    console.log("User authentication status:", { hasUser: !!user, hasToken: !!token });
    
    if (!token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }
    
    const isValid = validateForm();
    console.log("Validation result:", isValid, errors);
    if (!isValid) return;
    setLoading(true);

    let productId,
      uploadedUrls = [],
      initialUrls = [];

    if (editProduct && Array.isArray(editProduct.images)) {
      initialUrls = [...editProduct.images];
    }

    try {
      const common = {
        name: form.name.trim(),
        category: form.category,
        medicine_type:
          form.type === "ml"
            ? "syrup"
            : form.type === "gm"
            ? "powder"
            : form.type === "capsule"
            ? "capsule"
            : "tablet",
        brand_id: parseInt(form.brand_id, 10),
        main_category_id: form.mainCategoryId ? parseInt(form.mainCategoryId, 10) : null,
        sub_category_id: form.subCategoryId ? parseInt(form.subCategoryId, 10) : null,
        reference_books: form.referenceBook ? [form.referenceBook] : [],
        key: form.keyTags.join(", "),
        key_ingredients: form.ingredients.trim(),
        dosage: form.dosage.trim(),
        dietary: form.dietary.trim(),
        description: form.description.trim(),
        strength: form.strength.trim(),
        prescription_required: form.prescriptionRequired,
        actual_price: parseFloat(form.prices[0].actualPrice),
        selling_price: parseFloat(form.prices[0].sellingPrice),
        discount_percent: parseFloat(form.prices[0].discount),
        total_quantity: parseInt(form.prices[0].quantity, 10),
        images: [],
        seasonal_medicine: form.seasonalMedicine,
        frequently_bought: form.frequentlyBought,
        top_products: form.topProducts,
        people_preferred: form.peoplePreferred,
        maximum_discount: form.maximumDiscount,
        disease_id: form.diseaseId ? parseInt(form.diseaseId, 10) : null,
      };
      console.log("Submitting to API:", editProduct ? "update" : "create", common);

      if (editProduct) {
        await updateProduct(editProduct.id, { ...common });
        productId = editProduct.id;
        toast.success("Product updated successfully");
      } else {
        const pr = await createProduct({ ...common });
        productId = pr.id;
        toast.success("Product added successfully");
      }

      // Handle price rows (save all price variations)
      if (form.prices.length > 0) {
        try {
          const priceData = form.prices.map(price => ({
            size: price.size,
            quantity: parseInt(price.quantity, 10),
            actual_price: parseFloat(price.actualPrice),
            discount_percent: parseFloat(price.discount),
            selling_price: parseFloat(price.sellingPrice)
          }));

          console.log("Saving price data:", priceData);

          if (editProduct) {
            await updateProductPrices(productId, priceData);
          } else {
            await createProductPrices(productId, priceData);
          }
          toast.success("Product prices saved successfully");
        } catch (priceErr) {
          console.error("Error saving prices:", priceErr);
          toast.error("Product saved but failed to save prices: " + priceErr.message);
        }
      }

      // Handle image uploads
      for (const img of form.selectedImages) {
        if (typeof img === "string") {
          uploadedUrls.push(img);
        } else {
          const fd = new FormData();
          fd.append("image", img);
          
          // Get auth token
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const token = user.token || localStorage.getItem('token');
          const headers = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          
          const res = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/upload?type=product`,
            {
              method: "POST",
              headers,
              body: fd,
            }
          );
          if (!res.ok) throw new Error("Image upload failed");
          const js = await res.json();
          uploadedUrls.push(js.imageUrl);
        }
      }

      const finalUrls = Array.from(new Set([...initialUrls, ...uploadedUrls]));

      if (uploadedUrls.length > 0) {
        await updateProduct(productId, { ...common, images: finalUrls });
        toast.success("Product images updated successfully");
      }

      setForm(initial);
      if (imageRef.current?.clearImages) {
        imageRef.current.clearImages();
      } else {
        // Warn if clearImages is not implemented
        console.warn("ImageUploader is missing clearImages method. Please implement it for proper reset.");
      }
      setEditProduct?.(null);
      
      // Call success callback if provided
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      console.error("Error submitting product:", err);
      
      // Show specific error messages
      if (err.message.includes("No token provided") || err.message.includes("Unauthorized")) {
        toast.error("Authentication failed. Please log in again.");
      } else if (err.message.includes("Forbidden")) {
        toast.error("You don't have permission to perform this action.");
      } else {
        toast.error(err.message || "Failed to submit product");
      }
      
      // Clean up orphaned images
      for (const url of uploadedUrls) {
        try {
          await deleteImage(url);
        } catch (cleanupErr) {
          console.error("Cleanup failed for", url, cleanupErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // console.log("Form state:", form);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Toaster position="top-right" />
      {/* Category Selector */}
      <div>
        <label className="font-medium block mb-2">Medicine Category</label>
        <div className="flex gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex-1 font-semibold px-4 py-3 rounded transition-colors ${
                form.category === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  category: option.value,
                }))
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type selectors */}
      <div>
        <label className="font-medium block mb-2">Medicine Type</label>
        <div className="flex gap-2">
          {typeOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`w-full font-semibold px-6 py-3 rounded ${
                form.type === o.value
                  ? "bg-orange-600 text-white"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  type: o.value,
                  // Don't modify size field, just change the type
                }))
              }
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image Uploader */}
      <ImageUploader
        ref={imageRef}
        folderType="product"
        onFilesSelected={(files) => {
          setForm((f) => {
            const existing = f.selectedImages || [];
            const all = [...existing, ...files];
            const unique = [];
            const seen = new Set();
            for (const img of all) {
              let key;
              if (typeof img === "string") {
                key = img;
              } else {
                key = img.name + "_" + img.size;
              }
              if (!seen.has(key)) {
                seen.add(key);
                unique.push(img);
              }
            }
            return { ...f, selectedImages: unique };
          });
        }}
        deferUpload
        previewUrls={form.selectedImages && form.selectedImages.length > 0 && typeof form.selectedImages[0] === 'string' ? form.selectedImages : undefined}
      />
      {errors.selectedImages && (
        <p className="text-red-500">{errors.selectedImages}</p>
      )}

      {/* Product Name */}
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

      {/* Product Selects (Brand, Main Category, Sub Category, Reference Book, Disease) */}
      <ProductSelects
        form={form}
        setForm={setForm}
        errors={errors}
        brandsList={brandsList}
        mainCategories={mainCategories}
        subCategories={subCategories}
        booksList={booksList}
        diseasesList={diseasesList}
      />

      {/* Key Tags */}
      <TagInput
        tags={form.keyTags}
        onChange={(keyTags) => setForm((f) => ({ ...f, keyTags }))}
        placeholder="Eg: Cough, Fever, Ayurvedic, Homeopathic"
      />
      {errors.keyTags && (
        <p className="text-red-500 text-sm">{errors.keyTags}</p>
      )}

      {/* Description */}
      <div>
        <label className="font-medium block mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Write description of product here."
          className="w-full border rounded p-2"
          rows={2}
          value={form.description}
          onChange={handleChange}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      {/* Dosage */}
      <div>
        <label className="font-medium block mb-1">Dosage</label>
        <textarea
          name="dosage"
          placeholder="Dosage info.."
          className="w-full border rounded p-2"
          rows={2}
          value={form.dosage}
          onChange={handleChange}
        />
        {errors.dosage && (
          <p className="text-red-500 text-sm">{errors.dosage}</p>
        )}
      </div>

      {/* Dietary & Lifestyle Advice */}
      <div>
        <label className="font-medium block mb-1">Dietary & Lifestyle Advice</label>
        <textarea
          name="dietary"
          placeholder="Write Dietary & Lifestyle Advice"
          className="w-full border rounded p-2"
          rows={2}
          value={form.dietary}
          onChange={handleChange}
        />
        {errors.dietary && (
          <p className="text-red-500 text-sm">{errors.dietary}</p>
        )}
      </div>

      {/* Key Ingredients */}
      <div>
        <label className="font-medium block mb-1">Key Ingredients</label>
        <textarea
          name="ingredients"
          placeholder="Key Ingredients of product"
          className="w-full border rounded p-2"
          rows={2}
          value={form.ingredients}
          onChange={handleChange}
        />
        {errors.ingredients && (
          <p className="text-red-500 text-sm">{errors.ingredients}</p>
        )}
      </div>

      {/* Strength (for all medicine types) */}
      <div>
        <label className="font-medium block mb-1">
          Strength 
          <span className="text-gray-500 text-sm ml-1">
            ({form.type === "tablet" ? "e.g., 500mg, 250mg" : 
              form.type === "capsule" ? "e.g., 250mg, 500mg" :
              form.type === "ml" ? "e.g., 100ml, 200ml" :
              form.type === "gm" ? "e.g., 50g, 100g" : "e.g., 500mg"})
          </span>
        </label>
        <input
          type="text"
          name="strength"
          placeholder={
            form.type === "tablet" ? "e.g., 500mg, 250mg" : 
            form.type === "capsule" ? "e.g., 250mg, 500mg" :
            form.type === "ml" ? "e.g., 100ml, 200ml" :
            form.type === "gm" ? "e.g., 50g, 100g" : "e.g., 500mg"
          }
          className="w-full border rounded p-2"
          value={form.strength}
          onChange={handleChange}
        />
        {errors.strength && (
          <p className="text-red-500 text-sm">{errors.strength}</p>
        )}
      </div>

      {/* Price Section */}
      <PriceSection
        prices={form.prices}
        setPrices={prices => setForm(f => ({ ...f, prices }))}
        errors={errors}
        formType={form.type}
      />

      {/* Product Flags (Checkboxes) */}
      <ProductFlags form={form} setForm={setForm} />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-green-600 text-white font-semibold px-6 py-3 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        }`}
      >
        {loading
          ? "Submitting…"
          : `Submit ${
              form.type === "tablet"
                ? "Tablet"
                : form.type === "ml"
                ? "Syrup"
                : form.type === "gm"
                ? "Gram"
                : form.type === "capsule"
                ? "Capsule"
                : "Medicine"
            }`}
      </button>
      {editProduct && (
        <button
          type="button"
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded"
          disabled={loading}
        >
          Delete Product
        </button>
      )}
      {/* Cancel Button */}
      {/* {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded"
          disabled={loading}
        >
          Cancel
        </button>
      )} */}
      {editProduct && (
        <button
          type="button"
          onClick={() => { setForm(initial); setEditProduct(null); }}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded mt-2"
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default MedicineForm;

// TODO: This file is very large. Consider splitting into smaller components for maintainability.
