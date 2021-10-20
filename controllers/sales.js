const service = require('../services/sales');

const getAll = async (req, res) => {
   const result = await service.getAll();
   return res.status(200).json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await service.getById(id);
  return res.status(200).json(result);
};

const newSale = async (req, res) => {
  const sale = req.body;
  const result = await service.newSale(sale);
  return res.status(200).json(result);
};

const updateSale = async (req, res) => {
  const { id } = req.params;
  const sale = req.body;
  const result = await service.updateSale(id, sale);
  return res.status(200).json(result);
};

const deleteSale = async (req, res) => {
  const { id } = req.params;
  const result = await service.deleteSale(id);
  return res.status(200).json(result);
};

module.exports = {
  getAll,
  getById,
  newSale,
  updateSale,
  deleteSale,
};
