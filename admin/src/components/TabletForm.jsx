import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from './ImageUploader'; // your image uploader component

const TabletForm = ({ category }) => {
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
    sellingPrice: '',
    prescriptionRequired: false,
    category: '',
    cause: ''
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const brands = ['Pfizer', 'Sun Pharma', 'Cipla', 'Dr. Reddy’s', 'Other'];

  const referenceBooks = [
  'Ayurvedic Classics',
  'Homeopathic Materia Medica',
  'Unani Medicine Guide',
  'Pharmacology Reference',
  'Other',
];

const gstOptions = ['5%', '12%', '18%', 'Exempt'];


  useEffect(() => {
    setForm(prev => ({ ...prev, category }));
  }, [category]);

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
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Submit form data
    console.log('Submitted Tablet Form:', form);

    toast.success('Medicine submitted successfully!');

    setForm({ ...initialFormState, category });
    setErrors({});
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit} className="space-y-6  mx-auto p-6 ">
        <h2 className="text-xl font-semibold mb-4">Add Tablet / Capsule Medicine</h2>

        <ImageUploader />

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
            {brands.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand}</p>}
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

        {/* Dosage */}
        <div>
          <label htmlFor="dosage" className="block font-medium mb-1">
            Dosage Information
          </label>
          <input
            type="text"
            id="dosage"
            name="dosage"
            value={form.dosage}
            onChange={handleChange}
            placeholder="Dosage details eg: 1 tab/cap at a time or prescribed by Dr."
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>

        {/* Cause */}
        <div>
          <label htmlFor="cause" className="block font-medium mb-1">
            Cause 
          </label>
          <input
            type="text"
            id="cause"
            name="cause"
            value={form.cause}
            onChange={handleChange}
            placeholder="Cause details eg: Fever, Cough"
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>


       

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Description"
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>

        {/* Key Ingredients */}
        <div>
          <label htmlFor="keyIngredients" className="block font-medium mb-1">
            Key Ingredients
          </label>
          <textarea
            id="keyIngredients"
            name="keyIngredients"
            value={form.keyIngredients}
            onChange={handleChange}
            rows={2}
            placeholder="Comma separated ingredients"
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>

      


        {/* Indications */}
        <div>
          <label htmlFor="indications" className="block font-medium mb-1">
            Uses / Indications
          </label>
          <textarea
            id="indications"
            name="indications"
            value={form.indications}
            onChange={handleChange}
            rows={2}
            placeholder="Uses or indications"
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>

        {/* Dietary & Lifestyle Advice */}
        <div>
          <label htmlFor="lifestyleAdvice" className="block font-medium mb-1">
            Dietary & Lifestyle Advice
          </label>
          <textarea
            id="lifestyleAdvice"
            name="lifestyleAdvice"
            value={form.lifestyleAdvice}
            onChange={handleChange}
            rows={2}
            placeholder="Advice"
            className="w-full border rounded p-2 border-gray-300"
          />
        </div>

         {/* Actual Price & Selling Price  */}
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <label htmlFor="actualPrice" className="block font-medium mb-1">
              Actual Price (MRP) <span className="text-red-600">*</span>
            </label>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">₹</span>
            <input
              type="number"
              id="actualPrice"
              name="actualPrice"
              value={form.actualPrice}
              onChange={handleChange}
              min={0}
              step="0.01"
              placeholder="Actual Price eg: ₹150"
              className={`pl-8 w-full border rounded p-2 ${
                errors.actualPrice ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.actualPrice && <p className="text-red-600 text-sm mt-1">{errors.actualPrice}</p>}
          </div>

          <div className="relative w-1/2">
            <label htmlFor="sellingPrice" className="block font-medium mb-1">
              Selling Price <span className="text-red-600">*</span>
            </label>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">₹</span>
            <input
              type="number"
              id="sellingPrice"
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              min={0}
              step="0.01"
              placeholder="Selling Price eg: ₹130"
              className={`pl-8 w-full border rounded p-2 ${
                errors.sellingPrice ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.sellingPrice && <p className="text-red-600 text-sm mt-1">{errors.sellingPrice}</p>}
          </div>
        </div>

        {/* GST & Total quantity */}

        <div className="flex gap-4">
          {/* GST */}
<div className="relative w-1/2">
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

          
                    <div className="relative w-1/2"> 
                    <label htmlFor="quantity" className="block font-medium mb-1">
            Total Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity eg: 150 "
            min={0}
            className="w-full border rounded p-2 border-gray-300"
          />
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
          <label htmlFor="prescriptionRequired" className="select-none font-medium">
            Prescription Required
          </label>
        </div>

        {/* Submit Button */}
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
