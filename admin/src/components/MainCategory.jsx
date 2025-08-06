import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getMainCategories,
  createMainCategory,
  deleteMainCategory,
  updateMainCategory,
} from "../lib/mainCategoryApi";

const MainCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getMainCategories()
      .then(setCategoryList)
      .catch(() => {
        toast.error("Failed to fetch categories.");
        setCategoryList([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = categoryName.trim();
    if (!trimmedName) return;

    const isDuplicate = categoryList.some(
      (cat) =>
        cat.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!editCategory || cat.id !== editCategory.id)
    );

    if (isDuplicate) {
      toast.error("This category already exists.");
      return;
    }

    try {
      if (editCategory) {
        const updated = await updateMainCategory(editCategory.id, {
          name: trimmedName,
        });
        setCategoryList(
          categoryList.map((c) => (c.id === editCategory.id ? updated : c))
        );
        toast.success("Category updated successfully!");
        setEditCategory(null);
      } else {
        const created = await createMainCategory({ name: trimmedName });
        setCategoryList([created, ...categoryList]);
        toast.success("Category added successfully!");
      }
      setCategoryName("");
    } catch {
      toast.error("Failed to save category.");
    }
  };

  const handleRemoveCategory = async (id) => {
    try {
      await deleteMainCategory(id);
      setCategoryList(categoryList.filter((cat) => cat.id !== id));
      toast.success("Category removed.");
    } catch {
      toast.error("Failed to remove category.");
    }
  };

  const handleEditCategory = (cat) => {
    setEditCategory(cat);
    setCategoryName(cat.name);
  };

  const handleCancelEdit = () => {
    setEditCategory(null);
    setCategoryName("");
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="md:w-1/2 w-full">
          <label className="block mb-2 text-sm font-medium">
            Main Category Name
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
            placeholder="Enter category name"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            {editCategory ? "Update Category" : "Add Main Category"}
          </button>

          {editCategory && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full mt-2 bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Right: Category List */}
        <div className="md:w-1/2 w-full border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">All Categories</h2>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full p-2 mb-4 border rounded"
          />

          <ul className="space-y-2">
            {categoryList
              .filter((cat) =>
                cat.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center gap-4 bg-white p-3 rounded shadow"
                >
                  <div className="flex-1">
                    <p className="font-medium">{cat.name}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveCategory(cat.id)}
                    className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleEditCategory(cat)}
                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 ml-2"
                  >
                    Edit
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainCategory;
