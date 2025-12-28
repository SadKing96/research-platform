import { useState } from 'react';
import { useResearch } from '../context/ResearchContext';

const ReadingList = () => {
    const { books } = useResearch();
    const [selectedBook, setSelectedBook] = useState(null);

    return (
        <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Reading List</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6', marginBottom: '3rem' }}>
                A curated collection of books that have influenced my research and thinking.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {books.map(book => (
                    <div
                        key={book.id}
                        className="glass-panel"
                        style={{
                            padding: '1rem',
                            display: 'flex',
                            gap: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-glass)'
                        }}
                        onClick={() => setSelectedBook(book)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            width: '80px',
                            height: '120px',
                            background: book.cover ? `url(http://localhost:3001/uploads/${book.cover}) center/cover no-repeat` : 'rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            flexShrink: 0
                        }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <h3 style={{ fontSize: '1.1rem', lineHeight: '1.3' }}>{book.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{book.author}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Book Detail Modal */}
            {selectedBook && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem'
                }} onClick={() => setSelectedBook(null)}>
                    <div
                        className="glass-panel"
                        style={{
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            padding: '2.5rem',
                            position: 'relative',
                            display: 'grid',
                            gridTemplateColumns: '200px 1fr',
                            gap: '2.5rem',
                            background: '#1a1a1a',
                            animation: 'fadeIn 0.2s ease-out'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedBook(null)}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                fontSize: '1.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>

                        <div>
                            <div style={{
                                width: '100%',
                                height: '300px',
                                background: selectedBook.cover ? `url(http://localhost:3001/uploads/${selectedBook.cover}) center/cover no-repeat` : 'rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: '1.1' }}>{selectedBook.title}</h2>
                                <p style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{selectedBook.author}</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Summary</h3>
                                <p style={{ lineHeight: '1.7', color: '#d1d5db' }}>{selectedBook.summary}</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(139, 92, 246, 0.1)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                <h3 style={{ fontSize: '1.1rem', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    My Recommendation
                                </h3>
                                <p style={{ lineHeight: '1.7', color: 'white', fontStyle: 'italic' }}>"{selectedBook.recommendation}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ReadingList;
