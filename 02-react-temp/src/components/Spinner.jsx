export function Spinner() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '4rem' 
    }}>
      <style>{`
        .spinner-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--primary, #09f);
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="spinner-circle" aria-label="Cargando empleos"></div>
      
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
        Cargando empleos...
      </p>
    </div>
  );
}