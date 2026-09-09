/* import { useState, useEffect } from 'react'; */
import { useEffect, useRef, useState } from 'react';

// Evitemos usar variables globales fuera de los componentes, esto lo que hace es que sean accesibles a todos los componentes
/* let timeoutId = null; */

export const useSearchForm = ({
  initialText = '',
  idTechnology = 'technology',
  idLocation = 'location',
  idExperienceLevel = 'experienceLevel',
  idText = 'search',
  onSearch,
  onTextFilter,
}) => {
  const [searchText, setSearchText] = useState(initialText);

  useEffect(() => {
    setSearchText(initialText);
  }, [initialText]);

  /* const handleTextChange = (event) => {
    const text = event.target.value;
    
    setSearchText(text);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      onTextFilter(text);
    }, 500);
  }; */

  // En su lugar, guardamos la variable con un useRef dentro del propio componente para tener control sobre él
  const timeoutId = useRef(null);

  const handleTextChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => onTextFilter(text), 500);
  };

  // Cancelamos el debounce pendiente si el componente se desmonta
  useEffect(() => () => clearTimeout(timeoutId.current), []);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (event.target.name === idText) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    
    const filters = {
      technology: formData.get(idTechnology) || '',
      location: formData.get(idLocation) || '',
      experienceLevel: formData.get(idExperienceLevel) || '',
    };
    
    onSearch(filters);
  };

  return {
    searchText,
    handleSubmit,
    handleTextChange,
  };
};