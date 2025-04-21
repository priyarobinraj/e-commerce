import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductDetail from "./ProductDetail";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

const ProductList: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const debounceTimeoutRef = useRef<number | null>(null);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }

      axios
        .get<{ products: Product[] }>(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
        )
        .then((response) => {
          setSearchResults(response.data.products);
        })
        .catch((error: unknown) => {
          console.error("Error searching products:", error);
          setSearchResults([]);
        });
    }, 300);
  };

  useEffect(() => {
    axios
      .get<{ products: Product[] }>("https://dummyjson.com/products")
      .then((response) => {
        setAllProducts(response.data.products);
      })
      .catch((error: unknown) => {
        console.error("Error fetching all products:", error);
      });

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white p-4 shadow-md rounded hover:shadow-lg transition-shadow">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-32 sm:h-48 object-contain mb-4"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
        <h4 className="text-base sm:text-lg font-medium">{product.title}</h4>
        <p className="text-gray-600 text-sm sm:text-base">${product.price}</p>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold text-blue-600"
            >
              MDB
            </Link>
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearch(e.target.value)
                }
                className="border rounded p-2 pl-10 w-full text-sm sm:text-base"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2">
              <FaUser className="text-base sm:text-lg" />
            </button>
            <button className="p-2">
              <FaHeart className="text-base sm:text-lg" />
            </button>
            <button className="p-2">
              <FaShoppingCart className="text-base sm:text-lg" />
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto">
          <ul className="hidden sm:flex space-x-6 text-gray-700 text-sm sm:text-base">
            <li>
              <a href="#" className="hover:text-blue-600">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Categories
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Hot offers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Gift boxes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Menu item
              </a>
            </li>
            <li className="relative group">
              <a href="#" className="hover:text-blue-600">
                Others
              </a>
              <ul className="absolute hidden group-hover:block bg-white shadow-md p-2">
                <li>
                  <a href="#" className="block p-2 hover:bg-gray-100">
                    Subitem 1
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-2 hover:bg-gray-100">
                    Subitem 2
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <div className="sm:hidden">
            <button className="text-gray-700 text-lg">☰</button>
          </div>
        </div>
      </nav>

      {searchQuery && (
        <section className="container mx-auto py-6 sm:py-10">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
            Search Results
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-sm sm:text-base">
                No results found for "{searchQuery}"
              </p>
            )}
          </div>
        </section>
      )}

      <section className="bg-blue-600 text-white py-12 sm:py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">
            Best products & brands in our store
          </h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6">
            Trendy Products, Factory Prices, Excellent Service
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-4 sm:px-6 py-2 rounded hover:bg-gray-100 text-sm sm:text-base">
              LEARN MORE
            </button>
            <button className="bg-white text-blue-600 px-4 sm:px-6 py-2 rounded hover:bg-gray-100 text-sm sm:text-base">
              PURCHASE NOW
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-6 sm:py-10">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          All New Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {allProducts.length > 0 ? (
            allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-sm sm:text-base">Loading all products...</p>
          )}
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
