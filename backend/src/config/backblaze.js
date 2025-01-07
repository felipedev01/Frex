import BackblazeB2 from 'backblaze-b2';
import dotenv from 'dotenv';

dotenv.config();

const b2 = new BackblazeB2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY,
});

export const authorizeB2 = async () => {
  try {
    await b2.authorize();
    console.log('✅ Backblaze B2 autorizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao autorizar Backblaze B2:', error.response?.data || error.message || error);
    throw error;
  }
};

export default b2;



