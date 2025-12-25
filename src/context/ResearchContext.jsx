import { createContext, useState, useContext, useEffect } from 'react';

const ResearchContext = createContext(null);

const API_URL = '/api/papers';

export const ResearchProvider = ({ children }) => {
    const [papers, setPapers] = useState([]);

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

    useEffect(() => {
        fetchPapers();
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

    return (
        <ResearchContext.Provider value={{ papers, addPaper, deletePaper }}>
            {children}
        </ResearchContext.Provider>
    );
};

export const useResearch = () => useContext(ResearchContext);
