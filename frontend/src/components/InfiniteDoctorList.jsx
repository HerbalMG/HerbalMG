import React, { useEffect, useState, useRef } from 'react';
import DoctorCard from './DoctorCard';

export default function InfiniteDoctorList({ doctors, onSelect }) {
  const [items, setItems] = useState(doctors.slice(0, 6));
  const loader = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && items.length < doctors.length) {
        setTimeout(() => {
          setItems(doctors.slice(0, items.length + 6));
        }, 500);
      }
    }, { rootMargin: "100px" });

    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [items, doctors]);

  if (doctors.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <div className="text-center">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Doctors Available</h3>
          <p className="text-gray-500 text-sm max-w-md">
            We're working on connecting with qualified healthcare professionals. Check back soon for expert consultations!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} onSelect={onSelect} />
        ))}
      </div>
      <div ref={loader} className="text-center py-4 text-l text-orange-500">
        {items.length < doctors.length ? "Loading more doctors..." : "You've reached the end!"}
      </div>
    </>
  );
}
