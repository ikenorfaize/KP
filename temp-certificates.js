import express from 'express';

const router = express.Router();
const FILE_SERVER_URL = process.env.FILE_SERVER_URL || 'http://localhost:3002';

router.get('/download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Proxying certificate download for ID:', id);
    
    const fileServerResponse = await fetch(`${FILE_SERVER_URL}/download-certificate/${id}`);
    
    if (!fileServerResponse.ok) {
      return res.status(fileServerResponse.status).json({
        success: false,
        message: 'Failed to download certificate'
      });
    }
    
    const fileBuffer = await fileServerResponse.buffer();
    const contentType = fileServerResponse.headers.get('content-type') || 'application/pdf';
    const contentDisposition = fileServerResponse.headers.get('content-disposition') || `attachment; filename="certificate-${id}.pdf"`;
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', contentDisposition);
    res.setHeader('Content-Length', fileBuffer.length);
    res.send(fileBuffer);
    
  } catch (error) {
    console.error('Error proxying download:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
