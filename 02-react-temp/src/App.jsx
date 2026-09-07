import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { NotFound } from './pages/NotFound';
import { Route } from './components/Route';
import { useRouter } from './hooks/useRouter';
import { Contact } from './pages/Contact';

export default function App() {
  const { currentPath } = useRouter();
  
  const isNotFound = currentPath !== '/' && currentPath !== '/search' && currentPath !== '/contact';

  return (
    <div className="app">
      <Header />
      
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      {isNotFound && <NotFound />}
      <Route path="/contact" component={Contact} />
      <Footer />
    </div>
  );
}