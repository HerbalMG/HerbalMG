// import React, { useState, useEffect } from 'react'
// import ProductCard from '../components/ProductCard'
// import ProductFilters from '../components/ProductFilters'
// import Breadcrumb from '../components/Breadcrumb'

// function Homeopathic() {
//   const [products, setProducts] = useState([])
//   const [filteredProducts, setFilteredProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Filter states
//   const [selectedBrand, setSelectedBrand] = useState('')
//   const [selectedDisease, setSelectedDisease] = useState('')
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' })
//   const [sortBy, setSortBy] = useState('name')
//   const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false)
//   const [showMobileFilters, setShowMobileFilters] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')

//   // Available filter options
//   const [brands, setBrands] = useState([])
//   const [diseases, setDiseases] = useState([])

//   useEffect(() => {
//     fetchProducts()
//     fetchFilterOptions()
//   }, [])

//   useEffect(() => {
//     applyFilters()
//   }, [products, selectedBrand, selectedDisease, priceRange, sortBy, showOnlyDiscounted, searchQuery])

//   const fetchProducts = async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await fetch('http://localhost:3001/api/product?category=Homeopathic')
//       if (!response.ok) throw new Error('Failed to fetch products')
      
//       const data = await response.json()
//       setProducts(Array.isArray(data) ? data : [])
//     } catch (err) {
//       setError(err.message)
//       setProducts([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchFilterOptions = async () => {
//     try {
//       // Fetch brands
//       const brandsResponse = await fetch('http://localhost:3001/api/brand')
//       if (brandsResponse.ok) {
//         const brandsData = await brandsResponse.json()
//         setBrands(Array.isArray(brandsData) ? brandsData : [])
//       }

//       // Try to fetch diseases from API, fallback to predefined list
//       try {
//         const diseasesResponse = await fetch('http://localhost:3001/api/disease')
//         if (diseasesResponse.ok) {
//           const diseasesData = await diseasesResponse.json()
//           if (Array.isArray(diseasesData) && diseasesData.length > 0) {
//             setDiseases(diseasesData)
//           } else {
//             setDiseases(getPredefinedDiseases())
//           }
//         } else {
//           setDiseases(getPredefinedDiseases())
//         }
//       } catch (diseaseErr) {
//         console.log('Disease API not available, using predefined list')
//         setDiseases(getPredefinedDiseases())
//       }
//     } catch (err) {
//       console.error('Error fetching filter options:', err)
//       setBrands([])
//       setDiseases(getPredefinedDiseases())
//     }
//   }

//   const getPredefinedDiseases = () => [
//     'Diabetes', 'Hypertension', 'Arthritis', 'Asthma', 'Migraine',
//     'Digestive Issues', 'Skin Problems', 'Respiratory Issues',
//     'Heart Disease', 'Kidney Problems', 'Liver Issues', 'Anxiety',
//     'Depression', 'Insomnia', 'Joint Pain', 'Back Pain', 'Cold & Flu',
//     'Fever', 'Headache', 'Stomach Problems', 'Constipation', 'Acidity'
//   ]

//   const applyFilters = () => {
//     let filtered = [...products]

//     // Search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(product => {
//         return (
//           product.name?.toLowerCase().includes(query) ||
//           product.description?.toLowerCase().includes(query) ||
//           product.brand?.toLowerCase().includes(query) ||
//           (product.brand && typeof product.brand === 'object' && product.brand.name?.toLowerCase().includes(query)) ||
//           product.category?.toLowerCase().includes(query) ||
//           (product.tags && Array.isArray(product.tags) && 
//            product.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(query)))
//         )
//       })
//     }

//     // Brand filter
//     if (selectedBrand) {
//       filtered = filtered.filter(product => {
//         if (product.brand_id?.toString() === selectedBrand) return true
//         if (product.brand && typeof product.brand === 'string') {
//           return product.brand.toLowerCase().includes(selectedBrand.toLowerCase())
//         }
//         if (product.brand && typeof product.brand === 'object' && product.brand.name) {
//           return product.brand.name.toLowerCase().includes(selectedBrand.toLowerCase())
//         }
//         return false
//       })
//     }

//     // Disease filter
//     if (selectedDisease) {
//       const diseaseQuery = selectedDisease.toLowerCase()
//       filtered = filtered.filter(product => {
//         if (product.name?.toLowerCase().includes(diseaseQuery)) return true
//         if (product.description?.toLowerCase().includes(diseaseQuery)) return true
//         if (product.tags && Array.isArray(product.tags)) {
//           return product.tags.some(tag => 
//             typeof tag === 'string' && tag.toLowerCase().includes(diseaseQuery)
//           )
//         }
//         if (product.category?.toLowerCase().includes(diseaseQuery)) return true
//         if (product.uses?.toLowerCase().includes(diseaseQuery)) return true
//         if (product.indications?.toLowerCase().includes(diseaseQuery)) return true
//         return false
//       })
//     }

//     // Price range filter
//     if (priceRange.min) {
//       filtered = filtered.filter(product => 
//         Number(product.selling_price || 0) >= Number(priceRange.min)
//       )
//     }
//     if (priceRange.max) {
//       filtered = filtered.filter(product => 
//         Number(product.selling_price || 0) <= Number(priceRange.max)
//       )
//     }

