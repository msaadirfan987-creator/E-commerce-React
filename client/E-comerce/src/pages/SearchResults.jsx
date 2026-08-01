import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SidebarFilters from '../components/SidebarFilters';
import Footer from '../components/Footer';
import productService from '../services/productService';
import ProductSkeleton from '../components/loaders/ProductSkeleton';
import ImageLoader from '../components/loaders/ImageLoader';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Inbox, CircleDot } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Parse q from URL
  const queryParams = new URLSearchParams(location.search);
  const urlQuery = queryParams.get('q') || '';

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  // Data States
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sync searchQuery when URL query 'q' changes
  useEffect(() => {
    setSearchQuery(urlQuery);
    setPage(1); // Reset page on new search
  }, [urlQuery]);

  // Load results from backend API
  const loadSearchResults = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        q: searchQuery,
        category: selectedCategory,
        maxPrice: priceRange,
        rating: selectedRating,
        sortBy,
        page,
        limit
      };

      const data = await productService.searchProducts(params);
      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load search results:', err);
      setError('Connection issue loading search results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSearchResults();
  }, [searchQuery, selectedCategory, priceRange, selectedRating, sortBy, page]);

  // Handle filter changes from SidebarFilters
  const handleFilterChange = (filters) => {
    if (filters.searchQuery !== undefined) {
      // Navigate to update URL search parameter q
      navigate(`/search?q=${encodeURIComponent(filters.searchQuery.trim())}`);
    }
    if (filters.selectedCategory !== undefined) setSelectedCategory(filters.selectedCategory);
    if (filters.priceRange !== undefined) setPriceRange(filters.priceRange);
    if (filters.selectedRating !== undefined) setSelectedRating(filters.selectedRating);
    setPage(1); // Reset page to first on filter change
  };

  // Clear all filters & query
  const handleClearSearch = () => {
    setSelectedCategory('All');
    setPriceRange(1000);
    setSelectedRating(null);
    setSortBy('relevance');
    setPage(1);
    navigate('/search?q=');
  };

  return (
    <>
      {/* Page Content layout */}
      <div className="min-h-screen bg-slate-50 py-8 font-sans select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* Header section detailing current search query */}
          <div className="mb-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-slate-800">Search Results</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-1">
                {urlQuery ? `Search Results for "${urlQuery}"` : 'All Products Catalog'}
              </h1>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                {loading ? 'Finding matching entries...' : `Found ${totalCount} matching products`}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500 shrink-0">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="bg-white border border-slate-200 focus:border-slate-400 text-xs font-bold text-slate-700 py-1.5 px-3 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start relative">
            
            {/* Sidebar Filters */}
            <div className="w-full lg:w-64 shrink-0 z-10">
              <SidebarFilters 
                onFilterChange={handleFilterChange} 
                initialFilters={{
                  searchQuery: urlQuery,
                  selectedCategory,
                  priceRange,
                  selectedRating
                }}
              />
            </div>

            {/* Main Products Grid Section */}
            <div className="flex-grow w-full">
              {loading ? (
                // Skeletons while loading
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                  {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="bg-white border border-slate-200 p-12 text-center rounded-lg shadow-3xs flex flex-col items-center justify-center space-y-2">
                  <p className="text-rose-500 font-bold text-xs">{error}</p>
                  <button onClick={loadSearchResults} className="text-[10px] font-black underline hover:text-slate-900 transition-colors">Retry Search</button>
                </div>
              ) : products.length > 0 ? (
                <>
                  {/* Results Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                    {products.map((product) => {
                      const productId = product._id;
                      const productImage = product.images && product.images.length > 0 
                        ? product.images[0] 
                        : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=300&q=80';

                      return (
                        <Link 
                          to={`/product/${productId}`} 
                          key={productId} 
                          className="group bg-white border border-slate-200 rounded-lg overflow-hidden transition-all hover:border-slate-350 flex flex-col h-full cursor-pointer block"
                        >
                          {/* Image Wrapper */}
                          <div className="w-full aspect-square bg-slate-50 overflow-hidden relative">
                            <ImageLoader 
                              src={productImage} 
                              alt={product.title} 
                              className="w-full h-full"
                              imgClassName="group-hover:scale-[1.02] transition-transform duration-300"
                            />
                          </div>

                          {/* Info Column */}
                          <div className="p-4 flex flex-col flex-grow justify-between bg-white">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                                {product.category} 
                              </span>
                              
                              <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-relaxed mb-3 group-hover:text-slate-950 transition-colors">
                                {product.title} 
                              </h4>
                            </div>

                            {/* Cost / Actions */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs font-black text-slate-900">
                                  ${product.price} 
                                </span>
                                
                                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                                  ★ {product.avgRating ? product.avgRating.toFixed(1) : '5.0'} 
                                </div>
                              </div>

                              <button 
                                className="w-full bg-slate-900 text-white text-[10px] font-bold py-2 rounded-lg transition-all hover:bg-slate-800 block shadow-sm cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault(); 
                                  addToCart(product, 1);
                                }}
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 disabled:opacity-40 rounded-lg text-xs font-bold transition-all disabled:cursor-not-allowed cursor-pointer"
                      >
                        Prev
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              page === pageNum 
                                ? 'bg-slate-950 text-white border-slate-950' 
                                : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50 cursor-pointer'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 disabled:opacity-40 rounded-lg text-xs font-bold transition-all disabled:cursor-not-allowed cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // No Results Found fallback screen
                <div className="bg-white border border-slate-200 rounded-lg p-16 text-center shadow-3xs flex flex-col items-center justify-center space-y-4">
                  <Inbox className="w-10 h-10 text-slate-350" />
                  <div>
                    <h3 className="text-slate-800 text-sm font-black uppercase tracking-tight">No products found</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal max-w-sm">
                      We couldn't match any records for {urlQuery ? `"${urlQuery}"` : 'your query'} with active catalog entries. Try clearing filters or tweaking your keywords.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleClearSearch}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-750 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                    <Link
                      to="/shop"
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Browse All Products
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default SearchResults;
