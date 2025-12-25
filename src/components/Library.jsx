import { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import ExpandedPost from './ExpandedPost';

const Library = () => {
    const { papers } = useResearch();
    const [expandedPaperId, setExpandedPaperId] = useState(null);
    const documents = papers.filter(p => p.type === 'PDF');

    const expandedPaper = expandedPaperId ? papers.find(p => p.id === expandedPaperId) : null;

    if (expandedPaperId && expandedPaper) {
        return (
            <ExpandedPost
                paper={expandedPaper}
                onClose={() => setExpandedPaperId(null)}
            />
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Library</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>
                Access your collection of uploaded research papers and documents.
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {documents.map((doc) => (
                    <div key={doc.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontWeight: 700 }}>
                                PDF
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{doc.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{doc.date} • {doc.size || '1.2 MB'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setExpandedPaperId(doc.id)}
                                style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', border: 'none', cursor: 'pointer' }}
                            >
                                View
                            </button>
                            <a
                                href={`http://localhost:3001/uploads/${doc.file}`}
                                download
                                target="_blank"
                                rel="noreferrer"
                                style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'var(--text-primary)', transition: 'all 0.2s', display: 'inline-block' }}
                            >
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
