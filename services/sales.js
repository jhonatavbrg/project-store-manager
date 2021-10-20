const model = require('../models/sales');
const valid = require('../validations/salesValidations');

const updateProductQtts = async (sale) => {
  const sellPromises = sale.map(async (item) => {
    const verifyQtt = await model.sellQuantity(item.productId, item.quantity);
    valid.verifyStock(verifyQtt);
    return verifyQtt;
  });
  return Promise.all(sellPromises);
};

const getAll = () => model.getAll();

const getById = async (id) => {
  const result = await model.getById(id);
  valid.isValidSale(result);
  return result;
};

const newSale = async (sale) => {
  valid.validateSale(sale);
  await updateProductQtts(sale);
  const result = await model.newSale(sale);
  return result;
};

const updateSale = async (id, sale) => {
  valid.validateSale(sale);
  const result = await model.updateSale(id, sale);
  return result;
};

const deleteSale = async (id) => {
  const sale = await model.getById(id);
  valid.validateDeletion(sale);
  const { itensSold } = sale;
  const item = [{ productId: itensSold[0].productId, quantity: itensSold[0].quantity * -1 }];
  await updateProductQtts(item);
  const result = await model.deleteSale(id);
  return result;
};

module.exports = {
  getAll,
  getById,
  newSale,
  updateSale,
  deleteSale,
  updateProductQtts,
};
