import Cookies from "js-cookie";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",

  headers: {
    "Content-Type": "application/json",
  },
});

// Single-flight refresh state
let isRefreshing = false;
let waitQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

function flushQueue(err?: any) {
  if (err) {
    waitQueue.forEach(p => p.reject(err));
  } else {
    waitQueue.forEach(p => p.resolve(true));
  }
  waitQueue = [];
}

instance.interceptors.request.use((config) => {
  const url = typeof config.url === 'string' ? config.url : '';
  const isAdmin = url.startsWith('/admins') || url.startsWith('/auth/admins') || url.includes('/admins/');
  const accessCookieName = isAdmin ? 'admin_accessToken' : 'user_accessToken';
  const at = Cookies.get(accessCookieName) || Cookies.get('accessToken');
  if (at) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${at}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    const at = response?.data?.data?.accessToken ?? response?.data?.accessToken;
    const rt = response?.data?.data?.refreshToken ?? response?.data?.refreshToken;
    const url = typeof response?.config?.url === 'string' ? response.config.url : '';
    const isAdmin = url.startsWith('/admins') || url.startsWith('/auth/admins') || url.includes('/admins/');
    const accessCookieName = isAdmin ? 'admin_accessToken' : 'user_accessToken';
    const refreshCookieName = isAdmin ? 'admin_refreshToken' : 'user_refreshToken';
    if (at) {
      Cookies.set(accessCookieName, at, { path: '/', sameSite: 'lax', secure: true, expires: 1/(24*4) }); // ~15 minutes
    }
    if (rt) {
      Cookies.set(refreshCookieName, rt, { path: '/', sameSite: 'lax', secure: true, expires: 7 }); // 7 days
    }
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const original = error.config;
    const url = typeof original?.url === 'string' ? original.url : '';
    if (status !== 401 || !original || url.includes('/refresh-tokens')) {
      return Promise.reject(error);
    }
    // Avoid re-refreshing same request
    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitQueue.push({
          resolve: () => resolve(instance(original)),
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const isAdmin = url.startsWith('/admins') || url.startsWith('/auth/admins') || url.includes('/admins/');
      const refreshCookieName = isAdmin ? 'admin_refreshToken' : 'user_refreshToken';
      const accessCookieName = isAdmin ? 'admin_accessToken' : 'user_accessToken';
      const rt = Cookies.get(refreshCookieName) || Cookies.get('refreshToken');
      const headers = rt ? { Authorization: `Bearer ${rt}` } : {};
      if (isAdmin) {
        const resp = await instance.post('/auth/admins/refresh-tokens', undefined, { headers });
        const newAT = resp?.data?.data?.accessToken ?? resp?.data?.accessToken;
        const newRT = resp?.data?.data?.refreshToken ?? resp?.data?.refreshToken;
        if (newAT) Cookies.set(accessCookieName, newAT, { path: '/', sameSite: 'lax', secure: true, expires: 1/(24*4) });
        if (newRT) Cookies.set(refreshCookieName, newRT, { path: '/', sameSite: 'lax', secure: true, expires: 7 });
      } else {
        const resp = await instance.post('/auth/users/refresh-tokens', undefined, { headers });
        const newAT = resp?.data?.data?.accessToken ?? resp?.data?.accessToken;
        const newRT = resp?.data?.data?.refreshToken ?? resp?.data?.refreshToken;
        if (newAT) Cookies.set(accessCookieName, newAT, { path: '/', sameSite: 'lax', secure: true, expires: 1/(24*4) });
        if (newRT) Cookies.set(refreshCookieName, newRT, { path: '/', sameSite: 'lax', secure: true, expires: 7 });
      }
      flushQueue();
      return instance(original);
    } catch (e) {
      flushQueue(e);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
