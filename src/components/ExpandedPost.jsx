const ExpandedPost = ({ paper, onClose }) => {
    if (!paper) return null;

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <button
                onClick={onClose}
                style={{
                    marginBottom: '1rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}
                className="hover-text"
            >
                ← Back to Feed
            </button>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{paper.title}</h1>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <span style={{ textTransform: 'capitalize' }}>{paper.topic}</span>
                <span>•</span>
                <span>{paper.date}</span>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Abstract</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--text-primary)' }}>
                    {paper.abstract}
                </p>
            </div>

            {(paper.type === 'PDF' || paper.file) && (
                <div className="glass-panel" style={{ padding: '1rem', height: '800px' }}>
                    <iframe
                        src={`http://localhost:3001/uploads/${paper.file}`}
                        width="100%"
                        height="100%"
                        style={{ border: 'none', borderRadius: '0.5rem', background: 'white' }}
                        title="PDF Preview"
                    />
                </div>
            )}

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-text:hover {
            color: var(--accent-primary) !important;
        }
      `}</style>
        </div>
    );
};

export default ExpandedPost;
