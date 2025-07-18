import { useState, useEffect } from 'react';
import InfiniteDoctorList from '../components/InfiniteDoctorList';

export default function DoctorPage({ city }) {
  const selectedCity = city || "Jaipur";
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:3001/api/doctor')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch doctors');
        return res.json();
      })
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = doctors
    .filter(doc => doc.city && doc.city.trim().toLowerCase() === selectedCity.trim().toLowerCase())
    // .filter(doc => doc.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        Find Doctor's in {selectedCity}
      </h1>
      {loading && <div className="text-center text-gray-500">Loading doctors...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && (
        <InfiniteDoctorList doctors={filtered} onSelect={setSelectedDoc} />
      )}
    </div>
  );
}
