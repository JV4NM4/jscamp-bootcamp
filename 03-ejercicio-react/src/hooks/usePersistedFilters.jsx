import { useState, useEffect } from 'react';

export function usePersistedFilters(key, initialValue) {
  const [filters, setFilters] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(filters));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }, [key, filters]);

  const clearFilters = () => {
    setFilters(initialValue);
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  };

  return [filters, setFilters, clearFilters];
}