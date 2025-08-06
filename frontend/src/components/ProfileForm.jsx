import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:3001/api";

export default function ProfileForm() {
  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem('user')) || {};
  const userId = userInfo.id || 1;
  const isNewUser = userInfo.isNewUser || false;

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Basic profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    gender: ''
  });
  const [profileCompleted, setProfileCompleted] = useState(!isNewUser);

  // Fetch user profile and addresses on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile if new user
        if (isNewUser) {
          const profileResponse = await fetch(`${API_BASE}/auth/profile/${userId}`, {
            credentials: 'include',
          });
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setProfile({
              name: profileData.name || '',
              email: profileData.email || '',
              mobile: profileData.mobile || '',
              dob: profileData.dob || '',
              gender: profileData.gender || ''
            });
            setProfileCompleted(profileData.profile_completed || false);
          }
        }

        // Fetch addresses
        const addressResponse = await fetch(`${API_BASE}/customer/${userId}/addresses`, {
          credentials: 'include',
        });
        if (addressResponse.ok) {
          const addressData = await addressResponse.json();
          setAddresses(addressData.map(addr => ({ ...addr, isEditing: false, open: false })));
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, isNewUser]);

  // Profile completion functions
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const completeProfile = async () => {
    if (!profile.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (profile.email && !validateEmail(profile.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/complete-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          name: profile.name,
          email: profile.email,
          dob: profile.dob,
          gender: profile.gender
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to complete profile');

      setProfileCompleted(true);
      // Update localStorage to reflect profile completion
      localStorage.setItem('user', JSON.stringify({ ...userInfo, isNewUser: false }));
      toast.success('Profile completed successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const validatePinCode = (pin) => /^\d{6}$/.test(pin);

  const updateAddressState = (index, updates) => {
    setAddresses(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const handleFieldChange = (index, e) => {
    const { name, value } = e.target;
    updateAddressState(index, { [name]: value });
  };

  const toggleOpen = (index) => {
    updateAddressState(index, { open: !addresses[index].open });
  };

  const toggleEdit = (index) => {
    updateAddressState(index, { isEditing: true, open: true });
  };

  const saveAddress = async (index) => {
    const addr = addresses[index];
    // Validation (same as before)
    if (!addr.fullName?.trim() || addr.fullName.trim().length < 3) {
      toast.error("Name must be at least 3 characters.");
      return false;
    }
    if (!validateEmail(addr.email)) { toast.error("Invalid email."); return false; }
    if (!validatePhone(addr.contact)) { toast.error("Invalid mobile number."); return false; }
    if (!addr.house_number?.trim() || addr.house_number.trim().length < 5) {
      toast.error("House number too short."); return false;
    }
    if (!addr.area?.trim() || addr.area.trim().length < 2) {
      toast.error("Area too short."); return false;
    }
    if (!addr.landmark?.trim() || addr.landmark.trim().length < 2) {
      toast.error("Landmark too short."); return false;
    }
    if (!addr.state?.trim() || addr.state.trim().length < 2) {
      toast.error("State too short."); return false;
    }
    if (!addr.city?.trim() || addr.city.trim().length < 2) {
      toast.error("City too short."); return false;
    }
    if (!validatePinCode(addr.pinCode)) { toast.error("Invalid pin code."); return false; }
    if (!addr.country?.trim() || addr.country.trim().length < 2) {
      toast.error("Country too short."); return false;
    }

    // Prepare payload for backend
    const payload = {
      address_line1: `${addr.house_number}, ${addr.area}, ${addr.landmark}`,
      address_line2: '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pinCode,
      country: addr.country,
      is_default: addr.is_default || false,
    };

    try {
      let response, data;
      if (addr.id) {
        // Update
        response = await fetch(`${API_BASE}/customer/${userId}/addresses/${addr.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Update failed');
        updateAddressState(index, { ...data, isEditing: false });
        toast.success("Address updated!");
      } else {
        // Create
        response = await fetch(`${API_BASE}/customer/${userId}/addresses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Add failed');
        setAddresses(prev => prev.map((a, i) => i === index ? { ...data, isEditing: false, open: true } : a));
        toast.success("Address added!");
      }
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleRemove = async (index) => {
    const addr = addresses[index];
    if (!addr.id) {
      setAddresses(prev => prev.filter((_, i) => i !== index));
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/customer/${userId}/addresses/${addr.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Delete failed');
      setAddresses(prev => prev.filter((_, i) => i !== index));
      toast.success("Address removed");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAdd = () => {
    setAddresses(prev => [
      ...prev,
      {
        fullName: '',
        email: '',
        contact: '',
        house_number: '',
        area: '',
        landmark: '',
        state: '',
        city: '',
        pinCode: '',
        country: '',
        isEditing: true,
        open: true,
      },
    ]);
  };

  const setDefault = async (index) => {
    const addr = addresses[index];
    if (!addr.id) return toast.error('Save address first!');
    try {
      const response = await fetch(`${API_BASE}/customer/${userId}/addresses/${addr.id}/set-default`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to set default');
      setAddresses(prev => prev.map((a, i) => ({ ...a, is_default: i === index })));
      toast.success('Default address set!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const inputFields = [
    { label: "Name", name: "fullName", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Mobile", name: "contact", type: "tel", maxLength: 10 },
    { label: "House No.", name: "house_number", type: "text" },
    { label: "Area", name: "area", type: "text" },
    { label: "Landmark", name: "landmark", type: "text" },
    { label: "State", name: "state", type: "text" },
    { label: "City", name: "city", type: "text" },
    { label: "Pin Code", name: "pinCode", type: "text", maxLength: 6 },
    { label: "Country", name: "country", type: "text" },
  ];

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen sm:p-6 ">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

        {/* Profile Completion Section for New Users */}
        {!profileCompleted && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Complete Your Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Email (Optional)
                </label>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Date of Birth (Optional)
                </label>
                <input
                  name="dob"
                  type="date"
                  value={profile.dob}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Gender (Optional)
                </label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <button
              onClick={completeProfile}
              disabled={profileLoading || !profile.name.trim()}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                profileLoading || !profile.name.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {profileLoading ? 'Completing...' : 'Complete Profile'}
            </button>
          </div>
        )}

        {/* Address Management Section */}
        <div className={!profileCompleted ? 'opacity-50 pointer-events-none' : ''}>
          <h3 className="text-lg font-semibold mb-4">Manage Addresses</h3>

        {addresses.map((addr, idx) => (
          <div
            key={addr.id || idx}
            className={`mb-4 border rounded-md overflow-hidden ${addr.is_default ? 'border-blue-500' : ''}`}
          >
            {/* Accordion Header */}
            <div
              className="flex justify-between items-center bg-gray-100 p-3 cursor-pointer"
              onClick={() => toggleOpen(idx)}
            >
              <h3 className="font-medium">
                Address {idx + 1}: {addr.fullName || "(no name)"} {addr.is_default && <span className="text-blue-600 text-xs ml-2">[Default]</span>}
              </h3>
              <span>{addr.open ? "▲" : "▼"}</span>
            </div>

            {/* Panel */}
            {addr.open && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inputFields.map(({ label, name, type, maxLength }) => (
                    <div key={name}>
                      <label className="block mb-1 font-medium text-gray-700">
                        {label}
                      </label>
                      <input
                        name={name}
                        type={type}
                        maxLength={maxLength}
                        value={addr[name] || ''}
                        onChange={(e) => handleFieldChange(idx, e)}
                        readOnly={!addr.isEditing}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          addr.isEditing
                            ? "border-blue-500 focus:ring-blue-300"
                            : "border-gray-300 bg-gray-100"
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 justify-end">
                  {addr.isEditing ? (
                    <button
                      type="button"
                      onClick={() => saveAddress(idx)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleEdit(idx)}
                      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                    >
                      Edit
                    </button>
                  )}
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                  {!addr.is_default && !addr.isEditing && addr.id && (
                    <button
                      type="button"
                      onClick={() => setDefault(idx)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={!profileCompleted}
            >
              + Add Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

