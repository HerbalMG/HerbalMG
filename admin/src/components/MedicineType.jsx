import React, { useState, useEffect } from 'react';
import TabletForm from './TabletForm';
import MedForm from './MedForm';
import { getProducts, deleteProduct } from '../lib/productApi';

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
      <label className="block font-medium mb-2">Medicine Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border rounded p-2 mb-6"
      >
        <option value="">-- Select Type --</option>
        <option value="tablet">Tablet / Capsule</option>
        <option value="med">Syrup / Powder</option>
      </select>

      {type === 'tablet' && <TabletForm category={category} editProduct={editProduct} setEditProduct={setEditProduct} />}
      {type === 'med' && <MedForm category={category} editProduct={editProduct} setEditProduct={setEditProduct} />}

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
