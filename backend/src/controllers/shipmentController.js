import * as shipmentService from '../services/shipmentService.js';

// Middleware para autenticar motorista
export const authenticateDriver = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  const result = shipmentService.verifyDriverToken(token);
  
  if (result.success) {
    req.driverId = result.driverId;
    next();
  } else {
    return res.status(result.error === 'Token não fornecido' ? 401 : 403).json({ error: result.error });
  }
};

// Listar fretes do motorista autenticado
export const getDriverShipments = async (req, res) => {
  const result = await shipmentService.getShipmentsByDriverId(req.driverId);
  
  if (result.success) {
    return res.status(200).json(result.data);
  } else {
    return res.status(500).json({ error: result.error });
  }
};

// Criar novo frete com notas fiscais
export const createShipment = async (req, res) => {
  const result = await shipmentService.createNewShipment(req.body);
  
  if (result.success) {
    return res.status(201).json({
      message: result.message,
      shipment: result.shipment
    });
  } else {
    return res.status(result.error === 'O motorista já possui um frete pendente.' || 
                     result.error === 'Preencha todos os campos obrigatórios.' ? 400 : 500)
           .json({ error: result.error });
  }
}; 