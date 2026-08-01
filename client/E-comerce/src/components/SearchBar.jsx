import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import productService from '../services/productService';

const SearchBar = ({ placeholder = "Search products...", className = "", containerClassName = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query from URL
  const queryParams = new URLSearchParams(location.search);
  const urlQuery = queryParams.get('q') || '';

  const [query, setQuery] = useState(urlQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Sync state with URL change
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Debounced search suggestions fetcher
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await productService.searchProducts({ q: query, limit: 5 });
        if (data.success) {
          setSuggestions(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load search suggestions:", err);
      }
    }, 250); // 250ms debounce delay

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const clickOutsideHandler = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', clickOutsideHandler);
    return () => document.removeEventListener('mousedown', clickOutsideHandler);
  }, []);

  // Handle Form Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Suggestion item selection
  const handleSelectSuggestion = (suggestedTitle) => {
    setQuery(suggestedTitle);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestedTitle)}`);
  };

  return (
    <div ref={suggestionsRef} className={`relative flex-grow max-w-sm mx-2 ${containerClassName}`}>
      <form onSubmit={handleSearchSubmit} className={`w-full flex items-center rounded-lg border border-slate-200 focus-within:border-slate-400 bg-slate-50/50 px-3 py-1.5 transition-all ${className}`}>
        
        {/* Search Icon */}
        <button type="submit" className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-1 shrink-0">
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Search Input */}
        <input 
          type="text" 
          placeholder={placeholder} 
          value={query}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          className="w-full px-1 text-xs font-semibold text-slate-800 bg-transparent focus:outline-none placeholder-slate-400"
        />

        {/* Clear Button */}
        {query && (
          <button 
            type="button" 
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1.5 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <button
              key={item._id}
              onClick={() => handleSelectSuggestion(item.title)}
              className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 text-slate-700 font-semibold transition-colors flex items-center gap-2.5 truncate"
            >
              {item.images && item.images.length > 0 && (
                <img 
                  src={item.images[0]} 
                  alt={item.title} 
                  className="w-6 h-6 rounded object-cover border border-slate-100 bg-slate-50 shrink-0"
                />
              )}
              <span className="truncate flex-grow">{item.title}</span>
              <span className="text-[10px] text-slate-450 uppercase shrink-0 font-extrabold">{item.brand}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
