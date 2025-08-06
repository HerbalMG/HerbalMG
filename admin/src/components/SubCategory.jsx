import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getSubCategories,
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
} from "../lib/subCategoryApi"; // Make sure this path and API functions exist

const SubCategory = () => {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [editSubCategory, setEditSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getSubCategories()
      .then(setSubCategoryList)
      .catch(() => {
        toast.error("Failed to fetch subcategories.");
        setSubCategoryList([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = subCategoryName.trim();
    if (!trimmedName) return;

    const isDuplicate = subCategoryList.some(
      (sc) =>
        sc.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!editSubCategory || sc.id !== editSubCategory.id)
    );

    if (isDuplicate) {
      toast.error("This subcategory already exists.");
      return;
    }

    try {
      if (editSubCategory) {
        const updated = await updateSubCategory(editSubCategory.id, {
          name: trimmedName,
        });
        setSubCategoryList(
          subCategoryList.map((sc) =>
            sc.id === editSubCategory.id ? updated : sc
          )
        );
        toast.success("Subcategory updated!");
        setEditSubCategory(null);
      } else {
        const created = await createSubCategory({ name: trimmedName });
        setSubCategoryList([created, ...subCategoryList]);
        toast.success("Subcategory added!");
      }
      setSubCategoryName("");
    } catch {
      toast.error("Failed to save subcategory.");
    }
  };

  const handleRemoveSubCategory = async (id) => {
    try {
      await deleteSubCategory(id);
      setSubCategoryList(subCategoryList.filter((sc) => sc.id !== id));
      toast.success("Subcategory removed.");
    } catch {
      toast.error("Failed to remove subcategory.");
    }
  };

  const handleEditSubCategory = (sc) => {
    setEditSubCategory(sc);
    setSubCategoryName(sc.name);
  };

  const handleCancelEdit = () => {
    setEditSubCategory(null);
    setSubCategoryName("");
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="md:w-1/2 w-full">
          <label className="block mb-2 text-sm font-medium">
            Subcategory Name
          </label>
          <input
            type="text"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
            placeholder="Enter subcategory name"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            {editSubCategory ? "Update Subcategory" : "Add Subcategory"}
          </button>

          {editSubCategory && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full mt-2 bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Right: Subcategory List */}
        <div className="md:w-1/2 w-full border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">All Subcategories</h2>

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subcategories..."
            className="w-full p-2 mb-4 border rounded"
          />

          <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {subCategoryList
              .filter((sc) =>
                sc.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((sc) => (
                <li
                  key={sc.id}
                  className="flex items-center gap-4 bg-white p-3 rounded shadow"
                >
                  <div className="flex-1">
                    <p className="font-medium">{sc.name}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveSubCategory(sc.id)}
                    className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleEditSubCategory(sc)}
                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-600 ml-2"
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

export default SubCategory;
