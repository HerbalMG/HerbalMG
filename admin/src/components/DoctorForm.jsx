import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import imageCompression from "browser-image-compression";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../lib/doctorApi";

const defaultSchedule = {
  morningStart: "",
  morningEnd: "",
  eveningStart: "",
  eveningEnd: "",
};

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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
    rating: "",
    daysAvailable: [],
    schedules: Object.fromEntries(allDays.map((day) => [day, { ...defaultSchedule }])),
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [doctorList, setDoctorList] = useState([]);
  const [editDoctor, setEditDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoctors()
      .then(setDoctorList)
      .catch(() => setDoctorList([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedules: {
        ...prev.schedules,
        [day]: {
          ...prev.schedules[day],
          [field]: value,
        },
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
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
      rating,
      daysAvailable,
      schedules,
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
      !rating
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

    if (
      rating !== "" &&
      (isNaN(rating) || parseFloat(rating) < 0 || parseFloat(rating) > 5)
    ) {
      toast.error("Rating must be a number between 0 and 5.");
      return false;
    }

    if (!daysAvailable.length) {
      toast.error("Select at least one available day.");
      return false;
    }

    for (const day of daysAvailable) {
      const sched = schedules[day];
      if (
        sched.morningStart &&
        sched.morningEnd &&
        sched.morningStart >= sched.morningEnd
      ) {
        toast.error(`${day}: Morning start must be before end.`);
        return false;
      }
      if (
        sched.eveningStart &&
        sched.eveningEnd &&
        sched.eveningStart >= sched.eveningEnd
      ) {
        toast.error(`${day}: Evening start must be before end.`);
        return false;
      }
    }

    return true;
  };

  const uploadImage = async (file) => {
    const toastId = toast.loading("Uploading image...");
    let compressedFile = file;
    try {
      compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
    } catch {
      toast.error("Image compression failed. Uploading original.");
    }

    const formDataImg = new FormData();
    formDataImg.append("image", compressedFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/upload?type=doctor`, {
        method: "POST",
        body: formDataImg,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      toast.success("Image uploaded successfully!", { id: toastId });
      return data.imageUrl;
    } catch (error) {
      toast.error("Image upload failed.", { id: toastId });
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const schedules = formData.daysAvailable.map((day) => ({
        day_of_week: day,
        morning_start_time: formData.schedules[day].morningStart,
        morning_end_time: formData.schedules[day].morningEnd,
        evening_start_time: formData.schedules[day].eveningStart,
        evening_end_time: formData.schedules[day].eveningEnd,
      }));

      const doctorPayload = {
        name: formData.name,
        phone_number: formData.phone,
        degree: formData.degree,
        specialization: formData.specialization,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        rating: parseFloat(formData.rating) || 0,
        image_url: editDoctor ? editDoctor.image_url : "",
        schedules,
      };

      let doctorRes;
      if (editDoctor) {
        doctorRes = await updateDoctor(editDoctor.id, doctorPayload);
      } else {
        doctorRes = await createDoctor(doctorPayload);
      }

      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        const updatedDoctor = { ...doctorRes, image_url: imageUrl };
        doctorRes = await updateDoctor(doctorRes.id, updatedDoctor);
      }

      setDoctorList((prev) => {
        return editDoctor
          ? prev.map((d) => (d.id === doctorRes.id ? doctorRes : d))
          : [doctorRes, ...prev];
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        degree: "",
        specialization: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        rating: "",
        daysAvailable: [],
        schedules: Object.fromEntries(allDays.map((day) => [day, { ...defaultSchedule }])),
      });
      setImagePreview(null);
      setImageFile(null);
      setEditDoctor(null);

      toast.success(editDoctor ? "Doctor updated!" : "Doctor added!");
    } catch (error) {
      toast.error(error.message || "Failed to save doctor.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    const scheduleMap = Object.fromEntries(
      allDays.map((day) => [day, { ...defaultSchedule }])
    );

    doctor.schedules.forEach((s) => {
      scheduleMap[s.day_of_week] = {
        morningStart: s.morning_start_time || "",
        morningEnd: s.morning_end_time || "",
        eveningStart: s.evening_start_time || "",
        eveningEnd: s.evening_end_time || "",
      };
    });

    setEditDoctor(doctor);
    setFormData({
      name: doctor.name,
      phone: doctor.phone_number,
      degree: doctor.degree,
      specialization: doctor.specialization,
      address: doctor.address,
      city: doctor.city,
      state: doctor.state,
      pincode: doctor.pincode,
      rating: doctor.rating?.toString() || "",
      daysAvailable: doctor.schedules.map((s) => s.day_of_week),
      schedules: scheduleMap,
    });
    setImagePreview(doctor.image_url || null);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctorList((prev) => prev.filter((d) => d.id !== id));
      toast.success("Doctor removed.");
    } catch {
      toast.error("Failed to delete doctor.");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Toaster position="top-right" />
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add Doctor here</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
  <label className="block mb-1 font-medium">Phone Number*</label>
  <div className="flex">
    <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100 text-gray-600">
      +91
    </span>
    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      className="w-full border rounded-r px-3 py-2"
      disabled={loading}
      maxLength={10}
      pattern="\d{10}"
    />
  </div>
</div>


          <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block mb-1 font-medium">Degree*</label>
    <input
      type="text"
      name="degree"
      value={formData.degree}
      onChange={handleChange}
      className="w-full border rounded px-3 py-2"
      disabled={loading}
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
      disabled={loading}
    />
  </div>
</div>


          <div>
  <label className="block mb-1 font-medium">Address*</label>
  <textarea
    name="address"
    value={formData.address}
    onChange={handleChange}
    rows={3}
    className="w-full border rounded px-3 py-2"
    disabled={loading}
  />
</div>


          <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block mb-1 font-medium">City*</label>
    <input
      type="text"
      name="city"
      value={formData.city}
      onChange={handleChange}
      className="w-full border rounded px-3 py-2"
      disabled={loading}
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
      disabled={loading}
    />
  </div>
</div>


          <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block mb-1 font-medium">Pincode*</label>
    <input
      type="text"
      name="pincode"
      value={formData.pincode}
      onChange={handleChange}
      className="w-full border rounded px-3 py-2"
      disabled={loading}
    />
  </div>
  <div>
    <label className="block mb-1 font-medium">Rating (0-5)</label>
    <input
      type="number"
      name="rating"
      min="0"
      max="5"
      step="0.1"
      value={formData.rating}
      onChange={handleChange}
      className="w-full border rounded px-3 py-2"
      disabled={loading}
    />
  </div>
</div>


          <div>
            <label className="block mb-1 font-medium">Days Available & Timings*</label>
            {allDays.map((day) => {
              const selected = formData.daysAvailable.includes(day);
              return (
                <div key={day} className="border p-2 rounded mb-2">
                  <label className="flex items-center space-x-2 mb-1">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        setFormData((prev) => {
                          const updated = selected
                            ? prev.daysAvailable.filter((d) => d !== day)
                            : [...prev.daysAvailable, day];
                          return { ...prev, daysAvailable: updated };
                        });
                      }}
                    />
                    <span className="font-semibold">{day}</span>
                  </label>
                  {selected && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={formData.schedules[day].morningStart}
                        onChange={(e) => handleScheduleChange(day, "morningStart", e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Morning Start"
                      />
                      <input
                        type="time"
                        value={formData.schedules[day].morningEnd}
                        onChange={(e) => handleScheduleChange(day, "morningEnd", e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Morning End"
                      />
                      <input
                        type="time"
                        value={formData.schedules[day].eveningStart}
                        onChange={(e) => handleScheduleChange(day, "eveningStart", e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Evening Start"
                      />
                      <input
                        type="time"
                        value={formData.schedules[day].eveningEnd}
                        onChange={(e) => handleScheduleChange(day, "eveningEnd", e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Evening End"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : editDoctor ? "Update Doctor" : "Add Doctor"}
          </button>
        </form>

        <h2 className="text-xl font-bold mt-12 mb-4">Doctors List</h2>
<div className="max-h-96 overflow-y-auto pr-2">
  {doctorList.length === 0 ? (
    <p>No doctors available.</p>
  ) : (
    <ul>
      {doctorList.map((doctor) => (
        <li
          key={doctor.id}
          className="border p-4 mb-4 rounded flex justify-between items-center"
        >
          <div className="flex items-center space-x-4">
            {doctor.image_url && (
              <img
                src={doctor.image_url}
                alt={doctor.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-semibold">{doctor.name}</h3>
              <p>Phone: {doctor.phone_number}</p>
              <p>Specialization: {doctor.specialization}</p>
              <p>Rating: {doctor.rating ?? "N/A"}</p>
            </div>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleEdit(doctor)}
              className="text-blue-600 hover:underline"
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(doctor.id)}
              className="text-red-600 hover:underline"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
</div>
</div>
  );
}

export default DoctorForm;
