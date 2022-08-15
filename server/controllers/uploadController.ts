import express from 'express';
import cloudinary from '../core/cloudinary';

class UploadFileController {
  async upload(req: express.Request, res: express.Response) {
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
  }
}

export const UploadCtrl = new UploadFileController();
