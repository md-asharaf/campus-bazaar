import instance from "@/lib/axios"

type Register = {
    name: string;
    email: string;
    avatar?: string | null;
    bio?: string | null;
    phone?: string | null;
    registrationNo: string;
    branch: string;
    year: number;
}

const baseUserAuthURL = '/auth/user'

const login = async (email: string) => {
    const response = await instance.post(`${baseUserAuthURL}/google`, { email });
    return response.data;
}

const register = async (data: Register) => {
    const response = await instance.post(`${baseUserAuthURL}/register`, data);
    return response.data;
}

const callback = async () => {
    const response = await instance.post(`${baseUserAuthURL}/google/callback`);
    return response.data;
}

const logout = async () => {
    const response = await instance.post(`${baseUserAuthURL}/logout`);
    return response.data;
}

const refreshTokens = async () => {
    const response = await instance.post(`${baseUserAuthURL}/refresh-tokens`);
    return response.data;
}

export {
    login,
    register,
    callback,
    logout,
    refreshTokens,
}