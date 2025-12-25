import { createContext, useState, useContext, useEffect } from 'react';

const ResearchContext = createContext(null);

const API_URL = '/api/papers';

export const ResearchProvider = ({ children }) => {
    const [papers, setPapers] = useState([]);
    const [sections, setSections] = useState([]);
    const [settings, setSettings] = useState({
        no_posts_text: 'No research found for this topic.'
    });

    const fetchPapers = async () => {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                setPapers(data);
            }
        } catch (error) {
            console.error('Error fetching papers:', error);
        }
    };

    const fetchSections = async () => {
        try {
            const response = await fetch('/api/sections');
            if (response.ok) {
                const data = await response.json();
                setSections(data);
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            if (response.ok) {
                const data = await response.json();
                // Merge with defaults in case of missing keys
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    useEffect(() => {
        fetchPapers();
        fetchSections();
        fetchSettings();
    }, []);

    const addPaper = async (paperData) => {
        try {
            const formData = new FormData();
            formData.append('title', paperData.title);
            formData.append('topic', paperData.topic);
            formData.append('abstract', paperData.abstract);
            formData.append('date', new Date().toISOString().split('T')[0]);

            if (paperData.file) {
                formData.append('file', paperData.file);
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                fetchPapers(); // Refresh list
            }
        } catch (error) {
            console.error('Error adding paper:', error);
        }
    };

    const deletePaper = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            setPapers(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting paper:', error);
        }
    };

    const addSection = async (section) => {
        try {
            const response = await fetch('/api/sections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(section)
            });
            if (response.ok) {
                fetchSections();
            }
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    const deleteSection = async (id) => {
        try {
            const response = await fetch(`/api/sections/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setSections(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const updateSetting = async (key, value) => {
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });
            if (response.ok) {
                setSettings(prev => ({ ...prev, [key]: value }));
            }
        } catch (error) {
            console.error('Error updating setting:', error);
        }
    };

    return (
        <ResearchContext.Provider value={{
            papers,
            sections,
            settings,
            addPaper,
            deletePaper,
            addSection,
            deleteSection,
            updateSetting
        }}>
            {children}
        </ResearchContext.Provider>
    );
};

export const useResearch = () => useContext(ResearchContext);
