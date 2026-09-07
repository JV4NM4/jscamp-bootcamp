import { useState, useEffect } from 'react';

let timeoutId = null;

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

  const handleTextChange = (event) => {
    const text = event.target.value;
    
    setSearchText(text);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      onTextFilter(text);
    }, 500);
  };

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