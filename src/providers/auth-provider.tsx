import type { User, ApiResponse } from "@/types";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { logout as signout } from "@/services/auth.service";
import { getMe } from "@/services/profile.service";

import { AuthContext } from "@/contexts/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const fetched = useRef(false);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        // Capture access token from URL and temporarily attach Authorization header (without assuming cookie names)

        try {
            const url = new URL(window.location.href);
            const at = url.searchParams.get('accessToken');
            const rt = url.searchParams.get('refreshToken');
            // Clean tokens from URL while preserving other params
            if (at || rt) {
                url.searchParams.delete('accessToken');
                url.searchParams.delete('refreshToken');
                const newUrl = url.pathname + (url.search ? url.search : '') + url.hash;
                window.history.replaceState({}, '', newUrl);
            }
        } catch (error) {
            console.error('Failed to parse URL:', error);
        }
        (async () => {
            try {
                const res: ApiResponse<{ user: User }> = await getMe();
                if (res?.data?.user) {
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setUser(null);
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