import instance from "@/lib/axios"

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
    const response = await instance.post(`/auth/users/register`, data);
    return response.data;
}

const logout = async () => {
    const response = await instance.post(`/auth/users/logout`);
    return response.data;
}

const refreshTokens = async () => {
    const response = await instance.post(`/auth/users/refresh-tokens`);
    return response.data;
}

// Google Auth Services
const googleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/auth/users/google`;
}

const handleGoogleCallback = async (code: string) => {
    const response = await instance.get(`/auth/users/google/callback?code=${code}`);
    return response.data;
}

const handleGoogleFailure = async () => {
    const response = await instance.get(`/auth/users/google/failure`);
    return response.data;
}

// Admin Auth Services
const adminLogin = async (data: AdminLoginData) => {
    const response = await instance.post(`/auth/admins/login`, data);
    return response.data;
}

const adminVerifyLogin = async (data: AdminVerifyLoginData) => {
    const response = await instance.post(`/auth/admins/login/verify`, data);
    return response.data;
}

const adminLogout = async () => {
    const response = await instance.post(`/auth/admins/logout`);
    return response.data;
}

export {
    // User auth
    register,
    logout,
    refreshTokens,

    // Google auth
    googleAuth,
    handleGoogleCallback,
    handleGoogleFailure,

    // Admin auth
    adminLogin,
    adminVerifyLogin,
    adminLogout,
}