// Search Analytics Utility
class SearchAnalytics {
  constructor() {
    this.storageKey = 'search_history';
    this.maxHistoryItems = 50;
  }

  // Track a search query
  trackSearch(query, resultCount = 0) {
    if (!query || query.trim().length === 0) return;

    const searchHistory = this.getSearchHistory();
    const timestamp = new Date().toISOString();
    
    // Create search entry
    const searchEntry = {
      query: query.trim().toLowerCase(),
      originalQuery: query.trim(),
      timestamp,
      resultCount,
      id: Date.now() + Math.random()
    };

    // Add to beginning of array
    searchHistory.unshift(searchEntry);

    // Keep only recent searches and remove duplicates
    const uniqueSearches = [];
    const seenQueries = new Set();

    for (const entry of searchHistory) {
      if (!seenQueries.has(entry.query) && uniqueSearches.length < this.maxHistoryItems) {
        uniqueSearches.push(entry);
        seenQueries.add(entry.query);
      }
    }

    // Save to localStorage
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(uniqueSearches));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }

  // Get search history
  getSearchHistory() {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.warn('Failed to load search history:', error);
      return [];
    }
  }

  // Get recent searches (last 10)
  getRecentSearches(limit = 10) {
    return this.getSearchHistory()
      .slice(0, limit)
      .map(entry => ({
        query: entry.originalQuery,
        timestamp: entry.timestamp
      }));
  }

  // Get popular searches based on frequency
  getPopularSearches(limit = 10) {
    const history = this.getSearchHistory();
    const queryCount = {};

    // Count frequency of each query
    history.forEach(entry => {
      const query = entry.query;
      queryCount[query] = (queryCount[query] || 0) + 1;
    });

    // Sort by frequency and return top results
    return Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => {
        // Find the most recent entry for this query to get original casing
        const recentEntry = history.find(entry => entry.query === query);
        return {
          query: recentEntry?.originalQuery || query,
          count,
          lastSearched: recentEntry?.timestamp
        };
      });
  }

  // Clear search history
  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear search history:', error);
    }
  }

  // Get search suggestions based on history
  getSuggestions(partialQuery, limit = 5) {
    if (!partialQuery || partialQuery.trim().length === 0) {
      return this.getPopularSearches(limit);
    }

    const history = this.getSearchHistory();
    const query = partialQuery.toLowerCase().trim();
    
    const suggestions = history
      .filter(entry => entry.query.includes(query))
      .slice(0, limit)
      .map(entry => ({
        query: entry.originalQuery,
        timestamp: entry.timestamp
      }));

    return suggestions;
  }
}

// Create singleton instance
const searchAnalytics = new SearchAnalytics();

export default searchAnalytics;