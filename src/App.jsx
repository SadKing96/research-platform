import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TopicPage from './components/TopicPage';

import Publish from './components/Publish';

import { AuthProvider } from './context/AuthContext';
import { ResearchProvider } from './context/ResearchContext';
import Library from './components/Library';
import AdminDashboard from './components/AdminDashboard'; // Import new component

import { useResearch } from './context/ResearchContext';

const AppContent = () => {
  const { sections } = useResearch();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TopicPage title="Discover" category="all disciplines" />} />

        {sections.map(section => (
          <Route
            key={section.id}
            path={section.path.startsWith('/') ? section.path.substring(1) : section.path}
            element={<TopicPage title={section.label} category={section.category} />}
          />
        ))}

        <Route path="library" element={<Library />} />
        <Route path="publish" element={<Publish />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ResearchProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ResearchProvider>
    </AuthProvider>
  );
}

export default App;
