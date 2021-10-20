const model = require('../models/products');
const valid = require('../validations/productsValidations');

const getAll = () => model.getAll();

const getById = async (id) => {
  const result = await model.getById(id);
  valid.checkProductId(result);
  return result;
};

const createProduct = async ({ name, quantity }) => {
  valid.checkNameLength(name);
  valid.checkValidQuantity(quantity);
  await valid.findProductByName(name, model.findByName);
  const result = await model.createProduct({ name, quantity });
  return result;
};

const updateProduct = async (id, name, quantity) => {
  valid.checkNameLength(name);
  valid.checkValidQuantity(quantity);
  const result = await model.updateProduct(id, name, quantity);
  valid.checkProductId(result);
  return result;
};

const deleteProduct = async (id) => {
  const result = await model.deleteProduct(id);
  valid.checkProductId(result);
  return result;
};

module.exports = {
  createProduct,
  getAll,
  getById,
  updateProduct,
  deleteProduct,
};
