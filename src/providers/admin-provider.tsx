import type {AdminAuthContextType } from "@/contexts/admin-context";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { AdminAuthContext } from "@/contexts/admin-context";
import { adminLogout } from "@/services/auth.service";
import type { Admin, ApiResponse } from "@/types";
import { adminService } from "@/services";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const fetched = useRef(false);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        (async () => {
            try {
                const res: ApiResponse<{ admin: Admin }> = await adminService.getMe();
                if (res?.data?.admin) {
                    setAdmin(res.data.admin);
                } else {
                    setAdmin(null);
                }
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = useCallback((adminUser: Admin) => {
        setAdmin(adminUser);
        // Store admin data for persistence
        localStorage.setItem('adminData', JSON.stringify(adminUser));
    }, []);

    const logout = useCallback(async () => {
        try {
            await adminLogout();
        } catch (error) {
            console.error('Admin logout error:', error);
        } finally {
            setAdmin(null);
        }
    }, []);

    const value = useMemo((): AdminAuthContextType => ({
        admin,
        loading,
        login,
        logout,
    }), [admin, loading, login, logout]);

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
}