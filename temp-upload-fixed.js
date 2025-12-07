import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const FILE_SERVER_URL = process.env.FILE_SERVER_URL || 'http://localhost:3002';

router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('📤 Proxying image upload:', req.file.originalname, `(${req.file.size} bytes)`);

    // Create FormData and append the file buffer
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Use axios instead of fetch for better FormData support
    const fileServerResponse = await axios.post(
      FILE_SERVER_URL + '/upload-image',
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    console.log('✅ Image uploaded successfully:', fileServerResponse.data.filename);
    res.json(fileServerResponse.data);

  } catch (error) {
    console.error('❌ Error proxying image upload:', error.message);
    
    if (error.response) {
      // File server returned an error
      console.error('File server error:', error.response.data);
      return res.status(error.response.status).json({
        error: 'Failed to upload image to file server',
        details: error.response.data
      });
    } else {
      // Network or other error
      console.error('Network error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
});

export default router;
