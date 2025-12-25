import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResearch } from '../context/ResearchContext';

const Publish = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { addPaper, sections } = useResearch();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    // Use first section as default if available
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        topic: sections.length > 0 ? sections[0].category : '',
        file: null
    });

    // Update default topic when sections load
    useEffect(() => {
        if (sections.length > 0 && !formData.topic) {
            setFormData(prev => ({ ...prev, topic: sections[0].category }));
        }
    }, [sections]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Pass raw data, context handles FormData
        const newPaper = {
            title: formData.title,
            topic: formData.topic,
            abstract: formData.abstract,
            file: formData.file, // Pass the File object
        };

        addPaper(newPaper);
        alert('Research published successfully!');
        navigate('/');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Publish Research</h1>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Title</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter research title"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border-glass)',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Topic</label>
                    <select
                        value={formData.topic}
                        onChange={e => setFormData({ ...formData, topic: e.target.value })}
                        style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border-glass)',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {sections.map(section => (
                            <option key={section.id} value={section.category}>{section.label}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Abstract</label>
                    <textarea
                        required
                        rows="6"
                        placeholder="Summarize your research..."
                        value={formData.abstract}
                        onChange={e => setFormData({ ...formData, abstract: e.target.value })}
                        style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border-glass)',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontSize: '1rem',
                            fontFamily: 'var(--font-sans)',
                            resize: 'vertical',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Upload PDF</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
                        style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border-glass)',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ paddingTop: '1rem' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
                        Publish Paper
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Publish;
