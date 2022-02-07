import { Request, Response } from 'express';
import cloudinary from '../core/cloudinary';

class UploadFileController {
  async upload(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      console.log(file);
      if (file) {
        cloudinary.v2.uploader
          .upload_stream({ resourse_type: 'auto' }, (error, result) => {
            console.log('error + result', error, result);
            if (error || !result) {
              return res.status(500).json({
                status: error,
                message: error || 'uploads error',
              });
            }
            res
              .send({
                height: result.height,
                widht: result.width,
                url: result.url,
                size: Math.round(result.bytes / 1024),
              })
              .status(201);
          })
          .end(file.buffer);
      }
    } catch (error) {
      console.log(error, 'error');
      res.status(404);
    }
  }
}

export const UploadFileCtrl = new UploadFileController();
