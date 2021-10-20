const checkNameLength = (name) => {
  if (name.length < 5) {
    const error = new Error();
    error.statusCode = 'invalidName';
    throw error;
  }
};

const checkValidQuantity = (quantity) => {
  if (quantity < 1) {
    const error = new Error();
    error.statusCode = 'invalidQuantity';
    throw error;
  }

  if (typeof quantity !== 'number') {
    const error = new Error();
    error.statusCode = 'invalidQuantityType';
    throw error;
  }
};

const checkProductId = (productId) => {
  if (!productId) {
    const error = new Error();
    error.statusCode = 'invalidIdFormat';
    throw error;
  }
};

const findProductByName = async (name, callback) => {
  const product = await callback(name);
  if (product) {
    const error = new Error();
    error.statusCode = 'alreadyExists';
    throw error;
  }
};

module.exports = {
  checkNameLength,
  checkValidQuantity,
  checkProductId,
  findProductByName,
};
