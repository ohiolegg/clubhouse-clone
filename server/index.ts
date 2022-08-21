import dotenv from 'dotenv';
dotenv.config({
  path: 'server/.env',
});

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import socket from 'socket.io';

import './core/db';
import { passport } from './core/passport';
import { UploadCtrl } from './controllers/uploadController';
import { AuthCtrl } from './controllers/authController';
import { RoomsCtrl } from './controllers/roomController';
import { createServer } from 'http';
import { Room } from '../models';
import { TUserData } from '../pages';
import { getUsersByRoom } from './utils/getUsersByRoom';

const app = express();
const server = createServer(app);
const io = socket(server, {
  cors: {
    origin: '*',
  },
});

const rooms: Record<string, { roomId: string; user: TUserData }> = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('CLIENT@ROOMS:JOIN', async ({ user, roomId }) => {
    socket.join(`room/${roomId}`);
    rooms[socket.id] = { roomId, user };
    const users = getUsersByRoom(rooms, roomId);
    io.in(`room/${roomId}`).emit('SERVER@ROOMS:JOIN', users);
    io.emit('SERVER@ROOMS:HOME', { users, roomId });
    await Room.update({ speakers: users }, { where: { id: roomId } });
  });

  socket.on('CLIENT@ROOMS:CALL', async ({ targetUserId, callerUserId, roomId, signal }) => {
    socket.broadcast
      .in(`room/${roomId}`)
      .emit('SERVER@ROOMS:CALL', { targetUserId, callerUserId, signal });
  });

  socket.on('CLIENT@ROOMS:ANSWER', async ({ targetUserId, callerUserId, roomId, signal }) => {
    socket.broadcast
      .in(`room/${roomId}`)
      .emit('SERVER@ROOMS:ANSWER', { targetUserId, callerUserId, signal });
  });

  socket.on('disconnect', async () => {
    if (rooms[socket.id]) {
      const { roomId, user } = rooms[socket.id];
      delete rooms[socket.id];
      const users = getUsersByRoom(rooms, roomId);
      io.in(`room/${roomId}`).emit('SERVER@ROOMS:DISCONNECT', user);
      io.emit('SERVER@ROOMS:HOME', { users, roomId });
      await Room.update({ speakers: users }, { where: { id: roomId } });
    }
  });
});

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/auth/github', passport.authenticate('github', { session: false }));

app.get('/auth/me', passport.authenticate('jwt', { session: false }), AuthCtrl.getMe);
app.get('/user/:id', passport.authenticate('jwt', { session: false }), AuthCtrl.getUserInfo);

app.post('/auth/activate', passport.authenticate('jwt', { session: false }), AuthCtrl.activate);
app.post('/auth/banned', passport.authenticate('jwt', { session: false }), AuthCtrl.ban);
app.get('/auth/banned', passport.authenticate('jwt', { session: false }), AuthCtrl.checkBanned);

app.post('/upload', upload.single('image'), UploadCtrl.upload);

app.get('/rooms', passport.authenticate('jwt', { session: false }), RoomsCtrl.index);
app.post('/rooms', passport.authenticate('jwt', { session: false }), RoomsCtrl.create);
app.get('/rooms/:id', passport.authenticate('jwt', { session: false }), RoomsCtrl.show);
app.delete('/rooms/:id', passport.authenticate('jwt', { session: false }), RoomsCtrl.delete);

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/' }),
  function (req, res) {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user,
      )}', '*'); window.close();</script>`,
    );
  },
);

server.listen(3004, () => {
  console.log('SERVER OK');
});
