import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import imageCompression from 'browser-image-compression';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../lib/doctorApi';

function DoctorForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    degree: "",
    specialization: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    startTime: "",
    endTime: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [doctorList, setDoctorList] = useState([]);
  const [editDoctor, setEditDoctor] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useEffect(() => {
    getDoctors().then(setDoctorList).catch(() => setDoctorList([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    const toastId = toast.loading("Uploading image...");
    let compressedFile = file;
    try {
      compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
    } catch (err) {
      toast.error('Image compression failed. Uploading original.');
    }
    const formDataImg = new FormData();
    formDataImg.append("image", compressedFile);
    try {
      const res = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formDataImg,
      });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      setUploadedImageUrl(data.imageUrl);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Image upload failed.", { id: toastId });
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const {
      name,
      phone,
      degree,
      specialization,
      address,
      city,
      state,
      pincode,
      startTime,
      endTime,
    } = formData;
    if (
      !name ||
      !phone ||
      !degree ||
      !specialization ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !startTime ||
      !endTime
    ) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits.");
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be 6 digits.");
      return false;
    }
    if (startTime >= endTime) {
      toast.error("Start time must be earlier than end time.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const doctorPayload = {
      image_url: uploadedImageUrl,
      name: formData.name,
      phone_number: formData.phone,
      degree: formData.degree,
      specialization: formData.specialization,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      start_time: formData.startTime,
      end_time: formData.endTime,
    };
    try {
      if (editDoctor) {
        const updated = await updateDoctor(editDoctor.id, doctorPayload);
        setDoctorList(doctorList.map((d) => (d.id === editDoctor.id ? updated : d)));
        setEditDoctor(null);
        toast.success("Doctor updated successfully!");
      } else {
        const created = await createDoctor(doctorPayload);
        setDoctorList([created, ...doctorList]);
        toast.success("Form submitted successfully!");
      }
      setFormData({
        name: "",
        phone: "",
        degree: "",
        specialization: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        startTime: "",
        endTime: "",
      });
      setImagePreview(null);
      setUploadedImageUrl(null);
    } catch {
      toast.error("Failed to save doctor.");
    }
  };

  const handleEdit = (doc) => {
    setEditDoctor(doc);
    setFormData({
      name: doc.name,
      phone: doc.phone_number,
      degree: doc.degree,
      specialization: doc.specialization,
      address: doc.address,
      city: doc.city,
      state: doc.state,
      pincode: doc.pincode,
      startTime: doc.start_time,
      endTime: doc.end_time,
    });
    setUploadedImageUrl(doc.image_url || null);
    setImagePreview(doc.image_url || null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctorList(doctorList.filter((d) => d.id !== id));
      toast.success("Doctor removed.");
    } catch {
      toast.error("Failed to remove doctor.");
    }
  };

  return (
    <>
    <div className="min-h-screen p-8 ">
      <Toaster position="top-right" />
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Doctor Form</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number*</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Degree*</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Specialization*</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Address Fields */}
          <div>
            <label className="block mb-1 font-medium">Address*</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium">City*</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">State*</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Pincode*</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Timing Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Start Time*</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">End Time*</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Doctor List Preview */}
      {doctorList.length > 0 && (
        <div className="max-w-xl mx-auto mt-10">
          <h3 className="text-lg font-semibold mb-4">All Doctors</h3>
          <ul className="space-y-4">
            {doctorList.map((doc) => (
              <li key={doc.id} className="flex items-center bg-white p-4 rounded shadow space-x-4">
                {doc.image_url && (
                  <img
                    src={doc.image_url}
                    alt={doc.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-bold">{doc.name}</h4>
                  <p className="text-gray-600">{doc.degree} - {doc.specialization}</p>
                  <p className="text-gray-500">{doc.address}, {doc.city}, {doc.state} - {doc.pincode}</p>
                  <p className="text-gray-500">📞 {doc.phone_number}</p>
                  <p className="text-gray-500">⏰ {doc.start_time} - {doc.end_time}</p>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleEdit(doc)}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-2"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    
    </>
  );
}

export default DoctorForm;
