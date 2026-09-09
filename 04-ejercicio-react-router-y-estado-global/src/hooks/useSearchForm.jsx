import { useState, useRef } from "react";

export function useSearchForm({initialText = "", idTechnology, idLocation, idExperienceLevel, idSalary, idContractType, idText, onSearch, onTextFilter }) {
  const [searchText, setSearchText] = useState(initialText);
  
  // 1. Creamos la referencia para guardar el ID del temporizador
  const timeoutId = useRef(null); 

  const handleTextChange = (event) => {
    const text = event.target.value;
    setSearchText(text);

    // 2. Leemos la referencia con .current
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // 3. Guardamos el nuevo ID en .current
    timeoutId.current = window.setTimeout(() => {
      onTextFilter(text);
    }, 500);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = {
      text: formData.get(idText) || '',
      technology: formData.get(idTechnology) || '',
      location: formData.get(idLocation) || '',
      experienceLevel: formData.get(idExperienceLevel) || '',
      salary: formData.get(idSalary) || '',
      contractType: formData.get(idContractType) || ''
    };
    onSearch(filters);
  };

  return {
    searchText,
    handleSubmit,
    handleTextChange
  };
}