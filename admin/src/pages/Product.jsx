import React, { useState } from 'react';
import MedicineType from '../components/MedicineType';
import BrandForm from '@/components/BrandForm';
import BannerManager from '@/components/BannerManager';
import RefrenceBook from '@/components/RefrenceBook';
import DoctorForm from '@/components/DoctorForm';

const TABS = {
  PRODUCT: 'Product',
  BRAND: 'Brand',
  BOOKS: 'Books',
  BANNER: 'Banner',
  DOCTOR: 'Doctors'
};

const Product = () => {
  const [activeTab, setActiveTab] = useState(TABS.PRODUCT);
  const [category, setCategory] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case TABS.PRODUCT:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Product</h2>
            <div className="mb-6">
              <label className="block font-medium mb-2">Select Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">-- Select Category --</option>
                <option value="Ayurvedic">Ayurvedic Medicine</option>
                <option value="Homeopathic">Homeopathic Medicine</option>
                <option value="Unani">Unani Medicine</option>
              </select>
            </div>
            {(category === 'Ayurvedic' || category === 'Homeopathic' || category === 'Unani') && (
              <MedicineType category={category} />
            )}
          </div>
        );
      case TABS.BRAND:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Brand</h2>
            <BrandForm />
          </div>
        );
      case TABS.BOOKS:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Reference Books</h2>
            <RefrenceBook />
          </div>
        );
      case TABS.BANNER:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Banner</h2>
            <BannerManager />
          </div>
        );
        case TABS.DOCTOR:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Doctors</h2>
            <DoctorForm />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow rounded-lg">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {Object.values(TABS).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default Product;
