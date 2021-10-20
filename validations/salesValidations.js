const validateSale = (sale) => {
  sale.forEach((item) => {
    if (item.quantity < 1 || typeof item.quantity !== 'number') {
      const error = new Error();
      error.statusCode = 'invalidSale';
      throw error;
    }
  });
};

const isValidSale = (sale) => {
  if (!sale) {
    const error = new Error();
    error.statusCode = 'saleNotFound';
    throw error;
  }
};

const validateDeletion = (sale) => {
  if (!sale) {
    const error = new Error();
    error.statusCode = 'unprocessable';
    throw error;
  }
};

const verifyStock = (stock) => {
  if (!stock) {
    const error = new Error();
    error.statusCode = 'stockProblem';
    throw error;
  }
};

module.exports = {
  validateSale,
  isValidSale,
  validateDeletion,
  verifyStock,
};
