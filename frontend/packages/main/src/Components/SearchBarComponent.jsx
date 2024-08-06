// src/Components/SearchBar.jsx
import React, { useState, useContext } from 'react';
import { GlobalContext } from '../GlobalState';
import Search from '@splunk/react-ui/Search';

const SearchBarComponent = () => {
  const [query, setQuery] = useState('');
  const { setSearchResults } = useContext(GlobalContext);

  const handleSearch = async (event) => {
    setQuery(event.target.value);
    if (event.target.value.length > 2) {
      try {
        const response = await fetch(`https://ve0g3ekx8b.execute-api.us-east-1.amazonaws.com/dev/search?q=${event.target.value}`);
        if (response.ok) {
          const searchResults = await response.json();
          setSearchResults(searchResults);
        } else {
          console.error('Error fetching search results:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div>
      <Search inline onChange={handleSearch} value={query} />
    </div>
  );
};

export default SearchBarComponent;