import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../lib/productApi';
import MedicineForm from './MedicineForm';

const MedicineType = ({ category }) => {
  const [type, setType] = useState('');
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (category) {
      getProducts().then(setProducts).catch(() => setProducts([]));
    }
  }, [category]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    setEditProduct(product);
    console.log('Setting type to:', product.medicine_type?.toLowerCase() || '');
    setType(product.medicine_type?.toLowerCase() || '');
  };

  return (
    <div>
      <label className="block font-medium mb-2">Select your type of Medicine here.</label>
        <MedicineForm category={category} editProduct={editProduct} setEditProduct={setEditProduct}/>

      {/* Product List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">All Products</h3>
        <ul className="divide-y divide-gray-200">
          {products.length === 0 && <li className="text-gray-500">No products found.</li>}
          {products.map((p) => (
            <li key={p.id} className="py-2 flex items-center justify-between">
              <span>
                <span className="font-medium">{p.name}</span> — <span className="text-gray-600">{p.category}</span>
              </span>
              <span>
                <button className="text-blue-600 hover:underline mr-4" onClick={() => handleEdit(p)}>Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(p.id)}>Delete</button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MedicineType;
