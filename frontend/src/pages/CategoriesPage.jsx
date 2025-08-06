import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { createSlug } from '../utils/slugUtils';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback data
  const fallbackData = [
    { id: 1, name: "Diabetes", imageUrl: "/assets/diabetes.svg", slug: "diabetes" },
    { id: 2, name: "Skin Care", imageUrl: "/assets/skin.svg", slug: "skin-care" },
    { id: 3, name: "Hair Care", imageUrl: "/assets/hair.svg", slug: "hair-care" },
    { id: 4, name: "Joint, Bone & Muscle Care", imageUrl: "/assets/joint.svg", slug: "joint-care" },
    { id: 5, name: "Kidney Care", imageUrl: "/assets/Kidney.svg", slug: "kidney-care" },
    { id: 6, name: "Liver Care", imageUrl: "/assets/liver.svg", slug: "liver-care" },
    { id: 7, name: "Heart Care", imageUrl: "/assets/heart.svg", slug: "heart-care" },
    { id: 8, name: "Men Wellness", imageUrl: "/assets/men.svg", slug: "men-care" },
    { id: 9, name: "Women Wellness", imageUrl: "/assets/women.svg", slug: "women-care" },
    { id: 10, name: "Digestive Care", imageUrl: "/assets/digestive.svg", slug: "digestive-care" },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/category');
      const data = await response.json();

      if (response.ok && Array.isArray(data) && data.length > 0) {
        setCategories(data);
      } else {
        setCategories(fallbackData);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const breadcrumbItems = [
  //   { label: 'Home', path: '/' },
  //   { label: 'Categories', path: '/categories' }
  // ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* <Breadcrumb items={breadcrumbItems} /> */}
      
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          All Categories
        </h1>
        <p className="text-gray-600">
          {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'} found
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug || createSlug(category.name)}`}
              className="group"
            >
              <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 text-center">
                {category.imageUrl || category.image_url ? (
                  <img
                    src={category.imageUrl || category.image_url}
                    alt={category.name}
                    className="w-16 h-16 mx-auto object-contain mb-2 group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <span className="text-gray-500 text-xs font-medium">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <h3 className="text-sm font-medium text-gray-800 text-center">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {searchQuery ? `No Categories Found for "${searchQuery}"` : 'No Categories Available'}
            </h3>
            <p className="text-gray-500 text-sm max-w-md mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms or browse all available categories.' 
                : 'We\'re organizing our product categories. Check back soon for a better shopping experience!'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;