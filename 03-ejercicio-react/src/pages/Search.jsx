import { useEffect, useState } from 'react';
import { JobList } from '../components/JobList';
import { Pagination } from '../components/Pagination';
import { SearchFormSection } from '../components/SearchForm';
import { Spinner } from '../components/Spinner';
import { usePersistedFilters } from '../hooks/usePersistedFilters';

export function Search() {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [totalResults, setTotalResults] = useState(0);
  
  const [currentPage, setCurrentPage] = useState(1);
  /* const [textToFilter, setTextToFilter] = useState(''); */
  // Como pide la letra, vamos a leer el término de búsqueda inicial desde la URL
  const initialParams = new URLSearchParams(window.location.search);
  const [textToFilter, setTextToFilter] = useState(initialParams.get('text') ?? '');
  
  const INITIAL_FILTERS = { technology: '', location: '', experienceLevel: '', salary: '', contractType: '' };
  const [filters, setFilters, clearPersistedFilters] = usePersistedFilters('devjobs_filters', INITIAL_FILTERS);

  const RESULTS_PER_PAGE = 10;

  // Con este useEffect reflejamos los filtros actuales en la URL como search params.
  // Hicimos la el contenido del useEffect un poco complejo para que puedas leerlo y tratar de entender que hace linea por linea, cualquier duda nos puedes preguntar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    textToFilter ? params.set('text', textToFilter) : params.delete('text');

    for (const [key, value] of Object.entries(filters)) {
      value ? params.set(key, value) : params.delete(key);
    }

    const query = params.toString();
    window.history.replaceState({}, '', `/search${query ? `?${query}` : ''}`);
  }, [textToFilter, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [textToFilter, filters.technology, filters.location, filters.experienceLevel]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (textToFilter) params.append('text', textToFilter);
        if (filters.technology) params.append('technology', filters.technology);
        if (filters.location) params.append('type', filters.location);
        if (filters.experienceLevel) params.append('level', filters.experienceLevel);
        
        const offset = (currentPage - 1) * RESULTS_PER_PAGE;
        params.append('limit', RESULTS_PER_PAGE);
        params.append('offset', offset);
        
        const url = `https://jscamp-api.vercel.app/api/jobs?${params.toString()}`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor de empleos. Por favor, inténtalo más tarde.');
        }

        const json = await response.json();
        setJobsData(json.data);
        setTotalResults(json.total); 
      } catch (err) {
        console.error('Error al cargar empleos:', err);
        setError(!navigator.onLine ? 'No hay conexión a internet. Revisa tu red.' : err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [textToFilter, filters.technology, filters.location, filters.experienceLevel, currentPage]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const handleChangeText = (text) => {
    setTextToFilter(text);
  };

  const handleReset = () => {
    clearPersistedFilters();
    setTextToFilter('');
  };

  const getPageTitle = () => {
    if (loading) return 'Cargando empleos...';
    if (error) return 'Error al cargar empleos';
    if (textToFilter === '') return `${totalResults} trabajos encontrados - Página ${currentPage}`;
    
    return `${totalResults} trabajos de "${textToFilter}" - Página ${currentPage}`;
  };

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
  const hasActiveFilters = textToFilter !== '' || Object.values(filters).some(value => value !== '');

  return (
    <>
      <title>{getPageTitle()}</title>
      <main>
        <SearchFormSection 
          onSearch={handleSearch} 
          onTextFilter={handleChangeText} 
          initialText={textToFilter}
          onReset={handleReset}
          hasActiveFilters={hasActiveFilters}
        />
        
        <div className="results-summary" style={{ maxWidth: '1280px', margin: '1rem auto', paddingInline: '1rem' }}>
          {!loading && !error && (
            <p style={{ color: 'var(--text-muted)' }}>
              Se encontraron <strong>{totalResults}</strong> trabajos
              {textToFilter && ` para "${textToFilter}"`}
            </p>
          )}
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#ef4444' }}>
            <h2>⚠️ Algo salió mal</h2>
            <p style={{ margin: '1rem 0' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ padding: '0.75rem 1.5rem', background: '#334155', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Reintentar
            </button>
          </div>
        ) : jobsData.length === 0 ? (
          <p style={{ padding: '2rem', textWrap: 'balance', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se han encontrado empleos que coincidan con los criterios de búsqueda.
          </p>
        ) : (
          <JobList jobs={jobsData} />
        )}
        
        {!loading && !error && totalPages > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </main>
    </>
  );
}