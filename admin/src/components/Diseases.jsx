import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getDiseases,
  createDisease,
  updateDisease,
  deleteDisease,
} from "../lib/diseaseApi";

const Diseases = () => {
  const [diseaseName, setDiseaseName] = useState("");
  const [diseaseList, setDiseaseList] = useState([]);
  const [editDisease, setEditDisease] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDiseases()
      .then(setDiseaseList)
      .catch(() => {
        toast.error("Failed to fetch diseases.");
        setDiseaseList([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = diseaseName.trim();
    if (!trimmedName) return;

    const isDuplicate = diseaseList.some(
      (disease) =>
        disease.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!editDisease || disease.id !== editDisease.id)
    );

    if (isDuplicate) {
      toast.error("This disease is already present. Duplicate not allowed.");
      return;
    }

    try {
      if (editDisease) {
        const updated = await updateDisease(editDisease.id, { name: trimmedName });
        setDiseaseList(
          diseaseList.map((d) => (d.id === editDisease.id ? updated : d))
        );
        toast.success("Disease updated successfully!");
        setEditDisease(null);
      } else {
        const created = await createDisease({ name: trimmedName });
        setDiseaseList([created, ...diseaseList]);
        toast.success("Disease added successfully!");
      }
      setDiseaseName("");
    } catch {
      toast.error("Failed to save disease.");
    }
  };

  const handleRemoveDisease = async (id) => {
    try {
      await deleteDisease(id);
      setDiseaseList(diseaseList.filter((disease) => disease.id !== id));
      toast.success("Disease removed.");
    } catch {
      toast.error("Failed to remove disease.");
    }
  };

  const handleEditDisease = (disease) => {
    setEditDisease(disease);
    setDiseaseName(disease.name);
  };

  const handleCancelEdit = () => {
    setEditDisease(null);
    setDiseaseName("");
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="md:w-1/2 w-full">
          <label className="block mb-2 text-sm font-medium">
            Disease Name
          </label>
          <input
            type="text"
            value={diseaseName}
            onChange={(e) => setDiseaseName(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
            placeholder="Enter disease name"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            {editDisease ? "Update Disease" : "Add Disease"}
          </button>

          {editDisease && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full mt-2 bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Right: Disease List */}
        <div className="md:w-1/2 w-full border rounded p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">All Diseases</h2>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search diseases..."
            className="w-full mb-4 p-2 border rounded"
          />
          {diseaseList.length === 0 ? (
            <p className="text-gray-500">No diseases added yet.</p>
          ) : (
            <div className="max-h-[240px] overflow-y-auto pr-2">
              <ul className="space-y-4">
                {diseaseList
                  .filter(disease =>
                    disease.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((disease) => (
                    <li
                      key={disease.id}
                      className="flex items-center gap-4 bg-white p-3 rounded shadow"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{disease.name}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveDisease(disease.id)}
                        className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleEditDisease(disease)}
                        className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 ml-2"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diseases;
