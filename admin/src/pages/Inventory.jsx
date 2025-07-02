import React, { useState, useEffect } from "react";
import { getProducts, deleteProduct, updateProduct } from '../lib/productApi';
import { getBrands } from '../lib/brandApi';

const initialData = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    quantity: 120,
    status: "In Stock",
    category: "Pain Relief",
    brand: "Kapiva",
    expiry: "2026-05-01",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    quantity: 0,
    status: "Out of Stock",
    category: "Antibiotics",
    brand: "Patanjali",
    expiry: "2025-01-01",
  },
  {
    id: 3,
    name: "Ibuprofen 400mg",
    quantity: 40,
    status: "Low Stock",
    category: "Pain Relief",
    brand: "Kapiva",
    expiry: "2025-08-10",
  },
  {
    id: 4,
    name: "Cetirizine",
    quantity: 200,
    status: "In Stock",
    category: "Allergy",
    brand: "Kapiva",
    expiry: "2026-03-01",
  },
  {
    id: 5,
    name: "Cough Syrup",
    quantity: 10,
    status: "Low Stock",
    category: "Cold",
    brand: "Patanjali",
    expiry: "2025-07-01",
  },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-700";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-700";
    case "Out of Stock":
      return "bg-red-100 text-red-700";
    default:
      return "";
  }
};

const getStatusFromQuantity = (total_quantity) => {
  if (total_quantity === 0) return "Out of Stock";
  if (total_quantity < 50) return "Low Stock";
  return "In Stock";
};

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [editingItem, setEditingItem] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    getProducts()
      .then((products) => {
        const productsWithStatus = products.map((p) => ({
          ...p,
          status: getStatusFromQuantity(p.total_quantity),
        }));
        setInventory(productsWithStatus);
      })
      .catch(() => setInventory([]));
    getBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setInventory(inventory.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedItem = {
      ...editingItem,
      status: getStatusFromQuantity(editingItem.total_quantity),
    };
    try {
      await updateProduct(updatedItem.id, updatedItem);
      setInventory((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      setEditingItem(null);
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = brandFilter === "All" || item.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;
    const valueA = a[key];
    const valueB = b[key];
    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedInventory.length / itemsPerPage);
  const displayedItems = sortedInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Medical Inventory</h1>

      {/* Filters and Pagination Settings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by product name..."
          className="px-4 py-2 border rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="flex items-center gap-2">
          <label className="text-sm">Brand:</label>
          <select
            className="border rounded px-2 py-1"
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Items per page:</label>
          <select
            className="border rounded px-2 py-1"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[10, 20, 50].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left border-b">Sr. No</th>
              <th
                className="py-3 px-4 text-left border-b cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Product Name
              </th>
              <th
                className="py-3 px-4 text-left border-b cursor-pointer"
                onClick={() => handleSort("total_quantity")}
              >
                Quantity
              </th>
              <th
                className="py-3 px-4 text-left border-b cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Availability
              </th>
              <th className="py-3 px-4 text-left border-b">Category</th>
              <th className="py-3 px-4 text-left border-b">Brand</th>
              <th className="py-3 px-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="py-3 px-4 border-b">{item.name}</td>
                <td className="py-3 px-4 border-b">{item.total_quantity}</td>
                <td className="py-3 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">{item.category}</td>
                <td className="py-3 px-4 border-b">{item.brand}</td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => setEditingItem({ ...item })}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {displayedItems.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                className="w-full border px-3 py-2 rounded"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
              />
              <input
                className="w-full border px-3 py-2 rounded"
                type="number"
                value={editingItem.total_quantity}
                onChange={(e) => {
                  const total_quantity = Number(e.target.value);
                  setEditingItem({
                    ...editingItem,
                    total_quantity,
                    status: getStatusFromQuantity(total_quantity),
                  });
                }}
              />
              <p className="text-sm text-gray-600">
                Availability:{" "}
                <strong>{getStatusFromQuantity(editingItem.total_quantity)}</strong>
              </p>
              <input
                className="w-full border px-3 py-2 rounded"
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
              />
              <input
                className="w-full border px-3 py-2 rounded"
                value={editingItem.brand}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, brand: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
