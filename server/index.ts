import dotenv from 'dotenv';
dotenv.config({
  path: 'server/.env',
});

import express from 'express';
import multer from 'multer';
import cloudinary from './core/cloudinary';
import cors from 'cors';

import './core/db';
import { passport } from './core/passport';

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/auth/github', passport.authenticate('github', { session: false }));

app.get('/auth/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

app.post('/upload', upload.single('image'), (req: express.Request, res: express.Response) => {
  const file = req.file;

  if (!file) {
    return;
  }

  cloudinary.v2.uploader
    .upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (!result || error) {
        return res.status(500).json({
          message: error || 'upload error',
        });
      }

      res.status(201).json({
        url: result.url,
        size: Math.round(result.size / 1024),
        height: result.height,
        width: result.width,
      });
    })
    .end(file.buffer);
});

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
