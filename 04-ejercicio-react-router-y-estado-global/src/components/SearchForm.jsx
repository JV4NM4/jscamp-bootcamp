import { useId, useState, useRef } from "react";
import { useSearchForm } from "../hooks/useSearchForm";

export function SearchFormSection ({ onTextFilter, onSearch, initialText, onReset, hasActiveFilters }) {
  const idText = useId();
  const idTechnology = useId();
  const idLocation = useId();
  const idExperienceLevel = useId();
  const idSalary = useId();
  const idContractType = useId();

  const inputRef = useRef();
  const formRef = useRef();
  const [focusedField, setFocusedField] = useState(null);

  const {
    handleSubmit,
    handleTextChange
  } = useSearchForm({ idTechnology, idLocation, idExperienceLevel, idSalary, idContractType, idText, onSearch, onTextFilter });

  const handleClearInput = (event) => {
    event.preventDefault();
    inputRef.current.value = "";
    onTextFilter("");
  };

  const handleReset = () => {
    if (formRef.current) {
       formRef.current.reset(); 
    }
    inputRef.current.value = "";
    if (onReset) onReset();
  };

  return (
    <section className="jobs-search">
      <h1>Encuentra tu próximo trabajo</h1>
      <p>Explora miles de oportunidades en el sector tecnológico.</p>

      <form ref={formRef} onSubmit={handleSubmit} id="empleos-search-form" role="search">
        
        <div className="search-bar" style={{ 
          outline: focusedField === 'search' ? '2px solid #09f' : 'none',
          outlineOffset: '2px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-search">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>
          
          <input
            ref={inputRef}
            name={idText} id="empleos-search-input" type="text"
            placeholder="Buscar trabajos, empresas o habilidades"
            onChange={handleTextChange}
            defaultValue={initialText}
            onFocus={() => setFocusedField('search')}
            onBlur={() => setFocusedField(null)}
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
          />

        </div>

        {focusedField === 'search' && (
          <small className="input-hint" style={{ color: '#94a3b8', display: 'block', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Busca por título de trabajo, empresa o tecnología
          </small>
        )}

        <div className="search-filters">
          <select 
            name={idTechnology} 
            id="filter-technology"
            onFocus={() => setFocusedField('technology')}
            onBlur={() => setFocusedField(null)}
          >
            <option value="">Tecnología</option>
            <optgroup label="Tecnologías populares">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="react">React</option>
              <option value="nodejs">Node.js</option>
            </optgroup>
            <option value="java">Java</option>
            <hr />
            <option value="csharp">C#</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
            <hr />
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
          </select>

          <select 
            name={idLocation} 
            id="filter-location"
            onFocus={() => setFocusedField('location')}
            onBlur={() => setFocusedField(null)}
          >
            <option value="">Ubicación</option>
            <option value="remoto">Remoto</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="monterrey">Monterrey</option>
            <option value="barcelona">Barcelona</option>
          </select>

          <select 
            name={idExperienceLevel} 
            id="filter-experience-level"
            onFocus={() => setFocusedField('experienceLevel')}
            onBlur={() => setFocusedField(null)}
          >
            <option value="">Nivel de experiencia</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>

          <div className="form-group">
            <label htmlFor={idContractType} style={{ display: 'none' }}>Tipo de contrato</label>
            <select 
              name={idContractType} 
              id={idContractType}
              onFocus={() => setFocusedField('contractType')}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">Contrato (Todos)</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Prácticas</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor={idSalary} style={{ display: 'none' }}>Salario mínimo</label>
            <input 
              type="number" 
              name={idSalary} 
              id={idSalary} 
              placeholder="Salario min (€)" 
              min="0" 
              step="1000"
              onFocus={() => setFocusedField('salary')}
              onBlur={() => setFocusedField(null)}
              style={{ 
                padding: '0.625rem', 
                borderRadius: '0.5rem', 
                border: 'none', 
                backgroundColor: '#242d3a', 
                color: 'white',
                outline: focusedField === 'salary' ? '2px solid #09f' : 'none'
              }}
            />
          </div>

          <div className="form-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn-primary" style={{ background: '#09f' }}>
              Aplicar filtros
            </button>
            {hasActiveFilters && (
              <button type="button" className="btn-secondary" onClick={handleReset} style={{ background: '#334155' }}>
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </form>

      <span id="filter-selected-value"></span>
    </section>
  );
}