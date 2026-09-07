import { useRouter } from '../hooks/useRouter';

export function Link({ 
  href, 
  children, 
  className = '', 
  activeClassName = 'active', 
  exact = true, 
  ...props 
}) {
  const { currentPath } = useRouter();

  const handleClick = (event) => {
    event.preventDefault();
    
    window.history.pushState({}, '', href);
    
    const navigationEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navigationEvent);
  };

  const isActive = exact 
    ? currentPath === href 
    : currentPath.startsWith(href);

  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a 
      href={href} 
      onClick={handleClick} 
      className={combinedClassName}
      aria-current={isActive ? 'page' : undefined} 
      {...props}
    >
      {children}
    </a>
  );
}