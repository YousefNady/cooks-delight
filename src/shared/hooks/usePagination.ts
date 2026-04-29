import { useState } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  pageSize: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginate: (items: T[]) => T[];
  nextPage: () => void;
  prevPage: () => void;
}

export function usePagination<T>(
  { totalItems, pageSize }: UsePaginationOptions
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginate = (items: T[]) =>
    items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return { currentPage, totalPages, paginate, nextPage, prevPage };
}