import * as authService from '../services/authService.js';

export const validateToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  const result = authService.verifyToken(token);
  
  if (result.valid) {
    return res.status(200).json({ valid: true });
  } else {
    return res.status(401).json({ valid: false, message: result.message });
  }
};

export const registerDriver = async (req, res) => {
  const result = await authService.createDriver(req.body);
  
  if (result.success) {
    return res.status(201).json({ message: 'Motorista cadastrado com sucesso!' });
  } else {
    return res.status(400).json({ error: result.error });
  }
};

export const registerTransportCompany = async (req, res) => {
  const result = await authService.createTransportCompany(req.body);
  
  if (result.success) {
    return res.status(201).json({ 
      message: 'Transportadora cadastrada com sucesso!',
      company: {
        id: result.company.id,
        name: result.company.name,
        email: result.company.email,
        cnpj: result.company.cnpj
      }
    });
  } else {
    return res.status(400).json({ error: result.error });
  }
};

export const loginDriver = async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authService.authenticateDriver(email, password);
  
  if (result.success) {
    return res.status(200).json({
      message: 'Login bem-sucedido!',
      token: result.token,
      user: result.user
    });
  } else {
    return res.status(result.error === 'Erro no servidor' ? 500 : 401).json({ error: result.error });
  }
};

export const loginTransportCompany = async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authService.authenticateTransportCompany(email, password);
  
  if (result.success) {
    return res.status(200).json({
      message: 'Login bem-sucedido!',
      token: result.token,
      userType: result.userType,
      user: result.user
    });
  } else {
    return res.status(result.error === 'Erro no servidor' ? 500 : 401).json({ error: result.error });
  }
};

export const createViewer = async (req, res) => {
  const result = await authService.createWebUser(req.body);
  
  if (result.success) {
    return res.status(201).json({
      message: result.message,
      data: result.data
    });
  } else {
    return res.status(result.error.includes('Erro ao criar usuário') ? 500 : 400).json({ error: result.error });
  }
};

export const webLogin = async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authService.authenticateWebUser(email, password);
  
  if (result.success) {
    return res.json({
      token: result.token,
      userType: result.userType,
      name: result.name
    });
  } else {
    return res.status(result.error === 'Erro no servidor' ? 500 : 401).json({ error: result.error });
  }
}; 