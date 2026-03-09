import { BrowserRouter as Router, useLocation } from 'react-router';
import Sidebar from './components/layout/Sidebar';
import AppRoutes from './app.routes';
import { useDispatch, useSelector } from 'react-redux';
import { hydrateAuth, refreshUser } from './features/auth/authSlice';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Separate component for scroll management to access useLocation
function ScrollManager({ lenisRef }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, lenisRef]);

  return null;
}

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector(state => state.theme);
  const { isAuthenticated } = useSelector(state => state.auth);
  const lenisRef = useRef(null);

  // Initialize smooth scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Hydrate auth from localStorage on first load
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  // After hydrating, immediately sync with the server
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(refreshUser());
    }
  }, [dispatch, isAuthenticated]);

  // Theme support
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [mode]);

  return (
    <Router>
      <ScrollManager lenisRef={lenisRef} />
      <div className="min-h-screen bg-background text-textMain flex flex-col md:flex-row mesh-bg overflow-x-hidden w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 md:ml-64 mt-14 md:mt-0 mb-14 md:mb-0 p-4 md:p-8 transition-all duration-300 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full overflow-x-hidden">
            <AppRoutes />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
