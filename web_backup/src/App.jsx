import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ConferencePage from './pages/ConferencePage';
import SalesPage from './pages/SalesPage';

function App() {
  return (
    <InventoryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agua" element={<CategoryPage />} />
          <Route path="/sorvete" element={<CategoryPage />} />
          <Route path="/conferencia" element={<ConferencePage />} />
          <Route path="/vendas" element={<SalesPage />} />
        </Routes>
      </Router>
    </InventoryProvider>
  );
}

export default App;
