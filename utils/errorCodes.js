module.exports = {
  invalidName: {
    code: 'invalid_data',
    message: '"name" length must be at least 5 characters long',
    status: 422,
  },

  alreadyExists: {
    code: 'invalid_data',
    message: 'Product already exists',
    status: 422,
  },

  invalidQuantity: {
    code: 'invalid_data',
    message: '"quantity" must be larger than or equal to 1',
    status: 422,
  },

  invalidQuantityType: {
    code: 'invalid_data',
    message: '"quantity" must be a number',
    status: 422,
  },

  invalidIdFormat: {
    code: 'invalid_data',
    message: 'Wrong id format',
    status: 422,
  },

  invalidSale: {
    code: 'invalid_data',
    message: 'Wrong product ID or invalid quantity',
    status: 422,
  },

  saleNotFound: {
    code: 'not_found',
    message: 'Sale not found',
    status: 404,
  },

  unprocessable: {
    code: 'invalid_data',
    message: 'Wrong sale ID format',
    status: 422,
  },

  stockProblem: {
    code: 'stock_problem',
    message: 'Such amount is not permitted to sell',
    status: 404,
  },
};
