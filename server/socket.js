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

        // Duel Handlers
        socket.on('duel-invite', (data) => {
            const { targetUserId, inviter } = data;
            // In a real app, find the socket of targetUserId. 
            // For now, broadcast to all for testing or use a simple mapping.
            socket.broadcast.emit('duel-invitation', {
                inviter,
                duelId: `duel_${Math.random().toString(36).substr(2, 9)}`
            });
        });

        socket.on('duel-join', (data) => {
            const { duelId, user } = data;
            socket.join(duelId);
            io.to(duelId).emit('duel-player-joined', { user });
        });

        socket.on('duel-progress', (data) => {
            const { duelId, user, score, progress } = data;
            io.to(duelId).emit('duel-update', {
                user,
                score,
                progress
            });
        });

        socket.on('duel-finish', (data) => {
            const { duelId, user, score } = data;
            io.to(duelId).emit('duel-player-finished', { user, score });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};
