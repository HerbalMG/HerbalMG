import React from 'react'

import affordable from '../assets/affordable.svg';
import relaible from '../assets/reliable.svg';
import secure from '../assets/secure.svg';


const Style = () => {
  return (
    <>
          <div className="border-b my-4"></div>

    <div className="w-full bg-white ">
      {/* Top Heading */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-semibold uppercase">India’s Largest Ayurvedic Healthcare Platform</h2>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-10 text-center py-4">
        <div>
          <div className="text-3xl font-bold text-blue-700">260m+</div>
          <div className="text-gray-600">Visitors</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-700">31m+</div>
          <div className="text-gray-600">Orders Delivered</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-700">1800+</div>
          <div className="text-gray-600">Cities</div>
        </div>
      </div>

      {/* Border line */}
      {/* <div className="border-b my-4"></div> */}

      {/* App Download Section */}
      {/* <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6 px-4">
        <div className="text-lg font-medium">Get the link to download App</div>
        <div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <label htmlFor="phoneNumber" className="sr-only">Enter Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter Phone Number"
              maxLength="10"
              pattern="[6-9]\d{9}"
              title="Enter Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded px-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send Link
            </button>
          </form>
        </div>
      </div> */}
    </div> 
    </>
  )
}

export default Style


export function StyleHome() {
  return (
    <div className="w-full bg-white ">
      {/* <div className="text-center py-6">
        <h2 className="text-2xl font-semibold uppercase">India’s Largest Ayurvedic Healthcare Platform</h2>
      </div> */}

      {/* Stats Bar */}
      <div className="flex justify-center gap-50 text-center py-8">
        <div>
          <img src={relaible} alt="" className='h-20 w-20'/>
          <div className="text-3xl font-bold text-green-600">Reliable</div>
        </div>
        <div>
          <img src={secure} alt="" className='h-20 w-20'/>
          <div className="text-3xl font-bold text-green-600">Secure </div>
        </div>
        <div>
          <img src={affordable} alt="" className='h-20 w-20'/>
          <div className="text-3xl font-bold text-green-600">Affordable</div>
        </div>
      </div>
    </div> 
  )
}
