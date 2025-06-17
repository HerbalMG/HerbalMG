import React, { useState } from "react";
import dummyOrders from "../data/dummyOrders";
import toast from "react-hot-toast";

export default function ProfileForm() {
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    contact: "9876543210",
    address: "123 Main St",
    state: "Maharashtra",
    city: "Mumbai",
    pinCode: "400001",
    country: "India",
  });

  const [isEditing, setIsEditing] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) =>
    /^[6-9]\d{9}$/.test(phone); // Indian 10-digit mobile starting 6-9

  const validatePinCode = (pin) =>
    /^\d{6}$/.test(pin); // 6 digit pin

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = (e) => {
    e.preventDefault();

    if (!user.firstName || user.firstName.trim().length < 2) {
      toast.error("First name must be at least 2 characters.");
      return;
    }
    if (!user.lastName || user.lastName.trim().length < 2) {
      toast.error("Last name must be at least 2 characters.");
      return;
    }
    if (!user.email || !validateEmail(user.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!user.contact || !validatePhone(user.contact)) {
      toast.error("Please enter a valid 10-digit Indian contact number.");
      return;
    }
    if (!user.address || user.address.trim().length < 5) {
      toast.error("Address must be at least 5 characters.");
      return;
    }
    if (!user.state || user.state.trim().length < 2) {
      toast.error("State must be at least 2 characters.");
      return;
    }
    if (!user.city || user.city.trim().length < 2) {
      toast.error("City must be at least 2 characters.");
      return;
    }
    if (!user.pinCode || !validatePinCode(user.pinCode)) {
      toast.error("Please enter a valid 6-digit pin code.");
      return;
    }
    if (!user.country || user.country.trim().length < 2) {
      toast.error("Country must be at least 2 characters.");
      return;
    }

    setIsEditing(false);
    toast.success("Profile updated!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-6">User Profile</h2>
      <form onSubmit={handleSave} noValidate>
        <div className="grid grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-gray-700 mb-1 font-medium"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={user.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "border-blue-500 focus:ring-blue-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-gray-700 mb-1 font-medium"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={user.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "border-blue-500 focus:ring-blue-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 mb-1 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "border-blue-500 focus:ring-blue-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label
              htmlFor="contact"
              className="block text-gray-700 mb-1 font-medium"
            >
              Phone Number
            </label>
            <input
              id="contact"
              name="contact"
              type="tel"
              value={user.contact}
              onChange={handleChange}
              readOnly={!isEditing}
              maxLength={10}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "border-blue-500 focus:ring-blue-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Address (full width) */}
          <div className="col-span-2">
            <label
              htmlFor="address"
              className="block text-gray-700 mb-1 font-medium"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              type="text"
              value={user.address}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "border-blue-500 focus:ring-blue-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="block text-gray-700 mb-1 font-medium"
            >
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={user.state}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "border-blue-500 focus:ring-blue-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-gray-700 mb-1 font-medium"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={user.city}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "border-blue-500 focus:ring-blue-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Pin Code */}
          <div>
            <label
              htmlFor="pinCode"
              className="block text-gray-700 mb-1 font-medium"
            >
              Pin Code
            </label>
            <input
              id="pinCode"
              name="pinCode"
              type="text"
              value={user.pinCode}
              onChange={handleChange}
              readOnly={!isEditing}
              maxLength={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "border-blue-500 focus:ring-blue-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-gray-700 mb-1 font-medium"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={user.country}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEditing ? "border-blue-500 focus:ring-blue-300" : "border-gray-300"
              }`}
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )}
          {isEditing && (
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
          )}
        </div>
      </form>

      {/* Order History */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Order History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2 border">{order.name}</td>
                  <td className="px-4 py-2 border">{order.quantity}</td>
                  <td className="px-4 py-2 border">{order.price}</td>
                  <td className="px-4 py-2 border">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