//     // Discount filter
//     if (showOnlyDiscounted) {
//       filtered = filtered.filter(product => {
//         const actualPrice = Number(product.actual_price || 0)
//         const sellingPrice = Number(product.selling_price || 0)
//         return actualPrice > sellingPrice && sellingPrice > 0
//       })
//     }

//     // Sorting
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price_low':
//           return Number(a.selling_price || 0) - Number(b.selling_price || 0)
//         case 'price_high':
//           return Number(b.selling_price || 0) - Number(a.selling_price || 0)
//         case 'discount':
//           const getDiscount = (product) => {
//             const actual = Number(product.actual_price || 0)
//             const selling = Number(product.selling_price || 0)
//             return actual > selling ? ((actual - selling) / actual) * 100 : 0
//           }
//           return getDiscount(b) - getDiscount(a)
//         case 'name':
//         default:
//           return (a.name || '').localeCompare(b.name || '')
//       }
//     })

//     setFilteredProducts(filtered)
//   }

//   const clearFilters = () => {
//     setSelectedBrand('')
//     setSelectedDisease('')
//     setPriceRange({ min: '', max: '' })
//     setSortBy('name')
//     setShowOnlyDiscounted(false)
//     setSearchQuery('')
//   }

//   const breadcrumbItems = [
//     { label: 'Home', path: '/' },
//     { label: 'Homeopathic', path: '/homeopathic' }
//   ]

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg text-gray-600">Loading Homeopathic products...</div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg text-red-600">Error: {error}</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <Breadcrumb items={breadcrumbItems} />
      
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Homeopathic Products</h1>
//         <p className="text-gray-600">
//           {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
//         </p>
//       </div>

//       {/* Mobile Filter Toggle Button */}
//       <div className="lg:hidden flex justify-end mb-4">
//         <button
//           onClick={() => setShowMobileFilters(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md"
//         >
//           Filters
//         </button>
//       </div>

//       {/* Main Layout */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Sidebar Filters for Desktop/Tablet */}
//         <div className="hidden lg:block lg:w-1/4">
//           <ProductFilters
//             brands={brands}
//             diseases={diseases}
//             selectedBrand={selectedBrand}
//             setSelectedBrand={setSelectedBrand}
//             selectedDisease={selectedDisease}
//             setSelectedDisease={setSelectedDisease}
//             priceRange={priceRange}
//             setPriceRange={setPriceRange}
//             showOnlyDiscounted={showOnlyDiscounted}
//             setShowOnlyDiscounted={setShowOnlyDiscounted}
//             clearFilters={clearFilters}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//           />
//         </div>

//         {/* Products Grid Section */}
//         <div className="lg:w-3/4">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-700">Sort by:</label>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="name">Name (A-Z)</option>
//                 <option value="price_low">Price (Low to High)</option>
//                 <option value="price_high">Price (High to Low)</option>
//                 <option value="discount">Highest Discount</option>
//               </select>
//             </div>
//           </div>

//           {filteredProducts.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <div className="text-gray-500 text-lg mb-4">No Homeopathic products found</div>
//               <p className="text-gray-400 mb-6">
//                 Try adjusting your filters or search criteria
//               </p>
//               <button
//                 onClick={clearFilters}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Filter Modal */}
//       {showMobileFilters && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start pt-12">
//           <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg relative">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
//               onClick={() => setShowMobileFilters(false)}
//             >
//               ✕
//             </button>
//             <ProductFilters
//               brands={brands}
//               diseases={diseases}
//               selectedBrand={selectedBrand}
//               setSelectedBrand={setSelectedBrand}
//               selectedDisease={selectedDisease}
//               setSelectedDisease={setSelectedDisease}
//               priceRange={priceRange}
//               setPriceRange={setPriceRange}
//               showOnlyDiscounted={showOnlyDiscounted}
//               setShowOnlyDiscounted={setShowOnlyDiscounted}
//               clearFilters={() => {
//                 clearFilters()
//                 setShowMobileFilters(false)
//               }}
//               searchQuery={searchQuery}
//               setSearchQuery={setSearchQuery}
//             />
//             <button
//               onClick={() => setShowMobileFilters(false)}
//               className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Homeopathic



import React from 'react'
import img from '/assets/9619049.webp'
import { Link, useNavigate } from 'react-router-dom';

export default function HomeoPathic (){

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <img
        src={img}
        alt="Coming Soon Illustration"
        className="mb-6 w-64 h-auto"
      />
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-700 mb-4">
        Coming Soon
      </h1>
      <p className="text-gray-600 text-lg max-w-xl">
        We're working hard behind the scenes to make these medicines available soon. Thanks for your patience—stay tuned for updates!
      </p>

      <div className=' flex gap-2 '>

      <Link to='/'>
      <button className='bg-green-600 rounded-xl text-white text-xl cursor-pointer p-3'>
            Go back home 
      </button>
      </Link>

      </div>
      
    </div>
  )
}
