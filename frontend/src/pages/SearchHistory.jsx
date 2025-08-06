import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import searchAnalytics from '../utils/searchAnalytics';

const SearchHistory = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = () => {
    const recent = searchAnalytics.getRecentSearches(20);
    const popular = searchAnalytics.getPopularSearches(10);
    
    setRecentSearches(recent);
    setPopularSearches(popular);
  };

  const handleSearchClick = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const clearHistory = () => {
    searchAnalytics.clearHistory();
    setRecentSearches([]);
    setPopularSearches([]);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Search History</h1>
          {(recentSearches.length > 0 || popularSearches.length > 0) && (
            <button
              onClick={clearHistory}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear All History
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Searches */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Searches</h2>
            
            {recentSearches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <p>No recent searches</p>
                <p className="text-sm mt-2">Your search history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleSearchClick(search.query)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">🕒</span>
                      <div>
                        <div className="font-medium text-gray-800">{search.query}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(search.timestamp)}
                        </div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular Searches */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Popular Searches</h2>
            
            {popularSearches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>No popular searches yet</p>
                <p className="text-sm mt-2">Search more to see your trends</p>
              </div>
            ) : (
              <div className="space-y-3">
                {popularSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleSearchClick(search.query)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">🔥</span>
                      <div>
                        <div className="font-medium text-gray-800">{search.query}</div>
                        <div className="text-sm text-gray-500">
                          Searched {search.count} time{search.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {search.count}
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/search?q=Ayurvedic"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">🌿</div>
              <div className="text-sm font-medium">Ayurvedic</div>
            </Link>
            <Link
              to="/search?q=Homeopathic"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">💊</div>
              <div className="text-sm font-medium">Homeopathic</div>
            </Link>
            <Link
              to="/search?q=Diabetes"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">🩺</div>
              <div className="text-sm font-medium">Diabetes</div>
            </Link>
            <Link
              to="/search?q=Vitamins"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">💪</div>
              <div className="text-sm font-medium">Vitamins</div>
            </Link>
          </div>
        </div>

        {/* Back to Search */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            New Search
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;