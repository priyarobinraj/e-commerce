import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "./Cartcontext";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    axios
      .get<Product>(`https://dummyjson.com/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 sm:py-10 text-sm sm:text-base">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-6 sm:py-10 text-sm sm:text-base">
        Product not found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-10">
      <Link
        to="/"
        className="text-blue-600 hover:underline mb-4 inline-block text-sm sm:text-base"
      >
        ← Back to Products
      </Link>
      <div className="bg-white p-4 sm:p-6 shadow-md rounded flex flex-col sm:flex-row">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full sm:w-1/2 h-64 sm:h-96 object-contain mb-4 sm:mb-0 sm:mr-6"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {product.title}
          </h2>
          <p className="text-gray-600 mb-4 text-base sm:text-lg">
            ${product.price}
          </p>
          <p className="text-gray-700 mb-6 text-sm sm:text-base">
            {product.description}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
