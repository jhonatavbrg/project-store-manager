const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAll = async () =>
  connection()
    .then((db) => db.collection('sales').find().toArray())
    .then((result) => ({ sales: result }));

const getById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  return connection()
    .then((db) => db.collection('sales').findOne({ _id: ObjectId(id) }));
};

const newSale = async (sale) =>
  connection()
    .then((db) => db.collection('sales').insertOne({ itensSold: sale }))
    .then((result) => result.ops[0]);

const updateSale = async (id, sale) => {
  if (!ObjectId.isValid(id)) return null;
  connection()
    .then((db) => db.collection('sales').updateOne(
      { _id: ObjectId(id) }, { $set: { itensSold: sale } },
    ));
  return {
    _id: id, itensSold: sale,
  };
};

const deleteSale = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  return connection()
    .then((db) => db.collection('sales').findOneAndDelete({ _id: ObjectId(id) }))
    .then((result) => result.value);
};

const sellQuantity = async (id, quantity) => {
  const stock = await connection()
    .then((db) => db.collection('products').findOne({ _id: ObjectId(id) }));

  if (stock.quantity - quantity < 0) return null;

  return connection()
    .then((db) => db.collection('products').updateOne(
      { _id: ObjectId(id) }, { $inc: { quantity: -quantity } },
    ));
};

module.exports = {
  getAll,
  getById,
  newSale,
  updateSale,
  deleteSale,
  sellQuantity,
};
