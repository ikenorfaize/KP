import express from 'express';
import multer from 'multer';
import FormData from 'form-data';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const FILE_SERVER_URL = process.env.FILE_SERVER_URL || 'http://localhost:3002';

router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Proxying image upload:', req.file.originalname);

    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const fileServerResponse = await fetch(FILE_SERVER_URL + '/upload-image', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    if (!fileServerResponse.ok) {
      const errorText = await fileServerResponse.text();
      console.error('File server error:', errorText);
      return res.status(fileServerResponse.status).json({
        error: 'Failed to upload image to file server'
      });
    }

    const result = await fileServerResponse.json();
    console.log('Image uploaded:', result.filename);
    res.json(result);

  } catch (error) {
    console.error('Error proxying image upload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
