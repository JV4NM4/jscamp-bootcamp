export function NotFound() {
  return (
    <main className="not-found" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary-light)', justifyContent: 'center' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Página no encontrada</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>La página que buscas no existe.</p>
      <a href="/" style={{ background: '#09f', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', color: 'white', textDecoration: 'none' }}>
        Volver al inicio
      </a>
    </main>
  )
}