import { io, Socket } from "socket.io-client";

type SocketEvents = {
    connected: (data: { userId: string }) => void;
    joined_chat: (data: { chatId: string }) => void;
    left_chat: (data: { chatId: string }) => void;
    user_online: (data: { userId: string }) => void;
    user_offline: (data: { userId: string }) => void;
    new_message: (data: { messageId: string; content: string; senderId: string; chatId: string; timestamp?: string }) => void;
    message_delivered: (data: { messageId: string; deliveredTo: string }) => void;
    message_read: (data: { messageId: string; readBy: string }) => void;
    user_typing: (data: { userId: string; chatId: string }) => void;
    user_stopped_typing: (data: { userId: string; chatId: string }) => void;
    error: (data: { message: string }) => void;
    connect: () => void;
    connect_error: (error: Error) => void;
    disconnect: (reason: string) => void;
};

type EmitEvents = {
    join_chat: (data: { chatId: string }) => void;
    leave_chat: (data: { chatId: string }) => void;
    send_message: (data: { chatId: string; content: string }) => void;
    mark_delivered: (data: { messageId: string }) => void;
    mark_read: (data: { messageId: string }) => void;
    typing_start: (data: { chatId: string }) => void;
    typing_stop: (data: { chatId: string }) => void;
};

export default class SocketService {
    private static instance: SocketService;
    public socket: Socket | null = null;
    private connectionPromise: Promise<void> | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    async connect(token: string, url: string = "http://localhost:3000"): Promise<void> {
        // If already connected, return
        if (this.socket?.connected) {
            return Promise.resolve();
        }

        // If connection is in progress then return the existing promise
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        // Create a new connection
        this.connectionPromise = new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.disconnect();
            }

            this.socket = io(url, {
                auth: { token },
                transports: ["websocket"],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 20000,
            });

            //  successful connection
            const onConnect = () => {
                console.log("Socket connected successfully");
                this.socket?.off("connect", onConnect);
                this.socket?.off("connect_error", onConnectError);
                this.connectionPromise = null;
                resolve();
            };

            //  connection errors
            const onConnectError = (error: Error) => {
                console.error("Socket connection error:", error);
                this.socket?.off("connect", onConnect);
                this.socket?.off("connect_error", onConnectError);
                this.connectionPromise = null;
                reject(error);
            };

            this.socket.on("connect", onConnect);
            this.socket.on("connect_error", onConnectError);

            // socket  disconection
            this.socket.on("disconnect", (reason: string) => {
                console.log("Socket disconnected:", reason);
                this.connectionPromise = null;
            });
        });

        return this.connectionPromise;
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
        this.connectionPromise = null;
    }

    on<EventKey extends keyof SocketEvents>(
        event: EventKey,
        callback: SocketEvents[EventKey]
    ): void {
        if (!this.socket) {
            console.warn(`Cannot listen to event '${event}': Socket not connected`);
            return;
        }

        // Handle the typing correctly for socket io's events 
        this.socket.on(event as string, callback as (...args: unknown[]) => void);
    }

    off<EventKey extends keyof SocketEvents>(
        event: EventKey,
        callback?: SocketEvents[EventKey]
    ): void {
        if (!this.socket) return;

        if (callback) {
            this.socket.off(event as string, callback as (...args: unknown[]) => void);
        } else {
            this.socket.off(event as string);
        }
    }

    emit<EventKey extends keyof EmitEvents>(
        event: EventKey,
        data: Parameters<EmitEvents[EventKey]>[0]
    ): void {
        if (!this.socket?.connected) {
            console.warn(`Can't emit event '${event}': Socket not connected`);
            return;
        }

        this.socket.emit(event as string, data);
    }

    // Chat related methods
    joinChat(chatId: string): void {
        this.emit("join_chat", { chatId });
    }

    leaveChat(chatId: string): void {
        this.emit("leave_chat", { chatId });
    }

    sendMessage(chatId: string, content: string): void {
        this.emit("send_message", { chatId, content });
    }

    markDelivered(messageId: string): void {
        this.emit("mark_delivered", { messageId });
    }

    markRead(messageId: string): void {
        this.emit("mark_read", { messageId });
    }

    typingStart(chatId: string): void {
        this.emit("typing_start", { chatId });
    }

    typingStop(chatId: string): void {
        this.emit("typing_stop", { chatId });
    }


    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    getId(): string | undefined {
        return this.socket?.id;
    }

    // Method will wait until connected the user connet to the socket server
    async waitForConnection(timeout: number = 10000): Promise<void> {
        if (this.isConnected()) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject(new Error("Socket not initialized"));
                return;
            }

            const timer = setTimeout(() => {
                this.socket?.off("connect", onConnect);
                reject(new Error("Connection timeout"));
            }, timeout);

            const onConnect = () => {
                clearTimeout(timer);
                this.socket?.off("connect", onConnect);
                resolve();
            };

            this.socket.on("connect", onConnect);
        });
    }
}


export const socketService = SocketService.getInstance();