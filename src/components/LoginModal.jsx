import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
    const [password, setPassword] = useState('');
    const { toggleAdmin } = useAuth();
    const [error, setError] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'admin123') { // Simple mock password
            toggleAdmin();
            onClose();
            setPassword('');
            setError(false);
        } else {
            setError(true);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div
                className="glass-panel"
                style={{ padding: '2rem', width: '300px', border: '1px solid var(--border-glass)' }}
                onClick={e => e.stopPropagation()}
            >
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Access</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border-glass)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    {error && <span style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>Incorrect password</span>}
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
