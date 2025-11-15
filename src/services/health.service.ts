import instance from "@/lib/axios-user";

class HealthService {
    // Check if the API server is running
    async checkHealth() {
        const response = await instance.get('/health');
        return response.data;
    }

    // Test API connectivity with a simple ping
    async ping() {
        try {
            const response = await this.checkHealth();
            return {
                success: true,
                message: 'API is reachable',
                data: response,
                timestamp: new Date().toISOString()
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'API is not reachable',
                error: error.message || 'Unknown error',
                timestamp: new Date().toISOString()
            };
        }
    }

    // Get server status with additional info
    async getServerInfo() {
        try {
            const response = await this.checkHealth();
            return {
                success: true,
                serverStatus: response.status,
                serverMessage: response.message,
                serverTimestamp: response.timestamp,
                clientTimestamp: new Date().toISOString(),
                baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
            };
        } catch (error: any) {
            throw new Error(`Server health check failed: ${error.message}`);
        }
    }
}

export const healthService = new HealthService();