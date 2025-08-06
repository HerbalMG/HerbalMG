import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import searchAnalytics from '../utils/searchAnalytics';

export default function NavbarSearchMobile({ placeholder = "Search medicines, brands..." }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load popular searches on component mount
  useEffect(() => {
    loadPopularSearches();
  }, []);

  const loadPopularSearches = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/search/popular');
      if (response.ok) {
        const data = await response.json();
        setPopularSearches(data.popular || []);
      }
    } catch (error) {
      console.error('Failed to fetch popular searches:', error);
    }
  };

  // Same search logic as desktop version
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=5`);
      
      if (response.ok) {
        const data = await response.json();
        const suggestions = data.suggestions || [];
        
        const formattedResults = suggestions.map(suggestion => {
          const itemName = suggestion.name || suggestion.suggestion;
          const itemId = suggestion.id || suggestion._id;
          
          return {
            id: itemId,
            name: itemName,
            type: suggestion.type,
            searchType: suggestion.type === 'product' ? 'products' : 
                       suggestion.type === 'brand' ? 'brands' :
                       suggestion.type === 'disease' ? 'diseases' : 'categories',
            ...suggestion,
            displayName: itemName
          };
        });

        setSearchResults(formattedResults);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useRef(
    debounce((text) => {
      performSearch(text);
    }, 300)
  ).current;

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSearchIcon = (type) => {
    switch (type) {
      case 'products': case 'product': return '💊';
      case 'brands': case 'brand': return '🏢';
      case 'diseases': case 'disease': return '🩺';
      case 'categories': case 'category': return '📂';
      default: return '🔍';
    }
  };

  const getSearchLabel = (type) => {
    switch (type) {
      case 'products': case 'product': return 'Product';
      case 'brands': case 'brand': return 'Brand';
      case 'diseases': case 'disease': return 'Disease';
      case 'categories': case 'category': return 'Category';
      default: return 'Result';
    }
  };

  // EXACT COPY FROM SearchComponent
  const handleSearchSelect = async (item) => {
    console.log('🖱️ Mobile search result clicked:', item);
    
    const searchQuery = item.name || item.displayName;
    setQuery(searchQuery);
    setShowDropdown(false);
    
    searchAnalytics.trackSearch(searchQuery);
    
    const itemType = item.searchType || item.type;
    console.log('📊 Item details:', { type: itemType, id: item.id, name: searchQuery });
    
    if (itemType === 'products' || itemType === 'product') {
      if (item.id) {
        console.log('🚀 Navigating to product:', item.id);
        navigate(`/product/${item.id}`);
      } else {
        console.log('🔍 No product ID found, searching for:', searchQuery);
        try {
          const response = await fetch(`http://localhost:3001/api/product?search=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const products = await response.json();
            if (products && products.length > 0) {
              console.log('✅ Found product, navigating to:', products[0].id);
              navigate(`/product/${products[0].id}`);
              return;
            }
          }
        } catch (error) {
          console.error('❌ Error searching for product:', error);
        }
        console.log('⚠️ Fallback: Navigating to search with product filter');
        navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=products`);
      }
    } else if (itemType === 'brands' || itemType === 'brand') {
      if (item.id) {
        console.log('🚀 Navigating to brand:', item.id);
        navigate(`/brand/${item.id}`);
      } else {
        console.log('🔍 No brand ID found, using slug approach for:', searchQuery);
        const brandSlug = searchQuery.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        navigate(`/brand/${brandSlug}`);
      }
    } else if (itemType === 'diseases' || itemType === 'disease') {
      console.log('🚀 Navigating to disease/health concern:', searchQuery);
      const diseaseSlug = searchQuery.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      navigate(`/health-concern/${diseaseSlug}`);
    } else if (itemType === 'categories' || itemType === 'category') {
      console.log('🚀 Navigating to category:', searchQuery);
      const categorySlug = searchQuery.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      navigate(`/category/${categorySlug}`);
    } else {
      console.log('🚀 Default navigation to search');
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    searchAnalytics.trackSearch(query);
    
    const popularCategories = ['Ayurvedic', 'Homeopathic', 'Diabetes', 'Blood Pressure', 'Pain Relief', 'Vitamins'];
    const isPopularCategory = popularCategories.some(cat => 
      cat.toLowerCase() === query.toLowerCase()
    );
    
    if (searchResults.length === 0 && !isPopularCategory) {
      navigate(`/request-product?query=${encodeURIComponent(query)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    
    setShowDropdown(false);
  };

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0 || popularSearches.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          className="border rounded px-2 py-1 pr-8 text-xs w-full dark:bg-neutral-800 dark:text-white text-black"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-800"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-800"></div>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

      {/* Mobile Search Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {/* Search Results */}
          {searchResults.length > 0 && searchResults.slice(0, 3).map((item, index) => (
            <div
              key={`mobile-${item.searchType}-${item.id}-${index}`}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile search result clicked:', item);
                handleSearchSelect(item);
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{getSearchIcon(item.searchType)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-gray-900 truncate">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    {getSearchLabel(item.searchType)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Popular Searches for Mobile */}
          {/* {searchResults.length === 0 && popularSearches.length > 0 && (
            <div className="px-3 py-2">
              <div className="text-xs font-medium text-gray-700 mb-1">Popular</div>
              <div className="space-y-1">
                {popularSearches.slice(0, 3).map((item, index) => (
                  <div
                    key={`mobile-popular-${index}`}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                    onClick={() => {
                      setQuery(item.name);
                      navigate(`/search?q=${encodeURIComponent(item.name)}`);
                      setShowDropdown(false);
                    }}
                  >
                    <span className="text-xs">{getSearchIcon(item.type + 's')}</span>
                    <span className="text-xs text-gray-700 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}
          
          {query.trim() && (
            <div className="px-3 py-2 border-t bg-gray-50">
              <button
                onClick={handleSearchSubmit}
                className="w-full text-left text-xs text-blue-600"
              >
                {searchResults.length === 0 
                  ? `Request "${query}"`
                  : `View all results`
                }
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}