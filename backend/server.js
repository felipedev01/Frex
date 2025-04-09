import app from './src/app.js';

const PORT = process.env.PORT || 3002;

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
