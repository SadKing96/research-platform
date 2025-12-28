import { useResearch } from '../context/ResearchContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const {
        papers,
        deletePaper,
        sections,
        addSection,
        deleteSection,
        settings,
        updateSetting,
        books,
        addBook,
        deleteBook
    } = useResearch();
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    // Metrics Logic
    const [metricsData, setMetricsData] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [metricsError, setMetricsError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/metrics');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch metrics');
                }

                if (data && data.viewer && data.viewer.zones && data.viewer.zones[0]) {
                    const groups = data.viewer.zones[0].httpRequests1dGroups;
                    let totalPageViews = 0;
                    let totalUnique = 0;

                    groups.forEach(g => {
                        totalPageViews += g.sum.pageViews;
                        totalUnique += g.sum.uniqueVisitors;
                    });

                    setMetricsData({
                        pageViews: totalPageViews,
                        uniqueVisitors: totalUnique
                    });
                }
            } catch (error) {
                console.error("Failed to fetch metrics", error);
                setMetricsError(error.message);
            } finally {
                setLoadingMetrics(false);
            }
        };
        fetchMetrics();
    }, []);

    const metrics = [
        {
            label: 'Total Visits (7d)',
            value: loadingMetrics ? '...' : metricsError ? 'Error' : (metricsData?.pageViews?.toLocaleString() || '0'),
            change: loadingMetrics ? '' : metricsError ? '' : '+12%',
            color: '#8b5cf6'
        },
        {
            label: 'Unique Visitors (7d)',
            value: loadingMetrics ? '...' : metricsError ? 'Error' : (metricsData?.uniqueVisitors?.toLocaleString() || '0'),
            change: loadingMetrics ? '' : metricsError ? '' : '+5.4%',
            color: '#ec4899'
        },
        { label: 'Active Sessions', value: '450', change: '-2%', color: '#06b6d4' },
        { label: 'Total Papers', value: papers.length, change: '0%', color: '#10b981' },
    ];

    const trafficSources = [
        { label: 'Google Search', value: 45, color: '#8b5cf6' },
        { label: 'Direct', value: 25, color: '#ec4899' },
        { label: 'LinkedIn', value: 20, color: '#06b6d4' },
        { label: 'Twitter/X', value: 10, color: '#10b981' },
    ];

    // Content Management Logic
    const [newSection, setNewSection] = useState({ label: '', path: '', category: '' });
    const [localSettings, setLocalSettings] = useState({ no_posts_text: '' });

    // Book Management Logic
    const [newBook, setNewBook] = useState({ title: '', author: '', summary: '', recommendation: '', cover: null });
    const handleAddBook = (e) => {
        e.preventDefault();
        addBook(newBook);
        setNewBook({ title: '', author: '', summary: '', recommendation: '', cover: null });
        alert('Book added!');
    };

    useEffect(() => {
        if (settings) {
            setLocalSettings(prev => ({ ...prev, ...settings }));
        }
    }, [settings]);

    // Handle home metrics
    const handleUpdateHomeMetric = (key, value) => {
        updateSetting(key, value);
    };

    const handleAddSection = (e) => {
        e.preventDefault();
        // Path normalization: ensure starts with /
        const path = newSection.path.startsWith('/') ? newSection.path : '/' + newSection.path;
        addSection({ ...newSection, path });
        setNewSection({ label: '', path: '', category: '' });
    };

    const handleUpdateSetting = (key) => {
        updateSetting(key, localSettings[key]);
        alert('Settings saved');
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '3rem' }}>Admin Dashboard</h1>
                <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: activeTab === 'overview' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                            color: activeTab === 'overview' ? 'white' : 'var(--text-secondary)',
                            fontWeight: activeTab === 'overview' ? 600 : 400,
                            cursor: 'pointer'
                        }}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: activeTab === 'content' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                            color: activeTab === 'content' ? 'white' : 'var(--text-secondary)',
                            fontWeight: activeTab === 'content' ? 600 : 400,
                            cursor: 'pointer'
                        }}
                    >
                        Content Management
                    </button>
                    <button
                        onClick={() => setActiveTab('books')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: activeTab === 'books' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                            color: activeTab === 'books' ? 'white' : 'var(--text-secondary)',
                            fontWeight: activeTab === 'books' ? 600 : 400,
                            cursor: 'pointer'
                        }}
                    >
                        Book List
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Metrics Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        {metrics.map((metric, index) => (
                            <div key={index} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{metric.label}</span>
                                <div style={{ display: 'flex', alignItems: 'end', gap: '1rem' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>{metric.value}</span>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: metric.change.startsWith('+') ? '#10b981' : metric.change.startsWith('-') ? '#ef4444' : 'var(--text-secondary)',
                                        marginBottom: '6px'
                                    }}>
                                        {metric.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                        {/* Database Table */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Database Management</h2>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>ID</th>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>Title</th>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>Topic</th>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>Date</th>
                                            <th style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {papers.map((paper) => (
                                            <tr key={paper.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '1rem 0.5rem', opacity: 0.7 }}>#{paper.id}</td>
                                                <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{paper.title}</td>
                                                <td style={{ padding: '1rem 0.5rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '1rem',
                                                        background: 'rgba(255,255,255,0.1)',
                                                        fontSize: '0.8rem',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {paper.topic}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 0.5rem', opacity: 0.7 }}>{paper.date}</td>
                                                <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to delete this paper?')) {
                                                                deletePaper(paper.id);
                                                            }
                                                        }}
                                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Traffic Chart */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Traffic Sources</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {trafficSources.map((source, index) => (
                                    <div key={index}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                            <span>{source.label}</span>
                                            <span>{source.value}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${source.value}%`,
                                                height: '100%',
                                                background: source.color,
                                                borderRadius: '4px',
                                                transition: 'width 1s ease-out'
                                            }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'content' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>

                    {/* Add Section Form */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Add New Section</h2>
                        <form onSubmit={handleAddSection} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Label (Sidebar Name)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Biology"
                                    value={newSection.label}
                                    onChange={e => setNewSection({ ...newSection, label: e.target.value })}
                                    style={{
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--border-glass)',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Path (URL)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. /biology"
                                    value={newSection.path}
                                    onChange={e => setNewSection({ ...newSection, path: e.target.value })}
                                    style={{
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--border-glass)',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Category (Tech ID)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. biology"
                                    value={newSection.category}
                                    onChange={e => setNewSection({ ...newSection, category: e.target.value })}
                                    style={{
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--border-glass)',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Add Section</button>
                        </form>
                    </div>

                    {/* Manage Settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Existing Sections List */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Manage Sections</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {sections.map(section => (
                                    <div key={section.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '0.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontWeight: 600 }}>{section.label}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{section.path}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Delete ${section.label}?`)) deleteSection(section.id);
                                            }}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* General Settings */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Empty State Text</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Message when no posts found</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        value={localSettings.no_posts_text || ''}
                                        onChange={e => setLocalSettings({ ...localSettings, no_posts_text: e.target.value })}
                                        style={{
                                            flex: 1,
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid var(--border-glass)',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            color: 'white',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        onClick={() => handleUpdateSetting('no_posts_text')}
                                        className="btn-primary"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Home Metrics Settings */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Home Section Metrics</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>Quantitative Metrics</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Sources Cited</label>
                                        <input
                                            type="number"
                                            value={localSettings.home_metric_sources_cited || ''}
                                            onChange={e => {
                                                setLocalSettings(prev => ({ ...prev, home_metric_sources_cited: e.target.value }));
                                                handleUpdateHomeMetric('home_metric_sources_cited', e.target.value);
                                            }}
                                            placeholder="e.g. 150"
                                            style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid var(--border-glass)',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Words Written</label>
                                        <input
                                            type="number"
                                            value={localSettings.home_metric_words_written || ''}
                                            onChange={e => {
                                                setLocalSettings(prev => ({ ...prev, home_metric_words_written: e.target.value }));
                                                handleUpdateHomeMetric('home_metric_words_written', e.target.value);
                                            }}
                                            placeholder="e.g. 50000"
                                            style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid var(--border-glass)',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Papers (Manual Override)</label>
                                        <input
                                            type="number"
                                            value={localSettings.home_metric_papers_count || ''}
                                            onChange={e => {
                                                setLocalSettings(prev => ({ ...prev, home_metric_papers_count: e.target.value }));
                                                handleUpdateHomeMetric('home_metric_papers_count', e.target.value);
                                            }}
                                            placeholder="Leave empty to use actual count"
                                            style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid var(--border-glass)',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>Qualitative Metrics</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Most Cited Authors (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={localSettings.home_metric_most_cited_authors || ''}
                                            onChange={e => {
                                                setLocalSettings(prev => ({ ...prev, home_metric_most_cited_authors: e.target.value }));
                                                handleUpdateHomeMetric('home_metric_most_cited_authors', e.target.value);
                                            }}
                                            placeholder="e.g. Foucault, Haraway, Fisher"
                                            style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid var(--border-glass)',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Most Referenced Theories</label>
                                        <input
                                            type="text"
                                            value={localSettings.home_metric_most_referenced_theories || ''}
                                            onChange={e => {
                                                setLocalSettings(prev => ({ ...prev, home_metric_most_referenced_theories: e.target.value }));
                                                handleUpdateHomeMetric('home_metric_most_referenced_theories', e.target.value);
                                            }}
                                            placeholder="e.g. Critical Theory, Post-humanism"
                                            style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid var(--border-glass)',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Citation Diversity Score</label>
                                        <input
                                            type="text"
                                            value={localSettings.home_metric_citation_diversity || ''}
                                            onChange={e => {
                                                setLocalSettings(prev => ({ ...prev, home_metric_citation_diversity: e.target.value }));
                                                handleUpdateHomeMetric('home_metric_citation_diversity', e.target.value);
                                            }}
                                            placeholder="e.g. 8.5/10"
                                            style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid var(--border-glass)',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Primary Influence (Format: Label:%, Label:%)</label>
                                        <input
                                            type="text"
                                            value={localSettings.home_metric_primary_influence || ''}
                                            onChange={e => {
                                                setLocalSettings(prev => ({ ...prev, home_metric_primary_influence: e.target.value }));
                                                handleUpdateHomeMetric('home_metric_primary_influence', e.target.value);
                                            }}
                                            placeholder="e.g. Books:40, Papers:30, Lived:30"
                                            style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid var(--border-glass)',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {activeTab === 'books' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
                    {/* Add Book Form */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Add New Book</h2>
                        <form onSubmit={handleAddBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newBook.title}
                                    onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Author</label>
                                <input
                                    type="text"
                                    required
                                    value={newBook.author}
                                    onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Cover Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setNewBook({ ...newBook, cover: e.target.files[0] })}
                                    style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Summary</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={newBook.summary}
                                    onChange={e => setNewBook({ ...newBook, summary: e.target.value })}
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white', outline: 'none', resize: 'vertical' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Why I Suggest It</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={newBook.recommendation}
                                    onChange={e => setNewBook({ ...newBook, recommendation: e.target.value })}
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white', outline: 'none', resize: 'vertical' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Add Book</button>
                        </form>
                    </div>

                    {/* Books List & Delete */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Manage Books</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {books.map(book => (
                                <div key={book.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '0.5rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {book.cover && <img src={`http://localhost:3001/uploads/${book.cover}`} alt={book.title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />}
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600 }}>{book.title}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{book.author}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Delete ${book.title}?`)) deleteBook(book.id);
                                        }}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default AdminDashboard;
