import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import UsecaseLibraryPage from './pages/UsecaseLibraryPage';
import UseCaseDetailPage from './pages/UseCaseDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-paper">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/usecases" element={<UsecaseLibraryPage />} />
            <Route path="/use-case/:slug" element={<UseCaseDetailPage />} />
            {/* Legacy redirect: any stray /use-cases (plural path) */}
            <Route path="/use-cases" element={<Navigate to="/usecases" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
