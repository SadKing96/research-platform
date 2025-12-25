import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TopicPage from './components/TopicPage';

import Publish from './components/Publish';

import { AuthProvider } from './context/AuthContext';
import { ResearchProvider } from './context/ResearchContext';
import Library from './components/Library';
import AdminDashboard from './components/AdminDashboard'; // Import new component

function App() {
  return (
    <AuthProvider>
      <ResearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<TopicPage title="Discover" category="all disciplines" />} />
              <Route path="history" element={<TopicPage title="History" category="history" />} />
              <Route path="physics" element={<TopicPage title="Physics" category="physics" />} />
              <Route path="philosophy" element={<TopicPage title="Philosophy" category="philosophy" />} />
              <Route path="tech" element={<TopicPage title="Technology" category="technology" />} />
              <Route path="library" element={<Library />} />
              <Route path="publish" element={<Publish />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ResearchProvider>
    </AuthProvider>
  );
}

export default App;
