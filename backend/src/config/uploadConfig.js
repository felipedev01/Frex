import multer from 'multer';
import b2, { authorizeB2 } from './backblaze.js';
import { Readable } from 'stream';



await authorizeB2();

export const upload = multer({
  storage: multer.memoryStorage(),
});

export const getDownloadUrl = async (fileName) => {
  try {
    const authResponse = await b2.authorize(); // Reautoriza, se necessário
    const downloadUrl = `${authResponse.data.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName}`;
    console.log('✅ URL de Download:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('❌ Erro ao gerar URL de download:', error.response?.data || error.message || error);
    throw new Error('Erro ao gerar URL de download');
  }
};

export const uploadToB2 = async (file) => {
  try {
    
    await authorizeB2();

    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID,
    });

    const uploadUrl = uploadUrlResponse.data.uploadUrl;
    const uploadAuthToken = uploadUrlResponse.data.authorizationToken;

    const response = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken,
      fileName: `proofs/${Date.now()}_${file.originalname}`,
      data: file.buffer, // Usa diretamente o buffer
      mime: file.mimetype,
    });

    console.log('✅ Upload bem-sucedido', response.data);

    // Retorna URL pública
    return `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${response.data.fileName}`;
  } catch (error) {
    console.error('❌ Erro ao fazer upload para Backblaze B2:', error.response?.data || error.message || error);
    throw new Error('Erro ao fazer upload para Backblaze B2');
  }
};

export default upload;
