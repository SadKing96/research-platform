import { useResearch } from '../context/ResearchContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const { papers, deletePaper } = useResearch();
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const [metricsData, setMetricsData] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/metrics');
                const data = await response.json();

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
            } finally {
                setLoadingMetrics(false);
            }
        };
        fetchMetrics();
    }, []);

    // Derived Metrics
    const metrics = [
        {
            label: 'Total Visits (7d)',
            value: loadingMetrics ? '...' : (metricsData?.pageViews?.toLocaleString() || '0'),
            change: loadingMetrics ? '' : '+12%', // trends hard to calc without prev period
            color: '#8b5cf6'
        },
        {
            label: 'Unique Visitors (7d)',
            value: loadingMetrics ? '...' : (metricsData?.uniqueVisitors?.toLocaleString() || '0'),
            change: loadingMetrics ? '' : '+5.4%',
            color: '#ec4899'
        },
        { label: 'Active Sessions', value: '450', change: '-2%', color: '#06b6d4' }, // Mocked
        { label: 'Total Papers', value: papers.length, change: '0%', color: '#10b981' },
    ];

    const trafficSources = [
        { label: 'Google Search', value: 45, color: '#8b5cf6' },
        { label: 'Direct', value: 25, color: '#ec4899' },
        { label: 'LinkedIn', value: 20, color: '#06b6d4' },
        { label: 'Twitter/X', value: 10, color: '#10b981' },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Admin Dashboard</h1>

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
