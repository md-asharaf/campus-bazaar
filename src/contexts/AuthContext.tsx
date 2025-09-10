import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    registrationNumber?: string;
    branch?: string;
    year?: string;
    verified: boolean;
    profileComplete: boolean;
    verificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: any) => void;
    logout: () => void;
    updateProfile: (profileData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = (userData: any) => {
        const newUser: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            registrationNumber: userData.registrationNumber,
            branch: userData.branch,
            year: userData.year,
            verified: userData.verified || false,
            profileComplete: userData.profileComplete || false,
            verificationStatus: userData.verificationStatus || 'none'
        };
        
        setUser(newUser);
        localStorage.setItem('campusBazaarUser', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('campusBazaarUser');
    };

    const updateProfile = (profileData: any) => {
        if (user) {
            const updatedUser = { ...user, ...profileData };
            setUser(updatedUser);
            localStorage.setItem('campusBazaarUser', JSON.stringify(updatedUser));
        }
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('campusBazaarUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('campusBazaarUser');
            }
        }
    }, []);

    const value = {
        user,
        isLoading,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};