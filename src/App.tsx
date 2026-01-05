import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudentsList } from './pages/StudentsList';
import { Financial } from './pages/Financial';
import { AnamnesisForm } from './pages/AnamnesisForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/anamnese/:token" element={<AnamnesisForm />} />

        {/* Protected/App Routes (Wrapped in Layout) */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/alunos" element={<Layout><StudentsList /></Layout>} />
        <Route path="/financeiro" element={<Layout><Financial /></Layout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
