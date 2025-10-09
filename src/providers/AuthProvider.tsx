import type { User } from "@/types";
import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { logout as signout } from "@/queries/auth";
import { getMe } from "@/queries/profile";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const fetched = useRef(false);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        (async () => {
            try {
                const res = await getMe();
                setUser(res?.data?.user || null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = useCallback((user: User) => {
        setUser(user);
    }, []);

    const logout = useCallback(async () => {
        await signout();
        setUser(null);
    }, []);

    const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}