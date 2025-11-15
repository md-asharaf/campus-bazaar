import userInstance from "@/lib/axios-user"
import adminInstance from "@/lib/axios-admin"
import Cookies from "js-cookie"

// Types
type RegisterData = {
    email: string;
    bio?: string | null;
    phone?: string | null;
    registrationNo: string;
    branch: string;
    year: number;
}

type AdminLoginData = {
    email: string;
}

type AdminVerifyLoginData = {
    email: string;
    otp: string;
}

// User Auth Services
const register = async (data: RegisterData) => {
    const response = await userInstance.post(`/auth/users/register`, data);
    const at = response?.data?.data?.accessToken ?? response?.data?.accessToken;
    const rt = response?.data?.data?.refreshToken ?? response?.data?.refreshToken;

    if (at) {
        Cookies.set('user_accessToken', at, { path: '/', sameSite: 'lax', secure: true, expires: 1 / (24 * 4) }); // ~15 minutes
        // Authorization header is set by axios interceptor
    }
    if (rt) {
        Cookies.set('user_refreshToken', rt, { path: '/', sameSite: 'lax', secure: true, expires: 7 }); // 7 days
    }

    return response.data;
}

const logout = async () => {
    const response = await userInstance.post(`/auth/users/logout`);
    Cookies.remove('user_accessToken', { path: '/' });
    Cookies.remove('user_refreshToken', { path: '/' });
// Legacy cookie cleanup removed; Authorization header handled by axios interceptors
    return response.data;
}

const refreshTokens = async () => {
    const response = await userInstance.post(`/auth/users/refresh-tokens`);
    return response.data;
}
const refreshUserTokens = async () => {
    const response = await userInstance.post(`/auth/users/refresh-tokens`);
    return response.data;
}
const refreshAdminTokens = async () => {
    const response = await adminInstance.post(`/auth/admins/refresh-tokens`);
    return response.data;
}

// Google Auth Services
const googleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/auth/users/google`;
}

const handleGoogleCallback = async (code: string) => {
    // Prefer tokens returned via frontend URL after backend redirect
    try {
        const url = new URL(window.location.href);
        const accessToken = url.searchParams.get('accessToken');
        const refreshToken = url.searchParams.get('refreshToken');
        if (accessToken) {
            // Persist tokens in frontend cookies
            Cookies.set('user_accessToken', accessToken, { path: '/', sameSite: 'lax', secure: true, expires: 1 / (24 * 4) });
            if (refreshToken) {
                Cookies.set('user_refreshToken', refreshToken, { path: '/', sameSite: 'lax', secure: true, expires: 7 });
            }
            // Attach for immediate usage
            // Authorization header is set by axios interceptor
            // Clean tokens from URL
            url.searchParams.delete('accessToken');
            url.searchParams.delete('refreshToken');
            const newUrl = url.pathname + (url.search ? url.search : '') + url.hash;
            window.history.replaceState({}, '', newUrl);
            return { accessToken, refreshToken };
        }
    } catch (error) {
        console.error('Failed to parse URL:', error);
    }
    // Fallback to API if redirect did not carry tokens in URL
    const response = await userInstance.get(`/auth/users/google/callback?code=${code}`);
    const at = response?.data?.data?.accessToken ?? response?.data?.accessToken;
    const rt = response?.data?.data?.refreshToken ?? response?.data?.refreshToken;

    if (at) {
        Cookies.set('user_accessToken', at, { path: '/', sameSite: 'lax', secure: true, expires: 1 / (24 * 4) });
        // Authorization header is set by axios interceptor
    }
    if (rt) {
        Cookies.set('user_refreshToken', rt, { path: '/', sameSite: 'lax', secure: true, expires: 7 });
    }

    return response.data;
}

const handleGoogleFailure = async () => {
    const response = await userInstance.get(`/auth/users/google/failure`);
    return response.data;
}

// Admin Auth Services
const adminLogin = async (data: AdminLoginData) => {
    const response = await adminInstance.post(`/auth/admins/login`, data);
    return response.data;
}

const adminVerifyLogin = async (data: AdminVerifyLoginData) => {
    const response = await adminInstance.post(`/auth/admins/login/verify`, data);
    return response.data;
}

const adminLogout = async () => {
    const response = await adminInstance.post(`/auth/admins/logout`);
    return response.data;
}

export {
    // User auth
    register,
    logout,
    refreshTokens,
    refreshUserTokens,
    refreshAdminTokens,

    // Google auth
    googleAuth,
    handleGoogleCallback,
    handleGoogleFailure,

    // Admin auth
    adminLogin,
    adminVerifyLogin,
    adminLogout,
}