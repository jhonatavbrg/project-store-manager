const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createProduct = async ({ name, quantity }) => {
  if (!name || !quantity) return null;
  return connection()
    .then((db) => db.collection('products').insertOne({ name, quantity }))
    .then((result) => ({ _id: result.insertedId, name, quantity }));
};

const findByName = async (name) => {
  const product = await connection()
    .then((db) => db.collection('products').findOne({ name }));
  if (!product) return null;
  return product;
};

const getAll = async () =>
  connection()
    .then((db) => db.collection('products').find().toArray())
    .then((result) => ({ products: result }));

const getById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  return connection()
    .then((db) => db.collection('products').findOne({ _id: ObjectId(id) }));
};

const updateProduct = async (id, name, quantity) => {
  if (!ObjectId.isValid(id)) return null;
  await connection()
    .then((db) => db
      .collection('products').updateOne({ _id: ObjectId(id) }, { $set: { name, quantity } }));
  return {
    _id: id, name, quantity,
  };
};

const deleteProduct = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  return connection()
    .then((db) => db.collection('products').findOneAndDelete({ _id: ObjectId(id) }))
    .then(({ value }) => ({ ...value }));
};

module.exports = {
  createProduct,
  findByName,
  getAll,
  getById,
  updateProduct,
  deleteProduct,
};
