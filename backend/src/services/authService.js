import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authRepository from '../repositories/authRepository.js';

// Verifica se um token JWT é válido
export const verifyToken = (token) => {
  if (!token) {
    return { valid: false, message: 'Token não fornecido.' };
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, message: 'Token inválido ou expirado.' };
  }
};

// Registra um novo motorista
export const createDriver = async (driverData) => {
  const { name, email, password, transportCompany, licensePlate } = driverData;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await authRepository.createDriver({
      name,
      email,
      password: hashedPassword,
      transportCompany,
      licensePlate,
    });

    if (!result.success) {
      console.error('Erro ao cadastrar motorista:', result.error);
      return { success: false, error: 'Erro ao cadastrar motorista' };
    }

    return { success: true, driver: result.data };
  } catch (error) {
    console.error('Erro ao cadastrar motorista:', error);
    return { success: false, error };
  }
};

// Autentica um motorista e gera token JWT
export const authenticateDriver = async (email, password) => {
  try {
    const driverResult = await authRepository.findDriverByEmail(email);
    
    if (!driverResult.success || !driverResult.data) {
      return { success: false, error: 'Usuário não encontrado' };
    }
    
    const driver = driverResult.data;
    const isPasswordValid = await bcrypt.compare(password, driver.password);
    
    if (!isPasswordValid) {
      return { success: false, error: 'Senha incorreta' };
    }

    const token = jwt.sign({ id: driver.id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    return {
      success: true,
      token,
      user: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
      },
    };
  } catch (error) {
    console.error('Erro na autenticação do motorista:', error);
    return { success: false, error: 'Erro no servidor' };
  }
};

// Cria um novo usuário admin ou viewer
export const createWebUser = async (userData) => {
  try {
    const { name, email, password, userType } = userData;

    if (!name || !email || !password || !userType) {
      return { success: false, error: 'Todos os campos são obrigatórios' };
    }

    if (!['admin', 'viewer'].includes(userType)) {
      return { success: false, error: 'Tipo de usuário inválido' };
    }

    // Verificar se o email já está em uso
    const adminResult = await authRepository.findAdminByEmail(email);
    const viewerResult = await authRepository.findViewerByEmail(email);
    
    if ((adminResult.success && adminResult.data) || 
        (viewerResult.success && viewerResult.data)) {
      return { success: false, error: 'Email já está em uso' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userResult;
    if (userType === 'admin') {
      userResult = await authRepository.createAdmin({
        name,
        email,
        password: hashedPassword
      });
    } else {
      userResult = await authRepository.createViewer({
        name,
        email,
        password: hashedPassword
      });
    }

    if (!userResult.success) {
      return { success: false, error: 'Erro ao criar usuário' };
    }

    const user = userResult.data;
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      message: `Usuário ${userType} criado com sucesso`,
      data: userWithoutPassword
    };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return { success: false, error: 'Erro ao criar usuário' };
  }
};

// Autentica um usuário web (admin ou viewer)
export const authenticateWebUser = async (email, password) => {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email e senha são obrigatórios' };
    }

    // Verificar se é um admin
    const adminResult = await authRepository.findAdminByEmail(email);
    
    if (adminResult.success && adminResult.data) {
      const admin = adminResult.data;
      const validPassword = await bcrypt.compare(password, admin.password);
      
      if (validPassword) {
        const token = jwt.sign(
          { id: admin.id, type: 'admin' },
          process.env.SECRET_KEY,
          { expiresIn: '24h' }
        );

        return {
          success: true,
          token,
          userType: 'admin',
          name: admin.name
        };
      }
    }

    // Verificar se é um viewer
    const viewerResult = await authRepository.findViewerByEmail(email);
    
    if (viewerResult.success && viewerResult.data) {
      const viewer = viewerResult.data;
      const validPassword = await bcrypt.compare(password, viewer.password);
      
      if (validPassword) {
        const token = jwt.sign(
          { id: viewer.id, type: 'viewer' },
          process.env.SECRET_KEY,
          { expiresIn: '24h' }
        );

        return {
          success: true,
          token,
          userType: 'viewer',
          name: viewer.name
        };
      }
    }

    return { success: false, error: 'Credenciais inválidas' };
  } catch (error) {
    console.error('Erro no login web:', error);
    return { success: false, error: 'Erro no servidor' };
  }
}; 