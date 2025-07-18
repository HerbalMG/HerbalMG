import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const productList = ['apple', 'banana', 'orange']; // Replace with your dynamic data

function Search() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const found = productList.includes(query.toLowerCase());

    if (found) {
      // Navigate to actual product page if found
      navigate(`/products/${query.toLowerCase()}`);
    } else {
      // Navigate to request page with query in URL
      navigate(`/request-product?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div>
      <h1>Search Products</h1>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search for a product..." 
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Search;
