import React from "react";
import {
  FaPhoneAlt,
  FaClock,
  FaUserMd,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";

function formatTimeWithSeconds(timeStr) {
  if (!timeStr) return "-";
  const date = new Date(`1970-01-01T${timeStr}`);
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return timeStr;
}

function RatingStars({ rating }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={i} className="text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
  }

  while (stars.length < 5) {
    stars.push(<FaRegStar key={`empty-${stars.length}`} className="text-yellow-400" />);
  }

  return <div className="flex items-center gap-1">{stars}</div>;
}

export default function DoctorCard({ doctor, onSelect }) {
  const fullAddress = `${doctor.address || ""}${
    doctor.city ? `, ${doctor.city.trim()}` : ""
  }${doctor.state ? `, ${doctor.state.trim()}` : ""}${
    doctor.pincode ? `, ${doctor.pincode}` : ""
  }`;

  // Parse schedules as array if needed
  let schedules = doctor.schedules;
  if (typeof schedules === "string") {
    try {
      schedules = JSON.parse(schedules);
    } catch {
      schedules = [];
    }
  }

  const days = Array.isArray(schedules)
    ? schedules.map(s => s.day_of_week).join(", ")
    : "";

  return (
    <div
      onClick={() => onSelect(doctor)}
      className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-5 flex flex-col gap-4 border-t"
    >
      {/* Image + Name + Degree */}
      <div className="flex items-center gap-4">
        <img
          src={doctor.image_url}
          alt={doctor.name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-gray-200 rounded"
        />

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-800">{doctor.name}</h2>

          {doctor.specialization && (
        <div className="items-center text-sm text-indigo-600 mt-1 gap-1 px-2 py-0.5 bg-blue-100 rounded-full inline-block">
          {doctor.specialization}
        </div>
      )}
          
          <div className="mt-2">
            <RatingStars rating={doctor.rating || 0} />
          </div>
        </div>
      </div>

      {/* Specialization */}
      

      {doctor.degree && (
            <span className="text-sm  text-blue-700 px-2 py-0.5  mt-1 inline-block">
                        {/* <FaUserMd className="text-indigo-500" /> */}
              {doctor.degree}
            </span>
          )}

      {/* Address */}
      <div className="flex items-start text-sm text-gray-600 gap-2">
        <HiLocationMarker className="text-blue-500 mt-0.5" />
        <span className="line-clamp-2" title={fullAddress}>
          {fullAddress}
        </span>
      </div>

      {/* Days Available */}
      {days && (
        <div className="text-sm text-gray-700">
          <strong>Days:</strong> {days}
        </div>
      )}

      {/* Timings & Phone */}
      <div className="flex flex-col text-sm text-gray-700 gap-2">
        {/* Timings */}
        <div className="flex items-start gap-2">
          <FaClock className="text-purple-500 mt-0.5" />
          <div className="w-full">
            {Array.isArray(schedules) && schedules.length > 0 ? (
              <div className="flex flex-col gap-2 overflow-y-auto max-h-40 pr-1">
                {schedules.map((sch, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-2 border border-gray-200">
                    <div>
                      <span className="font-medium text-gray-800 mr-2">{sch.day_of_week}:</span>
                      {sch.morning_start_time && sch.morning_end_time && (
                        <span>
                          {formatTimeWithSeconds(sch.morning_start_time)} - {formatTimeWithSeconds(sch.morning_end_time)}
                        </span>
                      )}
                    </div>
                    {sch.evening_start_time && sch.evening_end_time && (
                      <div className="pl-16">
                        <span>
                          {formatTimeWithSeconds(sch.evening_start_time)} - {formatTimeWithSeconds(sch.evening_end_time)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="italic text-gray-400">No schedule available</span>
            )}
          </div>
        </div>

        {/* Phone & Call Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-green-500" />
            +91-{doctor.phone_number}
          </div>

          <a
            href={`tel:${doctor.phone_number}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
          >
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
