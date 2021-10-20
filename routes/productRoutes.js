const rescue = require('express-rescue');
const controller = require('../controllers/products');

const productRoutes = (app) => {
  app.route('/products')
    .get(rescue(controller.getAll))
    .post(rescue(controller.createProduct));

  app.route('/products/:id')
    .get(rescue(controller.getById))
    .put(rescue(controller.updateProduct))
    .delete(rescue(controller.deleteProduct));
};

module.exports = productRoutes;
