import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleAdmin = () => {
        setIsAdmin(prev => !prev);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, toggleAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
