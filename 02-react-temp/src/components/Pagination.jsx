import styles from './Pagination.module.css';

export function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrevious = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (e, page) => {
    e.preventDefault();
    onPageChange(page);
  };

  const styleLinkLeft = {
    opacity: currentPage === 1 ? 0.5 : 1,
    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
  };

  const styleLinkRight = {
    opacity: currentPage === totalPages ? 0.5 : 1,
    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
  };

  return (
    <nav className={styles.pagination}>
      <a href="#" style={styleLinkLeft} onClick={handlePrevious}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 6l-6 6l6 6" />
        </svg>
      </a>

      {pages.map((page) => (
        <a 
          key={page} 
          className={currentPage === page ? styles.isActive : ''} 
          href="#" 
          onClick={(e) => handlePageClick(e, page)}
        >
          {page}
        </a>
      ))}

      <a href="#" style={styleLinkRight} onClick={handleNext}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </a>
    </nav>
  );
}