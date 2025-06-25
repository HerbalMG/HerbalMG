import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import toast, { Toaster } from "react-hot-toast";

const MedForm = ({ category }) => {
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
    prices: [{ unit: "", actualPrice: "", sellingPrice: "", quantity: "" }],
  });

  const [errors, setErrors] = useState({});
  const brands = [
    "Select Brand",
    "HealthCo",
    "PharmaPlus",
    "MediCare",
    "WellnessLabs",
  ];

  const referenceBooks = [
  'Ayurvedic Classics',
  'Homeopathic Materia Medica',
  'Unani Medicine Guide',
  'Pharmacology Reference',
  'Other',
];

const gstOptions = ['5%', '12%', '18%', 'Exempt'];


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    setForm((prev) => ({ ...prev, prices: updated }));
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
    if (!form.gst || isNaN(form.gst)) newErrors.gst = "Valid GST is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (!form.cause.trim()) newErrors.cause = "Cause is required.";
    if (!form.keyIngredients.trim())
      newErrors.keyIngredients = "Key ingredients are required.";
    if (!form.referenceBook.trim())
      newErrors.referenceBook = "Reference book is required.";
    if (!form.indications.trim())
      newErrors.indications = "Uses or indications are required.";
    if (!form.lifestyleAdvice.trim())
      newErrors.lifestyleAdvice =
        "Dietary/lifecycle advice is required.";

    const quantitiesSet = new Set();
    let hasValidPrice = false;

    form.prices.forEach((item, idx) => {
      if (!item.unit) {
        newErrors[`unit${idx}`] = "Unit is required.";
      } else if (quantitiesSet.has(item.unit)) {
        newErrors[`unit${idx}`] = "Duplicate unit.";
      } else {
        quantitiesSet.add(item.unit);
      }

      if (!item.actualPrice || parseFloat(item.actualPrice) <= 0) {
        newErrors[`actualPrice_${idx}`] = "Valid actual price required.";
      } else {
        hasValidPrice = true;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedPrices = form.prices.map((item) => ({
      unit: `${item.unit}${unit}`,
      actualPrice: item.actualPrice,
      sellingPrice: item.sellingPrice,
      quantity: item.quantity,
    }));

    const finalData = {
      ...form,
      unit,
      category,
      prices: formattedPrices,
    };

    console.log("Submitted Product:", finalData);
    toast.success("Medicine details submitted successfully!");

    setForm({ ...initialFormState, category });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Toaster position="top-right" />

      <ImageUploader />

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
        <label className="font-medium block mb-1">Brand</label>
        <select
          name="brand"
          className="w-full border rounded p-2"
          onChange={handleChange}
          value={form.brand}
        >
          {brands.map((b, idx) => (
            <option key={idx} value={idx === 0 ? "" : b} disabled={idx === 0}>
              {b}
            </option>
          ))}
        </select>
        {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
      </div>

      {/* Reference Book */}
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
    {referenceBooks.map((book, i) => (
      <option key={i} value={book}>
        {book}
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



<div>
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
</div>

<div>
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
</div>

{/* GST */}
<div>
  <label htmlFor="gst" className="block font-medium mb-1">
    GST
  </label>
  <select
    id="gst"
    name="gst"
    value={form.gst}
    onChange={handleChange}
    className="w-full border rounded p-2 border-gray-300"
  >
    <option value="">Select GST</option>
    {gstOptions.map((option, i) => (
      <option key={i} value={option}>
        {option}
      </option>
    ))}
  </select>
</div>

      <div >
        <label className="font-medium block mb-1">Prices per Unit</label>
        <div className="space-y-2 ">
          {form.prices.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1/5">
                <label className="text-sm">Unit</label>
                <input
                  type="number"
                  placeholder="Unit eg: 100 ml/gm"
                  value={item.unit}
                  onChange={(e) =>
                    handlePriceChange(index, "unit", e.target.value)
                  }
                  className="border rounded p-1 w-full mr-2"
                />
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
        Submit {unit === "ml" ? "Syrup" : "Powder"}
      </button>
    </form>
  );
};

export default MedForm;
