import { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import { useAuth } from '../context/AuthContext';
import ExpandedPost from './ExpandedPost';

const TopicPage = ({ title, category }) => {
    const { papers, deletePaper } = useResearch();
    const { isAdmin } = useAuth();
    const [expandedPaperId, setExpandedPaperId] = useState(null);

    const filteredPapers = category === 'all disciplines'
        ? papers
        : papers.filter(p => p.topic === category);

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
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
                Explore the latest research, papers, and discussions in {category}.
            </p>

            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {filteredPapers.map((paper) => (
                    <div
                        key={paper.id}
                        className="glass-panel"
                        style={{ padding: '1.5rem', minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => setExpandedPaperId(paper.id)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ width: '100%', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}></div>
                        <h3 style={{ fontSize: '1.2rem' }}>{paper.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{paper.abstract}</p>

                        {isAdmin && (
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePaper(paper.id);
                                    }}
                                    style={{
                                        color: '#ef4444',
                                        fontSize: '0.9rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.25rem',
                                        border: '1px solid rgba(239, 68, 68, 0.3)'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {filteredPapers.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>No research found for this topic.</p>
                )}
            </div>
        </div>
    );
};

export default TopicPage;
