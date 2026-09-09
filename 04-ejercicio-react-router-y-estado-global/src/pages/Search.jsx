import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router'; 
import { JobList } from '../components/JobList';
import { Pagination } from '../components/Pagination';
import { SearchFormSection } from '../components/SearchForm';
import { Spinner } from '../components/Spinner';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [totalResults, setTotalResults] = useState(0);
  
  const [textToFilter, setTextToFilter] = useState(() => {
    return searchParams.get('text') ?? '';
  });
  
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    if (!pageParam) return 1;
    const page = Number(pageParam);
    if (Number.isNaN(page) || page < 1) return 1;
    return page;
  });

  const [filters, setFilters] = useState(() => {
    return {
      technology: searchParams.get('technology') || '',
      location: searchParams.get('type') || '',
      experienceLevel: searchParams.get('level') || '', 
      salary: '', 
      contractType: searchParams.get('contractType') || ''
    };
  });

  const clearFilters = () => {
    setFilters({ technology: '', location: '', experienceLevel: '', salary: '', contractType: '' });
  };

  const RESULTS_PER_PAGE = 10;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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
        if (filters.contractType) params.append('contractType', filters.contractType);
        
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

  useEffect(() => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams);
      
      if (textToFilter) params.set('text', textToFilter);
      else params.delete('text');

      if (filters.technology) params.set('technology', filters.technology);
      else params.delete('technology');

      if (filters.location) params.set('type', filters.location);
      else params.delete('type');

      if (filters.experienceLevel) params.set('level', filters.experienceLevel);
      else params.delete('level');

      if (filters.contractType) params.set('contractType', filters.contractType);
      else params.delete('contractType');
      
      if (currentPage > 1) params.set('page', String(currentPage));
      else params.delete('page');

      return params;
    });
  }, [filters, textToFilter, currentPage, setSearchParams]);

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
    clearFilters();
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