import { useEffect, useState } from 'react';

import { apiGet } from '../lib/api';
import { NotFoundError, ValidationError } from '../types/errors';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  createdAt: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useProducts(filters: ProductFilters = {}) {
  const [data, setData] = useState<ProductListResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (newFilters?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      const currentFilters = { ...filters, ...newFilters };

      if (currentFilters.page)
        queryParams.append('page', currentFilters.page.toString());
      if (currentFilters.limit)
        queryParams.append('limit', currentFilters.limit.toString());
      if (currentFilters.search)
        queryParams.append('search', currentFilters.search);

      const response = await apiGet<ProductListResult>(
        `/api/products?${queryParams.toString()}`
      );

      if (response.ok && response.data) {
        setData(response.data);
      } else {
        // Handle different types of errors
        if (response.error) {
          const errorMessage = response.error.message;
          if (errorMessage.includes('Method not allowed')) {
            setError('Invalid request method');
          } else if (errorMessage.includes('Invalid pagination')) {
            setError('Invalid page or limit parameters');
          } else if (errorMessage.includes('not found')) {
            setError('Products not found');
          } else {
            setError(errorMessage);
          }
        } else {
          setError('Failed to fetch products');
        }
      }
    } catch (err) {
      console.error('Products fetch error:', err);

      // Handle specific error types
      if (err instanceof ValidationError) {
        setError(err.message);
      } else if (err instanceof NotFoundError) {
        setError(err.message);
      } else if (err instanceof Error) {
        if (err.message.includes('fetch')) {
          setError('Network error. Please check your connection.');
        } else if (err.message.includes('JSON')) {
          setError('Invalid response format from server.');
        } else {
          setError(err.message || 'An error occurred while fetching products');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters.page, filters.limit, filters.search]);

  const refetch = () => fetchProducts();
  const setPage = (page: number) => fetchProducts({ ...filters, page });
  const setLimit = (limit: number) => fetchProducts({ ...filters, limit });
  const setSearch = (search: string) =>
    fetchProducts({ ...filters, search, page: 1 });
  const clearError = () => setError(null);

  return {
    data,
    loading,
    error,
    refetch,
    setPage,
    setLimit,
    setSearch,
    clearError,
  };
}
