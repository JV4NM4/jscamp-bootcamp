import { Link, NavLink, useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore.js';
import { useFavoritesStore } from '../store/favoritesStore.js';

export function Header () { 
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const favorites = useFavoritesStore(state => state.favorites);

  const clearFavorites = useFavoritesStore(state => state.clearFavorites);

  const handleLogout = () => {
    logout();
    clearFavorites();
    navigate('/'); 
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? 'nav-link active' : 'nav-link';
  };

  return (
   <header>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            DevJobs
        </h1>
      </Link>

      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <NavLink to="/" className={getNavLinkClass}>Inicio</NavLink>
        <NavLink to="/search" className={getNavLinkClass}>Empleos</NavLink>
        <NavLink to="/contact" className={getNavLinkClass}>Contacto</NavLink>
        {isLoggedIn && (
          <NavLink to="/profile" className={getNavLinkClass}>Mi perfil</NavLink>
        )}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
            <span>❤️</span>
            <span style={{ fontWeight: 'bold' }}>{favorites?.length || 0}</span>
          </div>
        )}

        {isLoggedIn ? (
          <button onClick={handleLogout}>Cerrar sesión</button>
        ) : (
          <button onClick={() => navigate('/login')}>Iniciar sesión</button>
        )}
      </div>
    </header>
  );
}