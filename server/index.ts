import dotenv from 'dotenv';
dotenv.config({
  path: 'server/.env',
});

import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import cors from 'cors';

import './core/db';
import { passport } from './core/passport';
import { UploadCtrl } from './controllers/uploadController';
import { AuthCtrl } from './controllers/authController';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/auth/github', passport.authenticate('github', { session: false }));

app.get('/auth/me', passport.authenticate('jwt', { session: false }), AuthCtrl.getMe);

app.post('/auth/activate', passport.authenticate('jwt', { session: false }), AuthCtrl.activate);
app.post('/auth/banned', passport.authenticate('jwt', { session: false }), AuthCtrl.ban);
app.get('/auth/banned', passport.authenticate('jwt', { session: false }), AuthCtrl.checkBanned);

app.post('/upload', upload.single('image'), UploadCtrl.upload);

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

app.listen(3004, () => {
  console.log('SERVER OK');
});
