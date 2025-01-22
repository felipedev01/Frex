import jwt from 'jsonwebtoken';

// Middleware existente para autenticação geral
export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  const tokenValue = tokenParts[1];

  jwt.verify(tokenValue, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = decoded;
    next();
  });
};

// Novo middleware para rotas exclusivas de admin
export const checkAdminAuth = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  const tokenValue = tokenParts[1];

  jwt.verify(tokenValue, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    if (decoded.type !== 'admin') {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    req.user = decoded;
    next();
  });
};

// Novo middleware para rotas que admin e viewer podem acessar
export const checkWebAuth = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  const tokenValue = tokenParts[1];

  jwt.verify(tokenValue, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    if (!['admin', 'viewer'].includes(decoded.type)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    req.user = decoded;
    next();
  });
};