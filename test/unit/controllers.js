const sinon = require('sinon');
const { expect } = require('chai');

const productServices = require('../../services/products');
const salesService = require('../../services/sales');
const productControllers = require('../../controllers/products');
const salesControllers = require('../../controllers/sales');

const mwError = require('../../middlewares/error');

describe('Controllers de Products', () => {
  describe('testa o controller "getAll"', () => {
    describe('quando a função é executada com sucesso', () => {
      const response = {};
      const request = {};
      const productsMock = {
        products: [
          {
            _id: '614160ab109145ec555b8425',
            name: 'Playstation 5',
            quantity: 960,
          },
        ],
      };

      describe('a resposta', () => {
        beforeEach(() => {
          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();

          sinon.stub(productServices, 'getAll').resolves(productsMock);
        });

        afterEach(() => {
          productServices.getAll.restore();
        });

        it('tem status 200', async () => {
          await productControllers.getAll(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('retorna um json com os produtos cadastrados', async () => {
          await productControllers.getAll(request, response);
          expect(response.json.calledWith(productsMock)).to.be.equal(true);
        });
      });
    })
  });

  describe('testa o controller "getById"', () => {
    describe('quando a funcao retorna com sucesso', () => {
      const response = {};
      const request = { params: { id: '614160ab109145ec555b8425' } };
      const productsMock = {
        _id: '614160ab109145ec555b8425',
        name: 'Playstation 5',
        quantity: 960,
      };

      describe('a resposta', () => {
        beforeEach(() => {
          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();
          sinon.stub(productServices, 'getById').resolves(productsMock);
        });

        afterEach(() => {
          productServices.getById.restore();
        });

        it('deve haver o parametro ID', async () => {
          await productControllers.getById(request, response);
          expect(request.params).to.have.property('id');
        });

        it('retorna o status 200', async () => {
          await productControllers.getById(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('retorna o json com o produto', async () => {
          await productControllers.getById(request, response);
          expect(response.json.calledWith(productsMock)).to.be.equal(true);
        });

      });
    });

    describe('quando ID inválido ou não encontrado', () => {
      const error = new Error();
      const request = { params: { id: '61416' } };
      const response = {};
      const next = {};
      error.statusCode = 'invalidIdFormat';
      const spectedError = {
        err: {
          code: 'invalid_data',
          message: 'Wrong id format',
        }
      };

      describe('a resposta', () => {
        beforeEach(() => {
          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();
          sinon.stub(productServices, 'getById').throws(error);
        });

        afterEach(() => {
          productServices.getById.restore();
        });

        it('retorna o status 422', async () => {
          await mwError(error, request, response, next)
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna o erro esperado', async () => {
          await mwError(error, request, response, next)
          expect(response.json.calledWith(spectedError)).to.be.equal(true);
        });
      })
    });
  });

  describe('testa o controller "createProduct"', () => {
    describe('quando a função retorna com sucesso', () => {
      const response = {};
      const request = { params: { id: '614160ab109145ec555b8425' } };
      const productMock = {
        _id: "61418aa32e836090602e61a3",
        name: "Pipoca",
        quantity: 13
      }

      describe('a resposta', () => {
        beforeEach(() => {
          request.body = {
            name: 'Pipoca',
            quantity: 13,
          };

          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();
          sinon.stub(productServices, 'createProduct').resolves(productMock);
        });

        afterEach(() => {
          productServices.createProduct.restore();
        });

        it('retorna o status 201', async () => {
          await productControllers.createProduct(request, response);
          expect(response.status.calledWith(201)).to.be.equal(true);
        });

        it('retorna o json com o produto cadastrado', async () => {
          await productControllers.createProduct(request, response);
          expect(response.json.calledWith(productMock)).to.be.equal(true);
        });

        it('o produto cadastrado contém as chabes "name" e "quantity"', async () => {
          await productControllers.createProduct(request, response);
          expect(request.body).to.have.all.keys('name', 'quantity');
        });
      });
    });

    describe('quando ocorre um erro', () => {
      const error = new Error();
      const request = {};
      const response = {};
      let next = {};

      describe('se "name" for menor que 5 caracteres', () => {
        const expectError = {
          err: {
            code: 'invalid_data',
            message: '"name" length must be at least 5 characters long',
          }
        };

        beforeEach(() => {
          error.statusCode = 'invalidName';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(productServices, 'createProduct').throws(error);
        });

        afterEach(() => {
          productServices.createProduct.restore();
        });

        it('retorna o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true)
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });

      describe('quando "quantity" for menor que 1', () => {
        const expectError = {
          err: {
            code: 'invalid_data',
            message: '"quantity" must be larger than or equal to 1',
          }
        }
        beforeEach(() => {
          error.statusCode = 'invalidQuantity';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(productServices, 'createProduct').throws(error);
        });

        afterEach(() => {
          productServices.createProduct.restore();
        });

        it('responde com o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });

      describe('quando "quantity não for do tipo number', () => {
        const expectError = {
          err: {
            code: 'invalid_data',
            message: '"quantity" must be a number',
          },
        };
        beforeEach(() => {
          error.statusCode = 'invalidQuantityType';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(productServices, 'createProduct').throws(error);
        });

        afterEach(() => {
          productServices.createProduct.restore();
        });

        it('responde com o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });

      describe('quando já existir um produto com o mesmo nome', () => {
        const expectError = {
          err: {
            code: 'invalid_data',
            message: 'Product already exists',
          },
        };

        beforeEach(() => {
          error.statusCode = 'alreadyExists';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(productServices, 'createProduct').throws(error);
        });

        afterEach(() => {
          productServices.createProduct.restore();
        });

        it('responde com o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });
    });
  });

  describe('Testes do controller "updateProduct', () => {
    describe('quando a função retorna com sucesso', () => {
      const response = {};
      const request = {};
      const productMock = {
        _id: "61418aa32e836090602e61a3",
        name: "Pipoca",
        quantity: 13
      };

      describe('a resposta', () => {
        beforeEach(() => {
          request.body = {
            name: 'Pipoca',
            quantity: 13,
          };
          request.params = { id: "61418aa32e836090602e61a3" }
          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();
          sinon.stub(productServices, 'updateProduct').resolves(productMock);
        });

        afterEach(() => {
          productServices.updateProduct.restore();
        });

        it('retorna o status 200', async () => {
          await productControllers.updateProduct(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('retorna um json com o produto atualizado', async () => {
          await productControllers.updateProduct(request, response);
          expect(response.json.calledWith(productMock)).to.be.equal(true);
        });

        it('o body deve conter as chaves "name" e "quantity"', async () => {
          await productControllers.updateProduct(request, response);
          expect(request.body).to.have.all.keys('name', 'quantity');
        });

        it('o params deve conter a chave "id"', async () => {
          await productControllers.updateProduct(request, response);
          expect(request.params).to.have.property('id');
        });
      });
    });

    describe('quando ocorre um erro', () => {
      const error = new Error();
      const request = {};
      const response = {};
      let next = {};

      describe('se "name" for menor que 5 caracteres', () => {
        const expectError = {
          err: {
            code: 'invalid_data',
            message: '"name" length must be at least 5 characters long',
          }
        };

        beforeEach(() => {
          error.statusCode = 'invalidName';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(productServices, 'updateProduct').throws(error);
        });

        afterEach(() => {
          productServices.updateProduct.restore();
        });

        it('retorna o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true)
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });

      describe('quando "quantity" for menor que 1', () => {
        const expectError = {
          err: {
            code: 'invalid_data',
            message: '"quantity" must be larger than or equal to 1',
          }
        }
        beforeEach(() => {
          error.statusCode = 'invalidQuantity';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(productServices, 'updateProduct').throws(error);
        });

        afterEach(() => {
          productServices.updateProduct.restore();
        });

        it('responde com o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });

      describe('quando "quantity não for do tipo number', () => {
        const expectError = {
          err: {
            code: 'invalid_data',
            message: '"quantity" must be a number',
          },
        };
        beforeEach(() => {
          error.statusCode = 'invalidQuantityType';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(productServices, 'updateProduct').throws(error);
        });

        afterEach(() => {
          productServices.updateProduct.restore();
        });

        it('responde com o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });

      describe('quando o ID do produto for inválido', () => {
        const expectError = {
          err: {
            code: 'invalid_data',
            message: 'Wrong id format',
          },
        };

        beforeEach(() => {
          error.statusCode = 'invalidIdFormat';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(productServices, 'updateProduct').throws(error);
        });

        afterEach(() => {
          productServices.updateProduct.restore();
        });

        it('responde com o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });
    });
  });

  describe('Testes do controller "deleteProduct', () => {
    describe('quando a função retorna com sucesso', () => {
      const response = {};
      const request = {};
      const productMock = {
        _id: "61418aa32e836090602e61a3",
        name: "Pipoca",
        quantity: 13
      };

      describe('a resposta', () => {
        beforeEach(() => {
          request.body = {
            name: 'Pipoca',
            quantity: 13,
          };
          request.params = { id: "61418aa32e836090602e61a3" }
          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();
          sinon.stub(productServices, 'deleteProduct').resolves(productMock);
        });

        afterEach(() => {
          productServices.deleteProduct.restore();
        });

        it('retorna o status 200', async () => {
          await productControllers.deleteProduct(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('retorna um json com o produto deletado', async () => {
          await productControllers.deleteProduct(request, response);
          expect(response.json.calledWith(productMock)).to.be.equal(true);
        });

        it('o body deve conter as chaves "name", "_id" e "quantity"', async () => {
          await productControllers.deleteProduct(request, response);
          expect(request.body).to.have.all.keys('name', 'quantity');
        });

        it('o params deve conter a chave "id"', async () => {
          await productControllers.deleteProduct(request, response);
          expect(request.params).to.have.property('id');
        });
      });
    });

    describe('quando ocorre um erro', () => {
      const error = new Error();
      const request = {};
      const response = {};
      let next = {};

      describe('o ID é inválido', () => {
        const expectError = {
          err: {
            code: 'invalid_data',
            message: 'Wrong id format',
          },
        };

        beforeEach(() => {
          error.statusCode = 'invalidIdFormat';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(productServices, 'deleteProduct').throws(error);
        });

        afterEach(() => {
          productServices.deleteProduct.restore();
        });

        it('responde com o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });
    });
  });
});

describe('Controllers de Sales', () => {
  describe('testa o controller "getAll"', () => {
    describe('quando a função é executada com sucesso', () => {
      const response = {};
      const request = {};
      const salesMock = {
        sales: [
          {
            _id: '614160b4109145ec555b8426',
            itensSold: [
              {
                productId: '6140fd5080d16d1aed89az',
                quantity: 100,
              },
            ],
          },
        ],
      }
      describe('a resposta', () => {
        beforeEach(() => {
          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();

          sinon.stub(salesService, 'getAll').resolves(salesMock);
        });

        afterEach(() => {
          salesService.getAll.restore();
        });

        it('tem status 200', async () => {
          await salesControllers.getAll(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('retorna um json com os produtos cadastrados', async () => {
          await salesControllers.getAll(request, response);
          expect(response.json.calledWith(salesMock)).to.be.equal(true);
        });
      });
    })
  });

  describe('testa o controller "getById"', () => {
    describe('quando a funcao retorna com sucesso', () => {
      const response = {};
      const request = { params: { id: '614160ab109145ec555b8425' } };
      const salesMock = {
        _id: '614160ab109145ec555b8425',
        itensSold: [
          {
            productId: '6140fd5080d16d1aed89az',
            quantity: 100,
          },
        ],
      };

      describe('a resposta', () => {
        beforeEach(() => {
          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();
          sinon.stub(salesService, 'getById').resolves(salesMock);
        });

        afterEach(() => {
          salesService.getById.restore();
        });

        it('deve haver o parametro ID', async () => {
          await salesService.getById(request, response);
          expect(request.params).to.have.property('id');
        });

        it('retorna o status 200', async () => {
          await salesControllers.getById(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('retorna o json com a venda', async () => {
          await salesControllers.getById(request, response);
          expect(response.json.calledWith(salesMock)).to.be.equal(true);
        });
      });
    });

    describe('quando Id não é encontrado', () => {
      const error = new Error();
      const request = {};
      const response = {};
      let next = {};

      const expectError = {
        err: {
          code: 'not_found',
          message: 'Sale not found',
        },
      };

      beforeEach(() => {
        error.statusCode = 'saleNotFound';
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, 'getById').throws(error);
      });

      afterEach(() => {
        salesService.getById.restore();
      });

      it('responde com o status 422', async () => {
        await mwError(error, request, response, next);
        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('retorna um json com o erro esperado', async () => {
        await mwError(error, request, response, next);
        expect(response.json.calledWith(expectError)).to.be.equal(true);
      });
    })
  });

  describe('testa o controller "newSale"', () => {
    describe('quando a função retorna com sucesso', () => {
      const response = {};
      const request = {};

      const newSaleMockResponse = {
        itensSold: [
          {
            productId: '614177c3759bd24939c2059b',
            quantity: 10,
          },
        ],
        _id: '6142208b1061d89ea8cab05b',
      };

      describe('a resposta', () => {
        beforeEach(() => {
          request.body = [
            {
              productId: '614177c3759bd24939c2059b',
              quantity: 10,
            },
          ];

          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();
          sinon.stub(salesService, 'newSale').resolves(newSaleMockResponse);
        });

        afterEach(() => {
          salesService.newSale.restore();
        });

        it('retorna o status 200', async () => {
          await salesControllers.newSale(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('retorna o json com a venda cadastrada', async () => {
          await salesControllers.newSale(request, response);
          expect(response.json.calledWith(newSaleMockResponse)).to.be.equal(true);
        });
      });
    });

    describe('quando a venda não é válida', () => {
      const error = new Error();
      const request = {};
      const response = {};
      let next = {};

      describe('o ID é inválido', () => {

        const expectError = {
          err: {
            code: 'invalid_data',
            message: 'Wrong product ID or invalid quantity',
          }
        };

        beforeEach(() => {
          error.statusCode = 'invalidSale';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(salesService, 'newSale').throws(error);
        });

        afterEach(() => {
          salesService.newSale.restore();
        });

        it('responde com o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });

      describe('quando não há estoque do produto', () => {
        const expectError = {
          err: {
            code: 'stock_problem',
            message: 'Such amount is not permitted to sell',
          },
        };

        beforeEach(() => {
          error.statusCode = 'stockProblem';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(salesService, 'newSale').throws(error);
        });

        afterEach(() => {
          salesService.newSale.restore();
        });

        it('retorna o status 404', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(404)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });

    });
  });

  describe('Testes do controller "updateSale', () => {
    describe('quando a função retorna com sucesso', () => {
      const response = {};
      const request = {};
      const updateMockResponse = {
        _id: '614222e61b9b0fa943983c70',
        itensSold: [
          {
            productId: '614222d61b9b0fa943983c6f',
            quantity: 10,
          },
        ],
      };

      describe('a resposta', () => {
        beforeEach(() => {
          request.body = [
            {
              productId: '614177c3759bd24939c2059b',
              quantity: 10,
            },
          ];

          request.params = { id: "614222e61b9b0fa943983c70" }
          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();
          sinon.stub(salesService, 'updateSale').resolves(updateMockResponse);
        });

        afterEach(() => {
          salesService.updateSale.restore();
        });

        it('retorna o status 200', async () => {
          await salesControllers.updateSale(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('retorna um json com o produto atualizadp', async () => {
          await salesControllers.updateSale(request, response);
          expect(response.json.calledWith(updateMockResponse)).to.be.equal(true);
        });

        it('o body deve conter as chaves "productId" e "quantity"', async () => {
          await salesControllers.updateSale(request, response);
          expect(request.body[0]).to.have.all.keys('productId', 'quantity');
        });

        it('o params deve conter a chave "id"', async () => {
          await salesControllers.updateSale(request, response);
          expect(request.params).to.have.property('id');
        });
      });
    });

    describe('quando não é possivel atualizar uma venda', () => {
      const error = new Error();
      const request = {};
      const response = {};
      let next = {};

      const expectError = {
        err: {
          code: 'invalid_data',
          message: 'Wrong product ID or invalid quantity',
        }
      };

      beforeEach(() => {
        error.statusCode = 'invalidSale';
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, 'updateSale').throws(error);
      });

      afterEach(() => {
        salesService.updateSale.restore();
      });

      it('responde com o status 422', async () => {
        await mwError(error, request, response, next);
        expect(response.status.calledWith(422)).to.be.equal(true);
      });

      it('retorna um json com o erro esperado', async () => {
        await mwError(error, request, response, next);
        expect(response.json.calledWith(expectError)).to.be.equal(true);
      });
    })
  });

  describe('Testes do controller "deleteSale', () => {
    describe('quando a função retorna com sucesso', () => {
      const response = {};
      const request = {};
      const deleteMockResponse = {
        _id: '614222e61b9b0fa943983c70',
        itensSold: [
          {
            productId: '614222d61b9b0fa943983c6f',
            quantity: 10,
          },
        ],
      };

      describe('a resposta', () => {
        beforeEach(() => {
          request.params = { id: "61418aa32e836090602e61a3" }
          response.status = sinon.stub()
            .returns(response);
          response.json = sinon.stub()
            .returns();
          sinon.stub(salesService, 'deleteSale').resolves(deleteMockResponse);
        });

        afterEach(() => {
          salesService.deleteSale.restore();
        });

        it('retorna o status 200', async () => {
          await salesControllers.deleteSale(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('retorna um json com a venda deletada', async () => {
          await salesControllers.deleteSale(request, response);
          expect(response.json.calledWith(deleteMockResponse)).to.be.equal(true);
        });

        it('o params deve conter a chave "id"', async () => {
          await salesControllers.deleteSale(request, response);
          expect(request.params).to.have.property('id');
        });
      });
    });

    describe('quando há um erro', () => {
      const error = new Error();
      const request = {};
      const response = {};
      let next = {};

      describe('a venda não existe', () => {

        const expectError = {
          err: {
            code: 'invalid_data',
            message: 'Wrong sale ID format',
          },
        };

        beforeEach(() => {
          error.statusCode = 'unprocessable';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(salesService, 'deleteSale').throws(error);
        });

        afterEach(() => {
          salesService.deleteSale.restore();
        });

        it('responde com o status 422', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(422)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });

      describe('quando não há estoque do produto', () => {
        const expectError = {
          err: {
            code: 'stock_problem',
            message: 'Such amount is not permitted to sell',
          },
        };

        beforeEach(() => {
          error.statusCode = 'stockProblem';
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          sinon.stub(salesService, 'newSale').throws(error);
        });

        afterEach(() => {
          salesService.newSale.restore();
        });

        it('retorna o status 404', async () => {
          await mwError(error, request, response, next);
          expect(response.status.calledWith(404)).to.be.equal(true);
        });

        it('retorna um json com o erro esperado', async () => {
          await mwError(error, request, response, next);
          expect(response.json.calledWith(expectError)).to.be.equal(true);
        });
      });
    });
  });
});
