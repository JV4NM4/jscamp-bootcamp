import { useLocation, useNavigate } from 'react-router';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  /* Cambiamos el contrato del return para que sea más completo */
  return {
    currentPath: location.pathname,
    navigateTo: navigate,
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
    isActive: (path) => location.pathname === path,
    queryParams: Object.fromEntries(new URLSearchParams(location.search).entries()),
  };
}