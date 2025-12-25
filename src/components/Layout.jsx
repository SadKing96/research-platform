import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import LoginModal from './LoginModal';

const Layout = () => {
    const navigate = useNavigate();
    const { isAdmin, toggleAdmin } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/history', label: 'History' },
        { path: '/physics', label: 'Physics' },
        { path: '/philosophy', label: 'Philosophy' },
        { path: '/tech', label: 'Tech' },
        { path: '/library', label: 'Library' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside
                className="glass-panel"
                style={{
                    width: '260px',
                    margin: '1rem',
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    height: 'calc(100vh - 2rem)',
                    position: 'sticky',
                    top: '1rem'
                }}
            >
                <div style={{ paddingLeft: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        KING
                    </h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                padding: '0.75rem 1rem',
                                borderRadius: '0.75rem',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                fontWeight: isActive ? 600 : 400,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none'
                            })}
                        >
                            {item.label}
                        </NavLink>
                    ))}

                    {isAdmin && (
                        <>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}></div>

                            <NavLink
                                to="/publish"
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.75rem',
                                    background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                                    color: 'white',
                                    fontWeight: 600,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textDecoration: 'none'
                                }}
                            >
                                <span>+</span> New Research
                            </NavLink>

                            <NavLink
                                to="/admin"
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                style={({ isActive }) => ({
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.75rem',
                                    color: isActive ? 'white' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                    fontWeight: isActive ? 600 : 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    transition: 'all 0.2s ease',
                                    textDecoration: 'none'
                                })}
                            >
                                Dashboard
                            </NavLink>
                        </>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '1rem 2rem 1rem 0' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '80px' }}>
                    <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {isAdmin && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRight: '1px solid var(--border-glass)', paddingRight: '1rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                                    Admin Mode
                                </span>
                                <button onClick={toggleAdmin} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                                    Logout
                                </button>
                            </div>
                        )}
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                            onClick={() => !isAdmin && setIsLoginOpen(true)}
                        >
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #8b5cf6, #06b6d4)' }}></div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Researcher</span>
                        </div>
                    </div>
                </header>

                <div style={{ paddingBottom: '2rem' }}>
                    <Outlet />
                </div>
            </main >
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div >
    );
};

export default Layout;
