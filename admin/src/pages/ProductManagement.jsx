import React, { useState } from 'react';
import MedicineForm from '../components/MedicineForm';
import ProductList from '../components/ProductList';
import ProductView from '../components/ProductView';
import toast, { Toaster } from 'react-hot-toast';

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'add', 'edit'
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [refreshList, setRefreshList] = useState(0);

  const handleEdit = (product) => {
    setEditProduct(product);
    setActiveTab('edit');
  };

  const handleView = (product) => {
    setViewProduct(product);
  };

  const handleCloseView = () => {
    setViewProduct(null);
  };

  const handleFormSuccess = () => {
    setEditProduct(null);
    setActiveTab('list');
    setRefreshList(prev => prev + 1); // Trigger list refresh
    toast.success('Product saved successfully!');
  };

  const handleDelete = () => {
    setRefreshList(prev => prev + 1); // Trigger list refresh
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
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
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product catalog with advanced filtering and slug support
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
              Product List
            </button>
            <button
              onClick={() => {
                setActiveTab('add');
                setEditProduct(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'add'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add Product
            </button>
            {activeTab === 'edit' && (
              <button
                onClick={() => setActiveTab('edit')}
                className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
              >
                Edit Product
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'list' && (
          <ProductList
            key={refreshList} // Force re-render when refreshList changes
            onEdit={handleEdit}
            onView={handleView}
          />
        )}

        {(activeTab === 'add' || activeTab === 'edit') && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'add' ? 'Add New Product' : 'Edit Product'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'add'
                  ? 'Fill in the details below to add a new product to your catalog.'
                  : 'Update the product information below.'}
              </p>
            </div>
            
            <MedicineForm
              editProduct={editProduct}
              setEditProduct={setEditProduct}
              category="Ayurvedic" // You can make this dynamic
              onDelete={handleDelete}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelEdit}
            />
          </div>
        )}
      </div>

      {/* Product View Modal */}
      {viewProduct && (
        <ProductView
          productId={viewProduct.id}
          productSlug={viewProduct.slug}
          onClose={handleCloseView}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default ProductManagement;