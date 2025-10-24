import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "/",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Vendor libraries
                    if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                        return 'vendor-react';
                    }
                    if (id.includes('@radix-ui')) {
                        return 'vendor-ui';
                    }
                    if (id.includes('@tanstack/react-query')) {
                        return 'vendor-query';
                    }
                    if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
                        return 'vendor-form';
                    }
                    if (id.includes('axios') || id.includes('date-fns') || id.includes('clsx') || 
                        id.includes('class-variance-authority') || id.includes('tailwind-merge')) {
                        return 'vendor-utils';
                    }
                    // App modules
                    if (id.includes('/chat/') || id.includes('ChatContext') || 
                        id.includes('chat.service') || id.includes('socket.service')) {
                        return 'chat';
                    }
                    if (id.includes('AuthContext') || id.includes('useAuth')) {
                        return 'auth';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 600,
        sourcemap: false,
        minify: 'esbuild',
    },
});
