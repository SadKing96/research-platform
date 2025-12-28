import { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import { useAuth } from '../context/AuthContext';
import ExpandedPost from './ExpandedPost';

const TopicPage = ({ title, category }) => {
    const { papers, deletePaper, settings } = useResearch();
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

    // Metrics Display Logic
    const isHome = title === 'Discover';
    const metrics = isHome ? {
        sourcesWithFallback: settings?.home_metric_sources_cited || '0',
        wordsWithFallback: settings?.home_metric_words_written || '0',
        papersCount: settings?.home_metric_papers_count || papers.length,
        authors: settings?.home_metric_most_cited_authors ? settings.home_metric_most_cited_authors.split(',').map(s => s.trim()) : [],
        theories: settings?.home_metric_most_referenced_theories ? settings.home_metric_most_referenced_theories.split(',').map(s => s.trim()) : [],
        diversity: settings?.home_metric_citation_diversity || 'N/A',
        influence: settings?.home_metric_primary_influence ? settings.home_metric_primary_influence.split(',').map(s => {
            const [label, val] = s.split(':');
            return { label: label?.trim(), value: val?.trim() };
        }) : []
    } : null;

    return (
        <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
                Explore the latest research, papers, and discussions in {category}.
            </p>

            {isHome && (
                <div style={{ marginTop: '3rem', marginBottom: '4rem' }}>

                    {/* Key Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Sources Cited</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(to right, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {metrics.sourcesWithFallback}
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Words Written</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {parseInt(metrics.wordsWithFallback).toLocaleString()}
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Papers</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(to right, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {metrics.papersCount}
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(236, 72, 153, 0.1))' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Citation Diversity</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(to right, #f59e0b, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {metrics.diversity}
                            </div>
                        </div>
                    </div>

                    {/* Deep Dive Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                        {/* Most Cited Authors */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span>
                                Most Cited Authors
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {metrics.authors.length > 0 ? metrics.authors.map((author, i) => (
                                    <span key={i} style={{
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(139, 92, 246, 0.15)',
                                        color: '#e2e8f0',
                                        borderRadius: '2rem',
                                        fontSize: '0.9rem',
                                        border: '1px solid rgba(139, 92, 246, 0.3)'
                                    }}>
                                        {author}
                                    </span>
                                )) : <span style={{ color: 'var(--text-secondary)' }}>No data available</span>}
                            </div>
                        </div>

                        {/* Most Referenced Theories */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }}></span>
                                Key Theories
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {metrics.theories.length > 0 ? metrics.theories.map((theory, i) => (
                                    <span key={i} style={{
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(236, 72, 153, 0.15)',
                                        color: '#e2e8f0',
                                        borderRadius: '2rem',
                                        fontSize: '0.9rem',
                                        border: '1px solid rgba(236, 72, 153, 0.3)'
                                    }}>
                                        {theory}
                                    </span>
                                )) : <span style={{ color: 'var(--text-secondary)' }}>No data available</span>}
                            </div>
                        </div>

                        {/* Influence Breakdown */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></span>
                                Primary Influences
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {metrics.influence.length > 0 ? metrics.influence.map((item, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                            <span>{item.label}</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>{item.value}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${item.value}%`,
                                                height: '100%',
                                                background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ec4899',
                                                borderRadius: '3px'
                                            }}></div>
                                        </div>
                                    </div>
                                )) : <span style={{ color: 'var(--text-secondary)' }}>No data available</span>}
                            </div>
                        </div>


                    </div>
                </div>
            )}

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
                    <p style={{ color: 'var(--text-secondary)' }}>{settings?.no_posts_text || 'No research found for this topic.'}</p>
                )}
            </div>
        </div >
    );
};

export default TopicPage;
