import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedToken = Cookies.get('accessToken');
        if (storedToken) {
            setToken(storedToken);
            fetchUserData(storedToken);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            logout();
        }
    };

    const login = async (newToken, newData) => {
        Cookies.set('accessToken', newToken, { expires: 7 });
        setToken(newToken);
        setUserData(newData);
        setIsAuthenticated(true);
        
    };

    const logout = () => {
        Cookies.remove('accessToken');
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, userData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { AuthProvider };