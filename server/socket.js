import { Server } from 'socket.io';

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);

            // Notify others in the room
            socket.to(roomId).emit('user-joined', { userId: socket.id });
        });

        socket.on('send-message', (data) => {
            const { roomId, message, user } = data;
            io.to(roomId).emit('receive-message', {
                text: message,
                user: user,
                timestamp: new Date().toISOString()
            });
        });

        socket.on('share-progress', (data) => {
            const { roomId, progress, user } = data;
            io.to(roomId).emit('progress-update', {
                user: user,
                progress: progress
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};
