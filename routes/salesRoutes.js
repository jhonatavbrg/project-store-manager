const rescue = require('express-rescue');
const controller = require('../controllers/sales');

const salesRoutes = (app) => {
  app.route('/sales')
    .get(rescue(controller.getAll))
    .post(rescue(controller.newSale));

  app.route('/sales/:id')
    .get(rescue(controller.getById))
    .put(rescue(controller.updateSale))
    .delete(rescue(controller.deleteSale));
};

module.exports = salesRoutes;
