import React, { useState } from 'react';
import BrandForm from '../components/BrandForm';
import BrandList from '../components/BrandList';
import toast, { Toaster } from 'react-hot-toast';

const BrandManagement = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'add', 'edit'
  const [editBrand, setEditBrand] = useState(null);
  const [refreshList, setRefreshList] = useState(0);

  const handleEdit = (brand) => {
    setEditBrand(brand);
    setActiveTab('edit');
  };

  const handleFormSuccess = () => {
    setEditBrand(null);
    setActiveTab('list');
    setRefreshList(prev => prev + 1); // Trigger list refresh
  };

  const handleCancelEdit = () => {
    setEditBrand(null);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your brand catalog with slug support and SEO-friendly URLs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Brand List
            </button>
            <button
              onClick={() => {
                setActiveTab('add');
                setEditBrand(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'add'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add Brand
            </button>
            {activeTab === 'edit' && (
              <button
                onClick={() => setActiveTab('edit')}
                className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
              >
                Edit Brand
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'list' && (
          <BrandList
            key={refreshList} // Force re-render when refreshList changes
            onEdit={handleEdit}
            refreshTrigger={refreshList}
          />
        )}

        {(activeTab === 'add' || activeTab === 'edit') && (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'add' ? 'Add New Brand' : 'Edit Brand'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'add'
                  ? 'Fill in the details below to add a new brand to your catalog.'
                  : 'Update the brand information below. The slug will be automatically generated from the name.'}
              </p>
            </div>
            
            <BrandForm
              editBrand={editBrand}
              setEditBrand={setEditBrand}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandManagement;