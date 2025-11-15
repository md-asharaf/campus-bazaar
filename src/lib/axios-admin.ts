import axios from "axios";
import Cookies from "js-cookie";

/**
 * Admin-specific Axios instance
 *
 * - Reads admin access token from 'admin_accessToken' cookie and attaches as Authorization header
 * - Writes refreshed/returned tokens back to 'admin_accessToken' and 'admin_refreshToken' cookies
 * - Handles 401s with a single-flight refresh flow against /auth/admins/refresh-tokens
 * - Does NOT use withCredentials; relies solely on Authorization header
 */

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Single-flight refresh control
let isRefreshing = false;
let waitQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

function flushQueue(err?: any) {
  if (err) {
    waitQueue.forEach((p) => p.reject(err));
  } else {
    waitQueue.forEach((p) => p.resolve(true));
  }
  waitQueue = [];
}

// Attach access token from admin cookies
instance.interceptors.request.use((config) => {
  const at = Cookies.get("admin_accessToken");
  if (at) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${at}`;
  }
  return config;
});

// Persist tokens if backend returns them
instance.interceptors.response.use(
  (response) => {
    const at = response?.data?.data?.accessToken ?? response?.data?.accessToken;
    const rt = response?.data?.data?.refreshToken ?? response?.data?.refreshToken;

    if (at) {
      Cookies.set("admin_accessToken", at, {
        path: "/",
        sameSite: "lax",
        secure: true,
        expires: 1 / (24 * 4), // ~15 minutes
      });
    }
    if (rt) {
      Cookies.set("admin_refreshToken", rt, {
        path: "/",
        sameSite: "lax",
        secure: true,
        expires: 7, // 7 days
      });
    }
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const original: any = error.config;

    // Ignore if not 401, missing config, or already at refresh endpoint
    if (
      status !== 401 ||
      !original ||
      typeof original.url !== "string" ||
      original.url.includes("/auth/admins/refresh-tokens")
    ) {
      return Promise.reject(error);
    }

    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    // If a refresh call is already in progress, queue and retry after it finishes
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
      const rt = Cookies.get("admin_refreshToken");
      const headers = rt ? { Authorization: `Bearer ${rt}` } : {};
      const resp = await instance.post("/auth/admins/refresh-tokens", undefined, { headers });

      const newAT = resp?.data?.data?.accessToken ?? resp?.data?.accessToken;
      const newRT = resp?.data?.data?.refreshToken ?? resp?.data?.refreshToken;

      if (newAT) {
        Cookies.set("admin_accessToken", newAT, {
          path: "/",
          sameSite: "lax",
          secure: true,
          expires: 1 / (24 * 4),
        });
      }
      if (newRT) {
        Cookies.set("admin_refreshToken", newRT, {
          path: "/",
          sameSite: "lax",
          secure: true,
          expires: 7,
        });
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