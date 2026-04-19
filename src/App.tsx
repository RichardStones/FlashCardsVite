import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import LearningPage from './pages/LearningPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/collection/:id" element={<CollectionPage />} />
      <Route path="/collection/:id/learn" element={<LearningPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
